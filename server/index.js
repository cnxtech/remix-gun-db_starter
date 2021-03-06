const path = require('path');
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const { createRequestHandler } = require('@remix-run/express');
// const { createContext } = require('remix-gun-context');
/**
 * GUN Relay
 */
let env = {
  PUB: process.env.PUB,
  PRIV: process.env.PRIV,
  EPUB: process.env.EPUB,
  EPRIV: process.env.EPRIV,
  GUN_PORT: process.env.GUN_PORT,
  CLIENT_PORT: process.env.CLIENT_PORT,
  DOMAIN: process.env.DOMAIN,
};
if (!env) {
  throw Error();
}

const ports = {
  DOMAIN: env.DOMAIN,
  RELAY: env.GUN_PORT,
  CLIENT: env.CLIENT_PORT,
};

/** Private Gun relay that can only be reached by client  */
let Gun = require('gun');
const http = require('http');

Gun({
  file: `${ports.RELAY}.private_relay`,
  web: http
    .createServer()
    .listen(ports.RELAY, () =>
      console.log('private relay peer running on :' + ports.RELAY)
    ),
});

/**
 * REMIX APP
 */
const MODE = process.env.NODE_ENV;
const BUILD_DIR = path.join(process.cwd(), 'server/build');

let app = express();
app.use(compression());
app.use(Gun.serve);

// You may want to be more aggressive with this caching
app.use(express.static('public', { maxAge: '1h' }));

// Remix fingerprints its assets so we can cache forever
app.use(express.static('public/build', { immutable: true, maxAge: '1y' }));

app.use(morgan('tiny'));
app.all(
  '*',
  MODE === 'production'
    ? createRequestHandler({
        build: require('./build'),
        // load context
      })
    : (req, res, next) => {
        purgeRequireCache();
        let build = require('./build');
        // function getLoadContext(req, res) {
        //   return createContext();
        // }
        return createRequestHandler({ build, mode: MODE })(
          req,
          res,
          next
        );
      }
);
const peers = [
  `http://${ports.DOMAIN}:${ports.CLIENT}gun` ||
  `https://${ports.DOMAIN}:${ports.CLIENT}gun`,
 
];
Gun({
  peers: peers,
  web: app.listen(ports.CLIENT, () => {
    console.log(`Express server listening on port ${ports.CLIENT}`);
  }),
  localStorage: true,
  radisk: false,
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
