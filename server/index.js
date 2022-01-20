const path = require('path');
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const { createRequestHandler } = require('@remix-run/express');
/**
 * GUN Relay
 */

let Gun = require('gun');

const ports = {
  RELAY: process.env.GUN_PORT,
  CLIENT: process.env.CLIENT_PORT
};

if (!ports) {
  throw Error('Set your environment variables ya dingus!');
}

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
    ? createRequestHandler({ build: require('./build') })
    : (req, res, next) => {
      purgeRequireCache();
      let build = require('./build');
      return createRequestHandler({ build, mode: MODE })(req, res, next);
    }
);
 const peers = [
  `http://localhost:${ports.RELAY}/gun`,
  'https://relay.peer.ooo/gun',
  'https://replicant.adamantium.online/gun',
  'http://gun-matrix.herokuapp.com/gun',
  'https://gun-ams1.maddiex.wtf:443/gun',
  'https://gun-sjc1.maddiex.wtf:443/gun',
  'https://shockblox-gun-server.herokuapp.com/gun',
  'https://mg-gun-manhattan.herokuapp.com/gun',
  'https://gunmeetingserver.herokuapp.com/gun',
  'https://gun-eu.herokuapp.com/gun',
  'https://gunjs.herokuapp.com/gun',
  'https://myriad-gundb-relay-peer.herokuapp.com/gun',
  'https://gun-armitro.herokuapp.com/',
  'https://fire-gun.herokuapp.com/gun',
  'http://34.101.247.230:8765/gun',
  'https://gun-manhattan.herokuapp.com/gun',
  'https://us-west.xerberus.net/gun',
  'https://dletta.rig.airfaas.com/gun',
  'https://e2eec.herokuapp.com/gun']
Gun({
  peers: peers,
  web: app.listen(ports.CLIENT, () => {
    console.log(`Express server listening on port ${ports.CLIENT}`);
  }),
  localStorage:false,
  radisk: false
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
