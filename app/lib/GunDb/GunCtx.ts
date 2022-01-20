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
import {db} from '~/root'

export const encrypt = async (
  data: any,
  keys: IGunCryptoKeyPair,
  sign: boolean = false
) => {
  console.log('Encrypting data with new keys...');
  let enc = await Gun.SEA.encrypt(data, keys);
  var _data = await Gun.SEA.sign(enc, keys);
  if (sign === true) {
    return _data;
  }
  return LZString.compress(_data)
};

export const decrypt = async (
  data: any,
  keys: IGunCryptoKeyPair,
  verify: boolean = false
) => {
  console.log('Encrypting data with new keys...');
  let enc = LZString.decompress(data)
  var msg = await Gun.SEA.verify(enc, keys.pub);
  if (verify === true) {
    return msg
  }
  let dec = await Gun.SEA.decrypt(msg, keys);
  return dec
};

export type Credentials = {
  alias: string;
  publicKey?: string;
  pattern?: string;
}

// export type GunCtxType = {
//   user: IGunChainReference,
//   createUser: (
//     alias: string ,
//   ) => Promise<{ result: string | IGunCryptoKeyPair }>;
//   validate: (
//     alias: string,
//     sea: IGunCryptoKeyPair
//   ) => Promise<{ result: string }>
//   resetPassword: (
//     username: string,
//     oldPassword: string,
//     newPassword: string
//   ) => Promise<{ ok: boolean; result: string }>;
//   getVal: (
//     document: string,
//     key: string,
//     decryptionKey?: string
//   ) => Promise<any>;
//   putVal: (
//     document: string,
//     key: string,
//     value: any,
//     encryptionKey?: string,
//   ) => Promise<string>;

// };

export type AuthKeys = {
  soul: string;
  sea: IGunCryptoKeyPair;
  epub: string;
};

export function GunCtx() {

  const ports = {
    RELAY: process.env.GUN_PORT || 5150,
    CLIENT: process.env.CLIENT_PORT || 3333,
  };
  const gun = db

  const createUser = async (
    { alias }: Credentials
  ): Promise<{ ok: boolean, result: string, keys?: IGunCryptoKeyPair }> =>
    new Promise(async (resolve, reject) => {
      /** Generate Keypair */

      const exists = await getVal(`@${alias}`, 'creds')
      if (exists) {
        resolve({ ok: false, result: 'Alias already exists' })
      }
      const pair = await Gun.SEA.pair();
      console.log(alias)


      /** Encrypt && Sign */
      const comp = await encrypt(alias, pair)

      console.info(`\n \n **** COMPRESSED USER DATA ****  — size:  ${comp.length} — \n \n${comp}\n \n`)
      /** Store user data */
      let store = await putVal(`@${alias}`, 'creds', comp)
      if (!store) resolve({ ok: false, result: 'Could not store credentials' })
      /** else */
      resolve({ ok: true, result: comp, keys: pair })

    }

    );

  const validate = (
    alias: string,
    pair: IGunCryptoKeyPair
  ): Promise<{ result: string }> =>
    new Promise(async (resolve) => {
      let stored = await getVal(`@${alias}`, 'creds')
      if (!stored) resolve({ result: 'Alias Not Found' })
      console.info(`\n \n **** stored data **** \n \n  ${stored}`)
      /** verify  */
      let dcomp = LZString.decompress(stored as string)
      console.info(`\n \n **** decompressed **** \n \n  ${dcomp}`)
      let msg = await Gun.SEA.verify(dcomp, pair.pub)
      let dec = await Gun.SEA.decrypt(msg, pair);
      console.info(`\n \n **** decrypted **** \n \n  ${dec}`)

      let proof = await Gun.SEA.work(dec, pair)
      console.info(`\n \n **** Hashing decrypted data and keypair **** \n \n  ${proof}`)

      if (!proof) {
        console.error('Keys invalid')
        resolve({ result: 'Keys invalid' })
      }

      resolve({ result: dec as string })

    });


  let setMap = (document: string, key: string, data: Array<any>) => {

    data.forEach((value: any) => {
      let set = gun.get(key).put(value)
      gun.get(document).set(set)
    })
    return gun.get(document).map().once(data => {
      if (!data) return undefined
      return JSON.stringify(data)

    })



  }






  /**
   *
   * @param document
   * Document node
   * @param key
   * Key node
   * @param value
   * Uses gun's .put({}) method... can be any object or IGunChainReference
   * @param encryptionKey
   * Key(s) to encrypt data
   * @param set
   * Path to make value apart of a numerical set
   * @returns
   */
  const putVal = async (document: string, key: string, value: any, encryptionKey?: IGunCryptoKeyPair): Promise<string | undefined> => {
    if (encryptionKey) {
      value = await encrypt(value, encryptionKey);
    }
    return new Promise((resolve) =>
      gun.get(document).get(key).put(value as never, (ack) => {
        console.log(ack)
        resolve(ack.ok ? 'Added data!' : ack.err?.message ?? undefined);
      })
    )
  }

  const getVal = (document: string, key: string, decryptionKey?: IGunCryptoKeyPair) => {
    return new Promise((resolve) =>
      gun.get(document).get(key).once(async (data) => {
        console.log('data:', data)
        decryptionKey
          ? resolve(await decrypt(data, decryptionKey))
          : resolve(data)
      })
    )
  }
  return {
    gun,
    createUser,
    validate,
    getVal,
    putVal,
    setMap
  }
}


export const {
  gun,
  createUser,
  setMap,
  validate,
  putVal,
  getVal,
} = GunCtx();


export const context = () => {

  return { action: '', loader: '' }

}