
import 'gun/lib/radix';
import 'gun/lib/radisk';
import 'gun/lib/store';
import 'gun/lib/rindexed';
import 'gun/lib/not.js';
import 'gun/lib/open'
import 'gun/lib/load'
import 'gun/lib/path'
import 'gun/lib/then'
import invariant from 'tiny-invariant';
import { gun} from '~/gun.server';
import Gun from 'gun';




// Date function
export const getDate = () => {
  const newDate = new Date();
  var timestamp = newDate;
  return timestamp;
}


export type GunClientType = {
  createUser: (username: string, password: string) => Promise<string | undefined>;
  login: (username: string, password: string) => Promise<{ ok: boolean, result: any }>;
  resetPassword: (username: string, oldPassword: string, newPassword: string) => Promise<{ ok: boolean, result: string }>;
  getData: (path: string, key?: string, decryptionKey?: string) => Promise<any>;
  putData: (path: string, key: string, value: any, encryptionKey?: string) => Promise<string>;
  mapData: (path: string, decryptionKey?: string) => Promise<any>;
  // setData: (path: string, key: string, value: any, encryptionKey?: string) => Promise<string>;
  getKey: (alias: string, password: string) => Promise<{ ok: boolean, result: string }>;
  setKey: (alias: string, password: string) => Promise<any>;
}

export function GunClient(): GunClientType {

let user = gun.user()

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

  const putData = async (document: string , key: string, value: any, encryptionKey?: string): Promise<string> => {
    if (encryptionKey) {
      value = await Gun.SEA.encrypt(value, encryptionKey);
    }
    return new Promise((resolve) => {
     user.get(document).get(key).put(value, (ack) => {
        resolve(ack.ok ? 'Added data!' : ack.err?.message ?? 'Could not add data');
      })
    })
  }
 
  const mapData = async (document: string , key:string, decryptionKey?: string): Promise<any> => {
    return new Promise((resolve) =>
  user.get(document).get(key).once(async (data:any) => {
    Object.keys(data).forEach(async(data)=> {
      console.log('data:', data) 
          decryptionKey ? 
          resolve(await Gun.SEA.decrypt(data, decryptionKey))
        : resolve(data)}) 
  }))}



  return {
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
    getData: (document: string , key?: string, decryptionKey?: string) => {
      return new Promise((resolve) =>
        key
          ? user.get(document).get(key).once(async (data) => {
            console.log('data:', data)
            decryptionKey
              ? resolve(await Gun.SEA.decrypt(data, decryptionKey))
              : resolve(data)
          })
          : user.get(document).once(async(data) => resolve(data))
      )
    },
    mapData,
    putData,
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
              resolve({ ok: false, result: 'Could Not Find Key Associated With This User' });
            } else {
              const decrypted = await Gun.SEA.decrypt(data, password)
              if (typeof decrypted === 'string') {
                resolve({ ok: true, result: decrypted as string });
              }

            }
          })
        })),
    setKey: async (username: string, password: string) =>
      new Promise((resolve) =>
        gun.get(`~@${username}`).once(async (user) => {
          invariant(username && password, 'string');
          if (!user) {
            const err = await createUser(username, password);
            if (err) {
              resolve({ ok: false, result: err });
            }
          }
          const { ok, result } = await login(username, password);
          if (!ok) {
            resolve({ ok, result });
          }

          const res = await putData('keys', 'master', result, password);
          if (res === 'Added data!') {
            resolve({ ok: true, result: result });
          } else {
            resolve({ ok: false, result: res });
          }
        })
      )
  }
}
