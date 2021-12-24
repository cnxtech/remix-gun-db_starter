import Gun from 'gun';
import { IGunConstructorOptions } from 'gun/types/options';
import Relays from '~/lib/constants/relay-peers';
let gunOpts = async () => {
    let relay = await Relays();
    let relayOpts: IGunConstructorOptions = {
        peers: relay,
        // set localStorage to false to use indexedDB (>10mb storage)
        localStorage: false
    };
    return relayOpts
}
console.log('using gun')
const gun = Gun(gunOpts);


export { gun, gunOpts }