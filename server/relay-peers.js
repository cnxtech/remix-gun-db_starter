const Gun = require('gun');
const getUrls = require('get-urls');
require('gun/lib/then.js')
// Suppress extraneous GUN logging
let cl = console.log;
console.log = () => { };
const host = process.env.DOMAIN || '0.0.0.0'
const ports = {
  RELAY: process.env.GUN_PORT || 5150,
  CLIENT: process.env.CLIENT_PORT || 3333
}
const Relays = async () => {
  let gunRelays= [];
  
  const gun = new Gun({
    peers: [`http://${host}:${ports.CLIENT}/gun`, `http://${host}:${ports.RELAY}/gun`],
    localStorage: false,
  })
  


  let results = await getVal('relay-peers', 'relays', gun)
  // check gun first
/// swear ta meeee!
  async function getVal(document, key, gun) {
    return new Promise((resolve) =>
      key
        ? gun.get(document).get(key).once(async (data) => {
          console.log('data:', data)
          resolve(data)
        })
        : gun.get(document).once(async (data) => resolve(data))
    )
  }

  if (results) gunRelays = results
  else gunRelays = await fetchRelays();

  // if gun has no results, fetch them from github & update gun
  async function fetchRelays() {
    let res = await fetch(
      'https://github.com/amark/gun/wiki/volunteer.dht/_edit'
    );
    let data = await res.text();

    let urls = getUrls(data);
    urls = Array.from(urls);
    urls.forEach((u) => {
      let testUrl = new URL(u);
      if (testUrl.pathname === '/gun') {
        gunRelays.push(testUrl.href);
      }
    });


    let put = await putVal('relay-peers', 'relays', gunRelays, gun);

    if (!put) {
      console.error(`Could not put ${gunRelays} as gun-relays`)
    }


    //// put it ... on god
    async function putVal(document, key, value, gun) {
     return new Promise((resolve) => {
       gun.get(document).get(key).put(value, (ack) => {
         resolve(ack.ok ? 'Added data!' : ack.err?.message ?? undefined);
       })
     })
    }
    
    


    return gunRelays;
  }

  // restore normal console logging
  console.log = cl;

  return gunRelays;
};



