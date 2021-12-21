import Gun from 'gun';
import Relays from '~/lib/constants/relay-peers';
import 'gun/lib/radix';
import 'gun/lib/radisk';
import 'gun/lib/store';
import 'gun/lib/rindexed';
import 'gun/lib/not.js';
import { IGunConstructorOptions } from 'gun/types/options';
import { IGunChainReference } from 'gun/types/chain';


let gunOpts = async () => {
  let relay = await Relays();
  let relayOpts: IGunConstructorOptions = {
    peers: relay,
      // set localStorage to false to use indexedDB (>10mb storage)
    localStorage: false
  };
  return relayOpts
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


export type UseGunType = {
  gun: IGunChainReference; // to load into client memory
  user: IGunChainReference;// to load into client memory
  createUser: (username: string, password: string) => Promise<string | undefined>;
  login: (username: string, password: string) => Promise<{ ok: boolean, result: any }>;
  resetPassword: (username: string, oldPassword: string, newPassword: string) => Promise<{ ok: boolean, result: string }>;
  getData: (document: string, key?: string, decryptionKey?: string) => Promise<any>;
  addData: (document: string, key: string, value: any, encryptionKey?: string) => Promise<string>;
  getKey: (alias: string, password: string) => Promise<{ ok: boolean, result: string }>;
  setKey: (alias: string, password: string) => Promise<any>;
}

export function Strapd(): UseGunType {

  console.log('using gun')
  const gun = Gun(gunOpts);
  const user = gun.user().recall({ sessionStorage: true });

  const createUser = async (username: string, password: string): Promise<string | undefined> =>
    new Promise((resolve) => user.create(username, password, (ack) => {
      console.log(ack)
      if (Object.getOwnPropertyNames(ack).includes('ok')) {
        resolve(undefined)
      } else {
        resolve(JSON.parse(JSON.stringify(ack)).err)
      }
    }));

  const login = (username: string, password: string): Promise<{ ok: boolean, result: any }> =>
    new Promise((resolve) => user.auth(username, password, (ack) => {
      if (Object.getOwnPropertyNames(ack).includes('id')) {
        resolve({ ok: true, result:(ack as any).get });
      } else {
        resolve({ ok: false, result: JSON.parse(JSON.stringify(ack)).err })
      }
    }))

  const addData = async (document: string, key: string, value: any, encryptionKey?: string): Promise<string> => {
    if (encryptionKey) {
      value = await Gun.SEA.encrypt(value, encryptionKey);
    }
    return new Promise((resolve) => {
     user.get(document).get(key).put(value as never, (ack) => {
        resolve(ack.ok ? 'Added data!' : ack.err?.message ?? 'Could not add data');
      })
    })
  }


  return {
    gun,
    user,
    createUser,
    login,
    resetPassword: (username: string, oldPassword: string, newPassword: string) =>
      new Promise((resolve) => user.auth(username, oldPassword, (ack) => {
        console.log(ack)
        if (Object.getOwnPropertyNames(ack).includes('ok')) {
          resolve({ ok: true, result: '' });
        } else {
          resolve({ ok: false, result: JSON.parse(JSON.stringify(ack)).err })
        }
      }, { change: newPassword })),
    getData: (document: string, key?: string, decryptionKey?: string) => {
      return new Promise((resolve) =>
        key
          ? user.get(document).get(key).once(async (data) => {
            console.log('data:', data)
            decryptionKey
              ? resolve(await Gun.SEA.decrypt(data, decryptionKey))
              : resolve(data)
          })
          : user.get(document).once(resolve)
      )
    },
    addData,
    getKey: (alias: string, password: string) =>
      new Promise((resolve) =>
        gun.get(`~@${alias}`).once(async (exists) => {
          if (!exists) {
            const err = await createUser(alias, password);
            if (err) {
              resolve({ ok: false, result: err })
            }
          }
          const { ok, result } = await login(alias, password);
          if (!ok) {
            resolve({ ok, result })
          }

          user.get('keys').get('master').once(async (data) => {
            if (!data) {
              resolve({ ok: false, result: 'could not find key' })
            } else {
              const decrypted = await Gun.SEA.decrypt(data, password)
              if (typeof decrypted === 'string') {
                resolve({ ok: true, result: decrypted as string });
              }

            }
          })
        })),
    setKey: async (alias: string, password: string) =>
      new Promise((resolve) =>
        gun.get(`~@${alias}`).once(async (user) => {
          if (!user) {
            
            const err = await createUser(alias, password);
            if (err) {
              resolve({ ok: false, result: err })
            }
          }
          const { ok, result } = await login(alias, password);
          if (!ok) {
            resolve({ ok, result })
          }

          const res = await addData('keys', 'master',  result, password)
          if (res === 'Added data!') {
            resolve({ ok: true, result: res })
          } else {
            resolve({ ok: false, result: res })
          }
        })
      )
  }
}
