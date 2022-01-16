/* eslint-disable react-hooks/exhaustive-deps */
import 'gun/lib/radix';
import 'gun/lib/radisk';
import 'gun/lib/store';
import 'gun/lib/rindexed';
import 'gun/lib/not.js';
import 'gun/lib/then';
import 'gun/lib/path';
import LZString from 'lz-string';
import { IGunCryptoKeyPair } from 'gun/types/types';
import Gun from 'gun';
import React from 'react';
import { validateUsername, validatePassword } from '../utils/validate-strings';
import { gun } from '.';
import { APP_KEY_PAIR, createUserSession } from '~/session.server';

export const encrypt = async (
  data: any,
  keys: undefined | string | IGunCryptoKeyPair
) => {
  console.log('Encrypting data...');
  return Gun.SEA.encrypt(data, keys);
};

export const decrypt = async (
  data: any,
  keys: undefined | string | IGunCryptoKeyPair
) => {
  console.log('Decrypting data...');
  return Gun.SEA.decrypt(data, keys);
};
export type GunCtxType = {
  createUser: (
    username: string,
    password: string
  ) => Promise<{ ok: boolean; result: string | undefined }>;
  login: (
    username: string,
    password: string
  ) => Promise<{ ok: boolean; result: string; keys?: AuthKeys }>;
  resetPassword: (
    username: string,
    oldPassword: string,
    newPassword: string
  ) => Promise<{ ok: boolean; result: string }>;
  getVal: (
    document: string,
    key?: string,
    decryptionKey?: string
  ) => Promise<any>;
  putVal: (
    document: string,
    key: string,
    value: any,
    encryptionKey?: string,
    set?: string
  ) => Promise<string>;
  signAction: (
    request: Request
  ) => Promise<{ ok: boolean; result: string } | Response>;
  setArray: (
    document: string,
    set: Array<any>,
    encryptionKey?: string
  ) => Promise<string>;
  MapArray: (document: string, decryptionKey?: string) => any;
};

export type AuthKeys = {
  soul: string;
  sea: IGunCryptoKeyPair;
  epub: string;
};

