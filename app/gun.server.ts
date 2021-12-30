import Gun from 'gun';
import { IGunChainReference } from 'gun/types/chain';
import { IGunConstructorOptions } from 'gun/types/options';
import invariant from 'tiny-invariant';
import Relays from '~/lib/utility-fx/relay-peers';
let gunOpts = async () => {
    let relay = await Relays();
    let relayOpts: IGunConstructorOptions = {
        peers: relay,
        localStorage: false
    };
    return relayOpts
}


// gun instances that link to some peers-no peers
const gun = Gun(gunOpts);
export { gun, gunOpts} 