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
console.log('using gun')
// gun instances that link to some peers-no peers
const gun = Gun(gunOpts);
const localStorj = Gun('http://localhost:5150/gun')



export { gun, gunOpts, localStorj } 