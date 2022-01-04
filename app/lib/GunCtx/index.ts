import Gun from 'gun';
import { IGunChainReference } from 'gun/types/chain';
import { IGunConstructorOptions } from 'gun/types/options';
import Relays from '~/lib/GunCtx/relay-peers';
import { getUser } from '~/session.server';
import { GunCtx } from './models';

let gunOpts = async () => {
    let relay = await Relays();
    let relayOpts: IGunConstructorOptions = {
        peers: relay,
        localStorage: false
    };
    return relayOpts
}


// gun instances that link to some peers-no peers
export const gun = Gun(gunOpts);



 export const { putVal, getVal, getDoc, putDoc, getKey, setKey, resetPassword, getUserInfo } = GunCtx()
