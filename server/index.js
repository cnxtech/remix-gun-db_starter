const path = require("path");
const express = require("express");
const compression = require("compression");
const morgan = require("morgan");
const { createRequestHandler } = require("@remix-run/express");

/**
 * GUN SERVER
 */

let Gun = require('gun');
const i = process.env.GUN_NODE;

const ports = {
  '0': {
    RELAY: process.env.GUN_PORT || 5150,
    NODE: process.env.CLIENT_PORT || 8081,
    CLIENT: 3333
  },
  '1': {
    RELAY: 8090,
    NODE: 8091,
    CLIENT: 3001
  }
}

if (!ports[i]) {
  throw Error('GUN_NODE must be 0 or 1')
}


const http = require('http');
// runs full relay peer (will sync all data)
const relay = Gun({
  file: `data_${ports[i].RELAY}`,
  web: http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(req.url);
    res.end()
  }).listen(ports[i].RELAY, () => console.log('GUN relay peer running on :' + ports[i].RELAY))
});

/**
 * REMIX APP
 */
const MODE = process.env.NODE_ENV;
const BUILD_DIR = path.join(process.cwd(), "server/build");


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

Gun({
  file: `data${ports[i].CLIENT}.relay`,
  web: app.listen(ports[i].CLIENT, () => {
    console.log(`Express server listening on port ${ports[i].CLIENT}`);
  }),
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
