const path = require("path");
const express = require("express");
const compression = require("compression");
const morgan = require("morgan");
const { createRequestHandler } = require("@remix-run/express");
const jwt = require('jsonwebtoken');
let Gun = require('gun');
const SEA = require('gun/sea');
const MODE = process.env.NODE_ENV;
const BUILD_DIR = path.join(process.cwd(), "server/build");

require('./restrict-put')

let app = express();
app.use(compression());
app.use(Gun.serve);


// You may want to be more aggressive with this caching
app.use(express.static("public", { maxAge: "1h" }));

// Remix fingerprints its assets so we can cache forever
app.use(express.static("public/build", { immutable: true, maxAge: "1y" }));

app.use(morgan("tiny"));
app.all(
  "*",
  MODE === "production"
    ? createRequestHandler({ build: require("./build") })
    : (req, res, next) => {
        purgeRequireCache();
        let build = require("./build");
        return createRequestHandler({ build, mode: MODE })(req, res, next);
      }
);

let port = process.env.PORT || 3369;
app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});

const _port = process.env.PORT || 5150;
const APP_KEY_PAIR = process.env.APP_KEY_PAIR;
const APP_TOKEN_SECRET = process.env.APP_TOKEN_SECRET;
const _server = app.listen(_port, () => {
  console.log(`Database is listening at http://localhost:${_port}/gun`);
});

// verify JWT from gun message
function verifyToken(msg) {
  if (msg?.headers?.accessToken) {
    try {
      jwt.verify(msg.headers.accessToken, APP_TOKEN_SECRET);

      return true;
    } catch (err) {
      const error = new Error('Invalid access token');

      if (err.name === 'TokenExpiredError') {
        // you might want to implement silent refresh here
        error.expiredAt = err.expiredAt;
      }

      return error;
    }
  }

  return false;
}
const gun = Gun({
  web: _server,
  isValid: verifyToken,
});

// Sync everything
gun.on('out', { get: { '#': { '*': '' } } });

// Authorize this app as a user
gun.user().auth(APP_KEY_PAIR, ({ err }) => {
  // TODO handle app auth error
  if (err) {
    console.error(err);
  }
});

// parse application/json
app.use(express.json());

//TODO: CORS for multiple http origins
//  app.use(cors())

app.post('/api/certificates', async (req, res) => {
  const { username, pub: userPubKey } = req.body;

  // See https://gun.eco/docs/SEA.certify for policies
  const policy = [
    // allow users to add and edit their profiles with:
    //   gun
    //     .get('~'+app.pub)
    //     .get('profiles')
    //     .get(user.pub)
    //     .put({ name: 'alice' }, null, {opt: { cert: certificate }} )
    { '*': 'profiles', '+': '*' },
  ];

  // expire in 2 hours
  const expiresAt = Date.now() + 60 * 60 * 1000 * 2;

  const certificate = await SEA.certify(
    [userPubKey],
    policy,
    APP_KEY_PAIR,
    ({ err }) => {
      if (err) {
        console.log(`Error creating certificate for ${username}:`, err);
      } else {
        console.log(`Successfully created certificate for ${username}`);
      }
    },
    // FIXME neither expiry or block seem to be working?
    // https://github.com/amark/gun/issues/1143
    {
      // expiry: expiresAt,
      // // name of path to blocked/banned users
      // block: 'blocked',
    }
  );

  res.status(201).send({
    certificate,
    expires_at: expiresAt,
  });
});

app.post('/api/tokens', async (req, res) => {
  const { username, pub } = req.body;

  const token = jwt.sign({ username, pub }, APP_TOKEN_SECRET, {
    expiresIn: '1h',
  });

  res.status(201).send({
    accessToken: token,
  });
});

////////////////////////////////////////////////////////////////////////////////
function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, we prefer the DX of this though, so we've included it
  // for you by default
  for (let key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key];
    }
  }
}
