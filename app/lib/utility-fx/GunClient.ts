
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
import { gun } from '~/gun.server';
import Gun from 'gun';
import { IGunCryptoKeyPair } from 'gun/types/types';
import { IGunChainReference } from 'gun/types/chain';

const sea = Gun.SEA


// Date function
export const getDate = () => {
  const newDate = new Date();
  var timestamp = newDate;
  return timestamp;
}

export interface IUserCred {
  username: string,
  password: string
}


export type GunClientType = {
  encryptData: (data: any, keys: undefined | string | IGunCryptoKeyPair) => any
  decryptData: (data: any, keys: undefined | string | IGunCryptoKeyPair) => any
  createUser: ({ username, password }: IUserCred) => Promise<string | undefined>;
  login: ({ username, password }: IUserCred) => Promise<{ ok: boolean, result: any }>;
  resetPassword: ({ username, oldPassword, newPassword }: IResetCred) => Promise<{ ok: boolean, result: string }>;
  getData: ({ document, key, opt }: IGetData) => Promise<any>;
  putData: ({ document, key, value, opt }: IPutData) => Promise<string>;
  setArray: ({ document, key, set }: SetArr) => Promise<string>
  getKey: (username: string, password: string) => Promise<{ ok: boolean, result: string }>;
  setKey: (username: string, password: string) => Promise<any>;
}
export interface IGetData {
  document: string,
  key?: string,
  opt?: GetOptions
}
export interface IPutData {
  document: string,
  key: string,
  value: any
  opt?: PutOptions
}
export interface IResetCred {
  username: string,
  oldPassword: string,
  newPassword: string
}
export interface GetOptions { // TODO: Add Mapping Options to getData()
  map?: boolean
  path?: string
  decryptionKey?: string
}
export interface PutOptions {
  setPath?: string
  encryptionKey?: string;
}

export interface SetArr {
  document: string,
  key: string,
  set: Array<Partial<string | number | null | IGunChainReference>>
}


export function GunClient(): GunClientType {
  const encryptData = async (
    data: any,
    keys: undefined | string | IGunCryptoKeyPair
  ) => {
    console.log('Encrypting data...')
    return keys && sea.encrypt(data, keys)
  };

  const decryptData = async (
    data: any,
    keys: undefined | string | IGunCryptoKeyPair,
  ) => {
    console.log('Decrypting data...')
    return keys && sea.decrypt(data, keys);
  };
  let user = gun.user()



  const createUser = async ({ username, password }: IUserCred): Promise<string | undefined> =>
    new Promise((resolve) => user.create(username, password, (ack) => {
      console.log(ack)
      if (Object.getOwnPropertyNames(ack).includes('ok')) {
        resolve(undefined)
      } else {
        resolve(JSON.parse(JSON.stringify(ack)).err)
      }
    }));

  const login = ({ username, password }): Promise<{ ok: boolean, result: any }> =>
    new Promise((resolve) => user.auth(username, password, (ack) => {
      if (Object.getOwnPropertyNames(ack).includes('id')) {

        resolve({ ok: true, result: (ack as any).get });
      } else {
        resolve({ ok: false, result: JSON.parse(JSON.stringify(ack)).err })
      }
    }))

  const putData = async ({ document, key, value, opt }: IPutData): Promise<string> => {
    if (opt?.encryptionKey ) {
      value = await encryptData(value, opt?.encryptionKey);
    }

    if (opt?.setPath != null) {
      let _set = user.get(opt.setPath)
      let _document = user.get(document).get(key).put(value)
      return new Promise((resolve) => {
        _set.set(_document, (ack) => {
          resolve(ack.ok ? 'Added data as a set!' : ack.err?.message ?? 'Could not add data');
        })
      })
    }
    let _document = user.get(document).get(key)
    return new Promise((resolve) => {
      _document.put(value, (ack) => {
        resolve(ack.ok ? 'Added data!' : ack.err?.message ?? 'Could not add data');
      })
    })
  }


  const setArray = ({ document, key, set }: SetArr): Promise<string> => {
    let _document
    if (key) {
      _document = user.get(document).get(key)
    } _document = user.get(document)
    return new Promise((resolve) => {
      set.forEach((ref: any) => {
        _document.set(ref, (ack) => {
          resolve(ack.ok ? 'Added set!' : ack.err?.message ?? 'Could not add data');
        })
      })
    })
  }



  return {
    encryptData,
    decryptData,
    createUser,
    login,
    setArray,
    resetPassword: ({ username, oldPassword, newPassword }) =>
      new Promise((resolve) => user.auth(username, oldPassword, (ack) => {
        console.log(ack)
        if (Object.getOwnPropertyNames(ack).includes('ok')) {
          resolve({ ok: true, result: '' });
        } else {
          resolve({ ok: false, result: JSON.parse(JSON.stringify(ack)).err })
        }
      }, { change: newPassword })),


    getData: ({ document, key, opt }) => {
      let { decryptionKey } = opt
      return new Promise((resolve) =>
        key
          ? user.get(document).get(key).once(async (data, key) => {
            console.log({ [key]: data })
            let _decrypted = await decryptData(data, decryptionKey)

            decryptionKey
              ? Object.entries(_decrypted).forEach(([key, value]) => {
                // eslint-disable-next-line eqeqeq
                if (value != '[object Object]') {
                  resolve(`${key}: ${value}`)
                }
              })
              : Object.entries(data).forEach(([key, value]) => {
                // eslint-disable-next-line eqeqeq
                if (value != '[object Object]') {
                  resolve(`${key}: ${value}`)
                }})
          })
          : user.get(document).once((data) =>
            Object.entries(data).forEach(([key, value]) => {
              // eslint-disable-next-line eqeqeq
              if (value != '[object Object]') {
                resolve(`${key}: ${value}`)
              }
            }))
      )
    },
    putData,
    getKey: (username: string, password: string) =>
      new Promise((resolve) =>
        gun.get(`~@${username}`).once(async (exists) => {
          if (!exists) {
            const err = await createUser({ username, password });
            if (err) {
              resolve({ ok: false, result: err })
            }
          }
          const { ok, result } = await login({ username, password });
          if (!ok) {
            resolve({ ok, result })
          }

          user.get('keys').get('master').once(async (data) => {
            if (!data) {
              resolve({ ok: false, result: 'Could Not Find Key Associated With This User' });
            } else {
              const decrypted = await decryptData(data, password)
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
            const err = await createUser({ username, password });
            if (err) {
              resolve({ ok: false, result: err });
            }
          }
          const { ok, result } = await login({ username, password });
          if (!ok) {
            resolve({ ok, result });
          }



          /**
           * Key Document && Node Path
           */

          let _put: IPutData = {
            document: 'keys',
            key: 'master',
            value: result,
            opt: { encryptionKey: password }
          }

          const res = await putData(_put);
          if (res === 'Added data!') {
            resolve({ ok: true, result: result });
          } else {
            resolve({ ok: false, result: res });
          }
        })
      )
  }

}
