import Gun from 'gun/gun'
import { IGunConstructorOptions } from 'gun/types/options'
import { newNameSpace } from './Models'
import Relays from '~/lib/constants/relay-peers';
import 'gun/lib/radix';
import 'gun/lib/radisk';
import 'gun/lib/store';
import 'gun/lib/rindexed';
import 'gun/lib/not.js';

const port = process.env.PORT ||'5150'
const address = process.env.URL || '0.0.0.0'
const peers = [`http://${address}:${port}/gun`]

let gunOpts = async () => {
  let relay = await Relays();
  let relayOpts: IGunConstructorOptions = {
    peers: relay,
  };
  return relayOpts
}
export const gun = Gun(gunOpts);



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
