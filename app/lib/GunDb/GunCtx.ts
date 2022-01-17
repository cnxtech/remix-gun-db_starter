/* eslint-disable react-hooks/exhaustive-deps */
import 'gun/lib/radix';
import 'gun/lib/radisk';
import 'gun/lib/store';
import 'gun/lib/rindexed';
import 'gun/lib/not.js';
import 'gun/lib/then';
import 'gun/lib/path';
import 'gun/lib/load';
import 'gun/lib/open';
import LZString from 'lz-string';
import { IGunCryptoKeyPair } from 'gun/types/types';
import Gun from 'gun';
import React from 'react';
import { validateUsername, validatePassword } from '../utils/validate-strings';
import { gun } from '.';
import { APP_KEY_PAIR, createUserSession, getDate, getSea } from '~/session.server';
import { Params } from 'react-router';
import { redirect } from 'remix';

export const encrypt = async (
  data: any,
  keys?: string | IGunCryptoKeyPair
) => {
  if (!keys) {
    console.log('Using the environment variables to encrypt data...');
    let enc = await Gun.SEA.encrypt(data, APP_KEY_PAIR);
    return LZString.compress(enc)
  }
  console.log('Encrypting data with new keys...');
  let enc = await Gun.SEA.encrypt(data, keys);
  return LZString.compress(enc)
};

export const decrypt = async (
  data: any,
  keys?: string | IGunCryptoKeyPair
) => {
  if (!keys) {
    console.log('Using the environment variables to encrypt data...');
    let enc = LZString.decompress(data)
    return Gun.SEA.decrypt(enc, APP_KEY_PAIR);
  }
  console.log('Encrypting data with new keys...');
  let enc = LZString.decompress(data)
  return Gun.SEA.decrypt(enc, keys);
};