export function GunCtx(): GunCtxType {
  const user = gun.user().recall({ sessionStorage: true });

  // const credentials = async (data: any) => {
  //   const pair = await Gun.SEA.pair();
  // };
  const createUser = async (
    username: string,
    password: string
  ): Promise<{ ok: boolean; result: string | undefined }> =>
    new Promise((resolve) =>
      user.create(username, password, (ack) => {
        console.log(ack);
        if (Object.getOwnPropertyNames(ack).includes('ok')) {
          resolve({ ok: true, result: undefined });
        } else {
          resolve({ ok: false, result: JSON.parse(JSON.stringify(ack)).err });
        }
      })
    );

  const login = (
    username: string,
    password: string
  ): Promise<{ ok: boolean; result: any; keys?: AuthKeys }> =>
    new Promise((resolve) =>
      user.auth(username, password, (ack) => {
        if (Object.getOwnPropertyNames(ack).includes('id')) {
          resolve({
            ok: true,
            result: (ack as any).get,
            keys: { soul: (ack as any).soul, sea: (ack as any).sea, epub: (ack as any).put.epub }
          });
        } else {
          resolve({ ok: false, result: JSON.parse(JSON.stringify(ack)).err });
        }
      })
    );

  /**
   *
   * @param document
   * Document Node
   * @param key
   * Uses gun/lib/path library... separate nodes with full tops or slashes
   * @param value
   * Uses gun's .put({}) method... can be any object or IGunChainReference
   * @param encryptionKey
   * Key(s) to encrypt data
   * @param set
   * Path to make value apart of a numerical set
   * @returns
   */
  const putVal = async (
    document: string,
    key: string,
    value: any,
    encryptionKey?: string,
    set?: string
  ): Promise<string> => {
    if (encryptionKey) {
      value = await encrypt(value, encryptionKey);
      value = LZString.compress(value);
    } else
      value = await encrypt(value, APP_KEY_PAIR);
    console.log(value)
    value = LZString.compress(value);
    console.log(value)
    return new Promise((resolve) => {
      if (typeof set === 'string') {
        let _set = user
          .get(document)
          .path(key)
          .put(value, async (ack) => {
            if (Object.getOwnPropertyNames(ack).includes('ok')) {
              user.get(set).set(_set, (ack) => {
                resolve(
                  ack.ok ? 'Added data && set!' : ack.err?.message ?? undefined
                );
              });
            }
          });
      }
      user
        .get(document)
        .path(key)
        .put(value, (ack) => {
          resolve(ack.ok ? 'Added data!' : ack.err?.message ?? undefined);
        });
    });
  };

  const getVal = (document: string, key: string, decryptionKey?: string) => {
    return new Promise((resolve) =>
      user
        .get(document)
        .path(key)
        .once(async (data) => {
          if (decryptionKey) {
            let dec = LZString.decompress(data as never);
            let _data = await decrypt(dec, decryptionKey) 
            resolve(_data)
          }
          let dec = LZString.decompress(data as never);
          let _data = await decrypt(dec, APP_KEY_PAIR)
          resolve(_data)
        })

    );
  }

  const setArray = (
    document: string,
    set: Array<any>,
    encryptionKey?: string
  ): Promise<string> => {
    let _document = gun.get(document);
    return new Promise((resolve) => {
      set.forEach(async (ref: any) => {
        if (encryptionKey) {
          ref = await encrypt(ref, encryptionKey);
        }
        _document.set(ref, (ack) => {
          resolve(ack.ok ? 'Added set!' : ack.err?.message ?? undefined);
        });
      });
    });
  };

  const initialState = [];

  // Create a reducer that will update the components array
  function reducer(state, set) {
    return [set, ...state];
  }

  const MapArray = (document: string, decryptionKey?: string) => {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    React.useEffect(() => {
      gun
        .get(document)
        .map()
        .once(async (value) => {
          if (decryptionKey) {
            value = await decrypt(value, decryptionKey);
          }
          dispatch(value);
        });
    }, [decryptionKey, document, gun.get(document).off()]);
    return state;
  };

  return {
    createUser,
    login,
    resetPassword: (
      username: string,
      oldPassword: string,
      newPassword: string
    ) =>
      new Promise((resolve) =>
        user.auth(
          username,
          oldPassword,
          (ack) => {
            console.log(ack);
            if (Object.getOwnPropertyNames(ack).includes('ok')) {
              resolve({ ok: true, result: undefined });
            } else {
              resolve({
                ok: false,
                result: JSON.parse(JSON.stringify(ack)).err,
              });
            }
          },
          { change: newPassword }
        )
      ),
    getVal,
    putVal,
    signAction: async (request: Request) => {
      let { username, password } = Object.fromEntries(
        await request.formData()
      );

      return new Promise((resolve) => {
        if (
          typeof username !== 'string' ||
          typeof password !== 'string'
        ) {
          return resolve({ ok: false, result: `Form not submitted correctly.` });
        }

        let fields = { username, password };
        let fieldErrors = {
          username: validateUsername(username),
          password: validatePassword(password),
        };
        if (fieldErrors.username) resolve({ ok: false, result: fieldErrors.username });
        if (fieldErrors.password) resolve({ ok: false, result: fieldErrors.password });
        gun.get(`~@${username}`).once(async (user) => {
          if (!user) {
            const { ok, result } = await createUser(fields.username, fields.password);
            if (!ok) {
              resolve({ ok: false, result: result });
            }
          }
          const { ok, result, keys } = await login(fields.username, fields.password);
          if (!ok) {
            resolve({ ok, result });
          }
          const res = await putVal('keys', 'master', keys);
          if (res !== 'Added data!') {
            resolve({ ok: false, result: 'Error Storing Keys' });
          }
          let data = await getVal('keys', 'master')
          console.log(data)
          resolve(createUserSession(result, `/`))
        })
      }
      )
    },
    setArray,
    MapArray,
  };
}
