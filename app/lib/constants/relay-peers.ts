import Gun from 'gun';
import fetch from 'node-fetch';
import getUrls from 'get-urls';
import { json } from 'remix';
require('gun/lib/then.js')
// Suppress extraneous GUN logging
let cl = console.log;
console.log = () => {};

const Relays = async () => {
  let gunRelays:Array<string> = [];

  let gun = new Gun({
    peers: ['http://0.0.0.0:3369/gun','https://relay.gun.ooo', 'https://gunjs.herokuapp.com'],
    file: 'relays',
  });

  // check gun first
  let results = await gun
    .get('relay-peers')
    .get('relays')
    .on((data) => {
      // apparently, don't have to do anything here
    })
    // @ts-ignore
    .then();


  if (results) gunRelays = JSON.parse(results);
  else gunRelays = await fetchRelays();

  // if gun has no results, fetch them from github & update gun
  async function fetchRelays() {
    let res = await fetch(
      'https://github.com/amark/gun/wiki/volunteer.dht/_edit'
    );
    let data = await res.text();

    let urls:any = getUrls(data);
    urls = Array.from(urls);
    urls.forEach((u: string | URL) => {
      let testUrl = new URL(u);
      if (testUrl.pathname === '/gun') {
        gunRelays.push(testUrl.href);
      }
    });

    gun.get('relays').get('relays').put(json(gunRelays));

    return gunRelays;
  }

  // restore normal console logging
  console.log = cl;

  return gunRelays;
};

export default Relays;