export type GunCtxType = {
  createUser: (
    username: string,
    password: string
  ) => Promise<{ ok: boolean; result: string | undefined }>;
  login: (
    username: string,
    password: string
  ) => Promise<{ ok: boolean; result: string; keys?: keyof AuthKeys }>;
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
  loadProfile: (request: Request, params: Params<string>) => Promise<any>;
  editProfile: (request: Request, params: Params<string>) => Promise<any>;
  addProject: (request: Request, params: Params<string>) => Promise<any>;
  loadProject: (request: Request, params: Params<string>) => Promise<any>;
  signAction: (
    request: Request
  ) => Promise<{ ok: boolean; result: string } | Response>;
  setArray: (
    document: string,
    set: Array<any>,
    encryptionKey?: string
  ) => Promise<string>;
  mapArray: (document: string, decryptionKey?: string) => Promise<any>;
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
  ): Promise<{ ok: boolean; result: any; keys?: keyof AuthKeys }> =>
    new Promise((resolve) =>
      user.auth(username, password, (ack) => {
        if (Object.getOwnPropertyNames(ack).includes('id')) {
          resolve({
            ok: true,
            result: (ack as any).get,
            keys: (ack as any).sea
          });
        } else {
          resolve({ ok: false, result: JSON.parse(JSON.stringify(ack)).err });
        }
      })
    );

  const logOut = async (request: Request) => {
    let sesh = await getSea(request)
    return new Promise((resolve) => {


      user.leave()
    })
  }

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
    }
    value = await encrypt(value);
    return new Promise((resolve) => {
      if (typeof set === 'string') {
        let _set = gun
          .get(document)
          .path(key)
          .put(value);

        gun.get(set).set(_set, (ack) => {
          resolve(
            ack.ok ? 'Added data && set!' : ack.err?.message ?? undefined
          );
        });
      }
      gun
        .get(document)
        .path(key)
        .put(value, (ack) => {
          resolve(ack.ok ? 'Added data!' : ack.err?.message ?? undefined);
        });
    });
  };

  const getVal = (document: string, key: string, decryptionKey?: string) => {
    return new Promise((resolve) =>
      gun
        .get(document)
        .path(key)
        .once(async (data) => {
          if (decryptionKey) {
            let _data = await decrypt(data, decryptionKey)
            resolve(_data)
          }
          let _data = await decrypt(data)
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
        ref = await encrypt(ref);
        _document.set(ref, (ack) => {
          resolve(ack.ok ? 'Added set!' : ack.err?.message ?? undefined);
        });
      });
    });
  };



  const mapArray = (document: string, decryptionKey?: string): Promise<any> => {


    let SET = gun
      .get(document)
    return new Promise((resolve) => {
      SET.map().on(async(items) => {
        decryptionKey ? 
        items = await decrypt(items, decryptionKey):
        items = await decrypt(items)
     resolve(Object.entries(items).map((item, key )=>item))

       
      })
    })
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

    /**
     * LOAD PROFILE
     * @param request 
     * @param params 
     * @returns 
     */

    loadProfile: async (request: Request, params: Params<string>) => {

      let epub = await getSea(request)

      let alias = params.user

      return new Promise((resolve) => {
        if (!epub) resolve('No User id in localStore')
        gun.get(`~@${alias}`).once(async (exist) => {
          if (!exist) {
            resolve(`User ${alias} not found`)
          }
          const profileGet = await getVal(`//${alias}`, `PROFILE`);
          resolve(profileGet)
        })
      })
    },



    /**
     * EDIT PROFILE
     * @param request 
     * @param params 
     * @returns 
     */


    editProfile: async (request: Request, params: Params<string>) => {
      let { job, description } = Object.fromEntries(
        await request.formData()
      );

      let epub = await getSea(request)
      let alias = params.user
      return new Promise((resolve) => {
        if (
          typeof job !== 'string' ||
          typeof description !== 'string'
        ) {
          return resolve(`Form not submitted correctly.`);
        }

        let fields = { alias, job, description };
        gun.get(`~@${alias}`).once(async (exist) => {
          if (!exist) {
            resolve(`User ${alias} not found`)
          }
          const fieldPut = await putVal(`//${alias}`, `PROFILE`, fields);
          const fieldSet = await setArray('PROFILE-SET', [fields]);
          if(!fieldSet) resolve('No Set')
          if (!fieldPut) resolve(`For some reason... We couldn't add the project data`)

          resolve(redirect(`/admin/${alias}`))
        })
      })
    },
    addProject: async (request: Request, params: Params<string>) => {
      let { title, slug, description, document, tags, url, image } = Object.fromEntries(
        await request.formData()
      );
      let tagArr = tags.toString().split(/,\s+/)
      let epub = await getSea(request)
      let alias = params.user
      let time = getDate()
      return new Promise((resolve) => {
        if (
          typeof title !== 'string' ||
          typeof slug !== 'string' ||
          typeof description !== 'string' ||
          typeof document !== 'string' ||
          typeof tags !== 'string' ||
          typeof url !== 'string' ||
          !image
        ) {
          return resolve(`Form not submitted correctly.`);
        }

        let fields = { title, slug, description, document, url, image };
        let metadata = { alias: alias, created: time, title: fields.title, cover: fields.image }

        gun.get(`~@${alias}`).once(async (exist) => {
          if (!exist) {
            resolve(`User ${alias} not found`)
          }
          const fieldPut = await putVal(`//${alias}`, `PROJECTS/${fields.title}`, fields);
          if (!fieldPut) resolve(`For some reason... We couldn't add the project data`)

          const metaPut = await putVal(`//${alias}`, `TAGS/${fields.title}`, metadata);
          if (!metaPut) resolve(`For some reason... We couldn't add the project metadata`);

          const tagSet = await setArray(`//${alias}/TAGS/${fields.title}`, tagArr, epub,);
          if (!tagSet) resolve(`For some reason... We couldn't add the project tags`);
          resolve(redirect(`/project/${fields.slug}`))
        })
      })
    },
    loadProject: async (request: Request, params: Params<string>) => {

      let epub = await getSea(request)
      let alias = params.user
      let time = getDate()
      return new Promise((resolve) => {
        gun.get(`~@${alias}`).once(async (exist) => {
          if (!exist) {
            resolve(`User ${alias} not found`)
          }
          let list = await mapArray('PROFILE-SET')
          console.log(list)
          if (!list) resolve('Synclist bust')
          resolve(list)
        })
      })
    },
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

        let fields2 = { alias: username, job: 'Add Job Title', description: 'Add Job Description' }
        let fieldErrors = {
          username: validateUsername(username),
          password: validatePassword(password),
        };
        if (fieldErrors.username) resolve({ ok: false, result: fieldErrors.username });
        if (fieldErrors.password) resolve({ ok: false, result: fieldErrors.password });
        gun.get(`~@${username}`).once(async (exist) => {
          if (!exist) {
            const { ok, result } = await createUser(fields.username, fields.password);
            if (!ok) {
              resolve({ ok: false, result: result });
            }
            const { ok: ok2, result: res2, keys } = await login(fields.username, fields.password);
            if (!ok2) {
              resolve({ ok: ok2, result: res2 });
            }
            const res = await putVal('keys', 'master', keys);
            if (res !== 'Added data!') {
              resolve({ ok: false, result: 'Error Storing Keys' });
            }
            const fieldPut = await putVal(`//${username}`, `PROFILE`, fields2);
            if (!fieldPut) resolve({ ok: false, result: `For some reason... We couldn't add the default project data` })
            resolve(createUserSession((keys as any).epub, `/admin/${fields.username}`))
          }
          const { ok: ok3, result: res3, keys } = await login(fields.username, fields.password);
          if (!ok3) {
            resolve({ ok: ok3, result: res3 });
          }

          resolve(createUserSession((keys as any).epub, `/admin/${fields.username}`))
        })
      }
      )
    },
    setArray,
    mapArray,
  };
}
