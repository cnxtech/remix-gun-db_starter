import Gun from 'gun';
// import Sea from 'gun/sea';
import Relays from '~/lib/constants/relay-peers';
import 'gun/lib/radix';
import 'gun/lib/radisk';
import 'gun/lib/store';
import 'gun/lib/rindexed';
import 'gun/lib/not.js';
import { IGunChainReference } from 'gun/types/chain';
import { IGunConstructorOptions } from 'gun/types/options';
import { EventEmitter } from 'events';
import { IGunStaticSEA } from 'gun/types/static/sea';
import { json } from 'remix';

let gunOpts = async() => {
 let relay = await Relays();
 let relayOpts: IGunConstructorOptions = {
  peers: relay,
};
return relayOpts
}
export const gun = Gun(gunOpts);


interface Admin {
  pubKey: string;
  name: string;
}

export const sea = Gun.SEA;
//storage compressor
// const LZString = require('~/utils/lzstring');

// const [GunCtx, GunDispatch,  GunProvider] = createCtxWithReducer();
/*
Passswordless SignUp
*/
export const signUp = async (username: string, password: string) => {
  gun.user().create(username, password, ({ ack }: any) => {
    gun
      .user(ack.pub)
      .get('auth')
      .on(() => {
        gun.user(ack.pub).put({ username: username, pub: ack.pub });
      });
  });
  gun.user().recall({ sessionStorage: true });
  const auth = gun.user().auth(username, password);
  const data = auth.user().on((data: any, key: 'auth') => {
    json({ pub: data.pub });
  });
  return data;
};

export const auth = async (username: string, password: string) => {
  let relays = await Relays();
  const gunOpts: IGunConstructorOptions = {
    peers: relays,
  };
  const gun = Gun(gunOpts);
  gun.user().recall({ sessionStorage: true });
  const auth = gun.user().auth(username, password);
  const data = auth.user().on((data: any, key: 'auth') => {
    json({ pub: data.pub });
  });
  return data;
}

// Date function
export const getDate = () => {
  const newDate = new Date();
  var dd = String(newDate.getDate()).padStart(2, 'O');
  var mm = String(newDate.getMonth() + 1).padStart(2, 'O');
  var yyyy = newDate.getFullYear();
  var timestamp = mm + '-' + dd + '-' + yyyy + ':' + newDate;
  return timestamp;
}


