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

// require('./restrict-put')

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


Gun({
  web: _server,
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
