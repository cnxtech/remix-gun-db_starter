import Gun from 'gun';
import { IGunConstructorOptions } from 'gun/types/options';
import Relays from '~/lib/utility-fx/relay-peers';
let gunOpts = async () => {
    let relay = await Relays();
    let relayOpts: IGunConstructorOptions = {
        peers: relay,
        // set localStorage to false to use indexedDB (>10mb storage)
        // localStorage: false
    };
    return relayOpts
}
const ports = {
    RELAY: process.env.GUN_PORT || 5150,
    CLIENT: process.env.CLIENT_PORT || 3333
}

// gun instances that link to some peers-no peers
const gun = Gun(gunOpts);
const localStorj = Gun({ peers: [`http://localhost:${ports.CLIENT}/gun`, `http://localhost:${ports.RELAY}/gun`]})
const privateStorj = Gun({peers:[`http://localhost:${ports.RELAY}/gun`], localStorage:false})


export { gun, gunOpts, localStorj, privateStorj } 