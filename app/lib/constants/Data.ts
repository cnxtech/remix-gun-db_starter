import Gun from 'gun/gun'
import { IGunConstructorOptions } from 'gun/types/options'
import { newNameSpace } from './Models'
import Relays from '~/lib/constants/relay-peers';
import 'gun/lib/radix';
import 'gun/lib/radisk';
import 'gun/lib/store';
import 'gun/lib/rindexed';
import 'gun/lib/not.js';
import { json } from 'remix';

const jwt = require('jsonwebtoken');
const APP_TOKEN_SECRET = process.env.APP_TOKEN_SECRET;

function verifyToken(msg: any) {
  if (msg?.headers?.accessToken) {
    try {
      jwt.verify(msg.headers.accessToken, APP_TOKEN_SECRET);

      return true;
    } catch (err) {
      const error = new Error('Invalid access token');
      // @ts-ignore
      if (err.name === 'TokenExpiredError') {
        // you might want to implement silent refresh here
        // @ts-ignore
        error.expiredAt = err.expiredAt;
      }

      return error;
    }
  }

  return false;
}
let gunOpts = async () => {
  let relay = await Relays();
  let relayOpts: IGunConstructorOptions = {
    peers: relay,
  };
  return relayOpts
}
export const gun = Gun(gunOpts);

export const user = gun
  .user()
  // save user creds in session storage
  // this appears to be the only type of storage supported.
  // use broadcast channels to sync between tabs
  .recall({ sessionStorage: true });

export const signUpOrJoin = async (username: string, password: string) => {
try {
    user.create(username, password, ( ack : any) => {
    user
      .get(ack.pub)
      .get('auth')
      .on(() => {
        gun.user(ack.pub).put({ username: username, pub: ack.pub });
      });
    if (!ack) {
      user.auth(username, password);
      user.get('auth').get(`${ack.pub}`).on((data: any) => {
        console.log({ pub: data.pub });
      });
      return user;
    }
  });

} catch (error) {
  console.log(error);
}

};

export const createNameSpace = (name:string, soul:string) => {
  const nameSpace: Array<any> = newNameSpace(name, soul)
  console.log('Creating', nameSpace)
  gun.get('history').get('nameSpaces').get(`${nameSpace[0]}`).set( nameSpace[1])
  gun.get('nameSpaces').get(`${nameSpace[0]}`).put(nameSpace[1])
}

export const updateNameSpace = (nameSpace: any[], updates: any) => {
  let nameSpaceEdit = nameSpace
  Object.assign(nameSpaceEdit[1], updates)
  if (nameSpaceEdit[1].deleted) { nameSpaceEdit[1].deleted = null }
  nameSpaceEdit[1].edited = new Date().toString()
  console.log('Updating', nameSpaceEdit)
  gun.get('history').get('nameSpaces').get(nameSpace[0]).set(nameSpaceEdit[1])
  gun.get('nameSpaces').get(nameSpaceEdit[0]).put(nameSpaceEdit[1])
}

// explict updating for debuggin
// export const updatenameSpace = (nameSpace, updates) => {
//   let nameSpaceEdit = nameSpace
//   nameSpaceEdit[1].name = updates.name
//   nameSpaceEdit[1].color = updates.color
//   if (nameSpaceEdit[1].deleted) { nameSpaceEdit[1].deleted = null }
//   nameSpaceEdit[1].edited = new Date().toString()
//   console.log('Updating', nameSpaceEdit)
//   gun.get('history').get('nameSpaces').get(nameSpace[0]).set(nameSpaceEdit[1])
//   gun.get('nameSpaces').get(nameSpaceEdit[0]).put(nameSpaceEdit[1])
// }

export const restoreNameSpace = (nameSpace: any) => {
  let restorednameSpace = nameSpace
  // restorednameSpace[1].restored = new Date().toString()
  if (restorednameSpace[1].status === 'deleted') {
    restorednameSpace[1].status = 'active'
    // gun.get('history').get('nameSpaces').get(restorednameSpace[0]).set(restorednameSpace[1])
  }
  console.log('Restoring', restorednameSpace)
  gun.get('nameSpaces').get(restorednameSpace[0]).put(restorednameSpace[1])
}


export const deleteNameSpace = (nameSpace: any[]) => {
  console.log('Deleting', nameSpace)
  let nameSpaceDelete = nameSpace
  nameSpaceDelete[1].deleted = new Date().toString()
  gun.get('history').get('nameSpaces').get(nameSpaceDelete[0]).set(nameSpaceDelete[1])
  nameSpaceDelete[1].status = 'deleted'
  gun.get('nameSpaces').get(nameSpace[0]).put(nameSpaceDelete[1])
}
