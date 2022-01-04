
import 'gun/lib/radix';
import 'gun/lib/radisk';
import 'gun/lib/store';
import 'gun/lib/rindexed';
import 'gun/lib/not.js';
import 'gun/lib/then'
import invariant from 'tiny-invariant';
import { IGunCryptoKeyPair } from 'gun/types/types';
import { IGunStaticSEA } from 'gun/types/static/sea'
import { IGunChainReference } from 'gun/types/chain';
import Gun from 'gun';
import {gun} from './index'



interface Object {
  [key: string]: string;
}

interface PutDocOpts {
  encryptionKey: string
  set: string
}


type UserData = {
  id: string;
  alias: string;
  createdAt: string;
  lastLogin: string;
};

type Socials = {
  facebook: SocialData;
  twitter: SocialData;
  linkedIn: SocialData;
  github: SocialData;
};

type SocialData = {
  brand: string;
  url: string;
  color?: string;
};

export type GunCtxType = {
  createUser: (username: string, password: string) => Promise<{ ok: boolean, result: string | undefined }>;
  login: (username: string, password: string) => Promise<{ ok: boolean, result: any }>;
  resetPassword: (username: string, oldPassword: string, newPassword: string) => Promise<{ ok: boolean, result: string }>;
  getVal: (get: string, key?: string, decryptionKey?: string) => Promise<any>;
  getDoc: (document: string, key: Array<string>, decryptionKey?: string) => Promise<any>;
  putVal: (get: string, key: string, value: any, encryptionKey?: string) => Promise<string>;
  putDoc: (document: string, obj: Object, encryptionKey?: string) => Promise<string>
  getKey: (alias: string, password: string) => Promise<{ ok: boolean, result: string }>;
  setKey: (alias: string, password: string) => Promise<any>;
  getUserInfo: (alias: string) => Promise<{ ok: boolean, result: string | UserData}>;
}

export function GunCtx( ): GunCtxType {
  const encrypt = async (
    data: any,
    keys: undefined | string | IGunCryptoKeyPair
  ) => {
    console.log('Encrypting data...')
    return keys && Gun.SEA.encrypt(data, keys)
  };

  const decrypt = async (
    data: any,
    keys: undefined | string | IGunCryptoKeyPair,
  ) => {
    console.log('Decrypting data...')
    return keys && Gun.SEA.decrypt(data, keys);
  };


  let user = gun.user()

  const createUser = async (username: string, password: string): Promise<{ ok: boolean, result: string | undefined }> =>
    new Promise((resolve) => user.create(username, password, (ack) => {
      console.log(ack)
      if (Object.getOwnPropertyNames(ack).includes('ok')) {
        resolve({ ok: true, result: undefined })
      } else {
        resolve({ ok: false, result: JSON.parse(JSON.stringify(ack)).err })
      }
    }));

  const login = (username: string, password: string): Promise<{ ok: boolean, result: any }> =>
    new Promise((resolve) => user.auth(username, password, (ack) => {
      if (Object.getOwnPropertyNames(ack).includes('id')) {

        resolve({ ok: true, result: (ack as any).get });
      } else {
        resolve({ ok: false, result: JSON.parse(JSON.stringify(ack)).err })
      }
    }))

  const putVal = async (document: string, key: string, value: any, encryptionKey?: string): Promise<string> => {
    if (encryptionKey) {
      value = await encrypt(value, encryptionKey);
    }
    return new Promise((resolve) => {
      gun.get(document).get(key).put(value, (ack) => {
        resolve(ack.ok ? 'Added data!' : ack.err?.message ?? 'Could not add data');
      })
    })
  }


  const putDoc = async (document: string, obj: Object , encryptionKey?: string): Promise<string> => {
    return new Promise((resolve) =>
          Object.entries(obj).forEach(async ([key, value]) => {
          if (encryptionKey) {
            const res = await putVal(document, key, value, encryptionKey)
            if (res !== 'Added data!') {
              resolve(`There was a problem adding data at key ${key} with a value of ${value} to document ${document}`)
            }
            resolve(undefined)
          }
          const res = await putVal(document, key, value)
          if (res !== 'Added data!') {
            resolve(`There was a problem adding data at key ${key} with a value of ${value} to document ${document}`)
          }
          resolve(undefined)
        })
    )
  }

  const getDoc = (document: string, key: Array<string>, decryptionKey?: string) => {
    return new Promise((resolve) =>
      key.forEach((key) => gun.get(document).get(key).once(async (data) => {
          console.log('data:', data)
          if (decryptionKey) {
            data = await decrypt(data, decryptionKey)
          }
        resolve(`${key}: ${data}`)
        })
       )
    )
  }


  return {
    createUser,
    login,
    resetPassword: (username: string, oldPassword: string, newPassword: string) =>
      new Promise((resolve) => user.auth(username, oldPassword, (ack) => {
        console.log(ack)
        if (Object.getOwnPropertyNames(ack).includes('ok')) {
          resolve({ ok: true, result: undefined });
        } else {
          resolve({ ok: false, result: JSON.parse(JSON.stringify(ack)).err })
        }
      }, { change: newPassword })),
    getVal: (document: string, key?: string, decryptionKey?: string) => {
      return new Promise((resolve) =>
        key
          ? gun.get(document).get(key).once(async (data) => {
            console.log('data:', data)
            decryptionKey
              ? resolve(await decrypt(data, decryptionKey))
              : resolve(data)
          })
          : gun.get(document).once(async (data) => resolve(data))
      )
    },
    getDoc,
    putVal,
    putDoc,
    getKey: (alias: string, password: string) =>
      new Promise((resolve) =>
        gun.get(`~@${alias}`).once(async (exists) => {
          if (!exists) {
            resolve({ ok: false, result: 'Alias does not exist' })
          }
          const { ok, result } = await login(alias, password);
          if (!ok) {
            resolve({ ok, result })
          }

          gun.get('keys').get('master').once(async (data) => {
            if (!data) {
              resolve({ ok: false, result: 'Could Not Find Key Associated With This User' });
            } else {
              const decrypted = await decrypt(data, password)
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
            const { ok, result } = await createUser(username, password);
            if (!ok) {
              resolve({ ok: false, result: result });
            }
          }
          const { ok, result } = await login(username, password);
          if (!ok) {
            resolve({ ok, result });
          }
          const res = await putVal('keys', 'master', result, password);
          if (res === 'Added data!') {
            resolve({ ok: true, result: result });
          } 
        })
      ),
    getUserInfo: (alias: string) =>
      new Promise((resolve) =>
        gun.get(`~@${alias}`).once(async (exists) => {
          if (!exists) {
            resolve({ ok: false, result: 'Alias does not exist' })
          }
          gun.get(`users.info.@${alias}`).once(async (data) => {
            if (!data) {
              resolve({ ok: false, result: 'Could Not Find Key Associated With This User' });
            } 
                resolve({
                  ok: true, result: {
                    id: data.id,
                    alias: data.alias,
                    createdAt: data.createdAt,
                    lastLogin: data.lastLogin,} });
           

            
          })
        })),

  }
}
