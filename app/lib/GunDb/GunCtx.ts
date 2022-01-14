
import 'gun/lib/radix';
import 'gun/lib/radisk';
import 'gun/lib/store';
import 'gun/lib/rindexed';
import 'gun/lib/not.js';
import 'gun/lib/then'
import 'gun/lib/path'
import invariant from 'tiny-invariant';
import { IGunCryptoKeyPair } from 'gun/types/types'
import Gun from 'gun';
import { IGunChainReference } from 'gun/types/chain';
import React from 'react';





export const encrypt = async (
  data: any,
  keys: undefined | string | IGunCryptoKeyPair
) => {
  console.log('Encrypting data...')
  return Gun.SEA.encrypt(data, keys)
};

export const decrypt = async (
  data: any,
  keys: undefined | string | IGunCryptoKeyPair,
) => {
  console.log('Decrypting data...')
  return Gun.SEA.decrypt(data, keys);
};
export type GunCtxType = {
  createUser: (username: string, password: string) => Promise<{ ok: boolean, result: string | undefined }>;
  login: (username: string, password: string) => Promise<{ ok: boolean, result: AuthKeys }>;
  resetPassword: (username: string, oldPassword: string, newPassword: string) => Promise<{ ok: boolean, result: string }>;
  getVal: (document: string, key?: string, decryptionKey?: string) => Promise<any>;
  putVal: (document: string, key: string, value: any, encryptionKey?: string, set?: string) => Promise<string>;
  getKey: (alias: string, password: string) => Promise<{ ok: boolean, result: string | keyof AuthKeys }>;
  setKey: (alias: string, password: string) => Promise<{ ok: boolean, result: string | keyof AuthKeys }>;
  setArray: (document: string, set: Array<any>, encryptionKey?: string) => Promise<string>
}

type AuthKeys = { soul: string, get: string, sea: IGunCryptoKeyPair, epub: string }

export function GunCtx(gun: IGunChainReference): GunCtxType {
  const user = gun.user().recall({ sessionStorage: true })

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

        resolve({ ok: true, result: { soul: (ack as any).soul, get: (ack as any).get, sea: (ack as any).sea, epub: (ack as any).epub } });
      } else {
        resolve({ ok: false, result: JSON.parse(JSON.stringify(ack)).err })
      }
    }))

  /**
   * 
   * @param document 
   * Uses gun/lib/path library... separate nodes with full tops or slashes
   * @param key 
   * another node record
   * @param value 
   * 
   * @param encryptionKey 
   * @param set 
   * @returns 
   */
  const putVal = async (document: string, key: string, value: any, encryptionKey?: string, set?: string): Promise<string> => {
    if (encryptionKey) {
      value = await encrypt(value, encryptionKey);
    }
    return new Promise((resolve) => {
      if (typeof set === 'string') {
        let _set = gun.get(document).path(key).put(value, async (ack) => {
          if (Object.getOwnPropertyNames(ack).includes('ok')) {
            gun.get(set).set(_set, (ack) => {
              resolve(ack.ok ? 'Added data && set!' : ack.err?.message ?? undefined)
            })
          }
        })
      }
      gun.get(document).path(key).put(value, (ack) => {
        resolve(ack.ok ? 'Added data!' : ack.err?.message ?? undefined);
      })
    })
  }

  const setArray = (document: string, set: Array<any>, encryptionKey?: string): Promise<string> => {
    let _document = gun.get(document)
    return new Promise((resolve) => {
      set.forEach(async (ref: any) => {
        if (encryptionKey) {
          ref = await encrypt(ref, encryptionKey)
        }
        _document.set(ref, (ack) => {
          resolve(ack.ok ? 'Added set!' : ack.err?.message ?? undefined);
        })
      })
    })
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
          ? gun.get(document).path(key).once(async (data) => {
            console.log('data:', data)
            decryptionKey
              ? resolve(await decrypt(data, decryptionKey))
              : resolve(data)
          })
          : gun.get(document).once(async (data) => resolve(data))
      )
    },
    putVal,
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
          resolve({ ok: true, result: result.get })

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
          const res = await putVal('keys', 'master', result, result.sea);
          if (res === 'Added data!') {
            resolve({ ok: true, result: result.get });
          }
        })
      ),
    setArray,
    

  }
}
