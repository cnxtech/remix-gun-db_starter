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
import { APP_KEY_PAIR } from '~/session.server';
import { IGunChainReference } from 'gun/types/chain';

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
    let dec = await Gun.SEA.decrypt(enc, APP_KEY_PAIR);
    return dec
  }
  console.log('Encrypting data with new keys...');
  let enc = LZString.decompress(data)
  let dec = await Gun.SEA.decrypt(enc, keys);
  return dec
};


export type GunCtxType = {
  user: IGunChainReference,
  createUser: (
    alias: string ,
  ) => Promise<{ result: string | IGunCryptoKeyPair }>;
  validate: (
    sea: IGunCryptoKeyPair
  ) => Promise<{ ok: boolean; result: string; keys?: keyof AuthKeys }>;
  resetPassword: (
    username: string,
    oldPassword: string,
    newPassword: string
  ) => Promise<{ ok: boolean; result: string }>;
  getVal: (
    document: string,
    key: string,
    decryptionKey?: string
  ) => Promise<any>;
  putVal: (
    document: string,
    key: string,
    value: any,
    encryptionKey?: string,
  ) => Promise<string>;

};

export type AuthKeys = {
  soul: string;
  sea: IGunCryptoKeyPair;
  epub: string;
};

export function GunCtx(): GunCtxType {

  const ports = {
    RELAY: process.env.GUN_PORT || 5150,
    CLIENT: process.env.CLIENT_PORT || 3333,
  };
  const gun = Gun({
    peers: [`http://localhost:${ports.RELAY}/gun`, `http://localhost:${ports.CLIENT}`],
    localStorage: false
  });
  const user = gun.user()

  // const credentials = async (data: any) => {
  //   const pair = await Gun.SEA.pair();
  // };
  const createUser = async (
    alias: string,
  ): Promise<{  result: string | IGunCryptoKeyPair }> =>
    new Promise(async(resolve) => {
      /** Generate Keypair */
      const pair = await Gun.SEA.pair();
      console.log(alias)
      /** check */
      let exist = await getVal(`@${alias}`, 'creds')

      if (!exist) {

        // TODO: handle decrypion to map user Credentials
  
        /** Encrypt && Sign */
        const enc = await Gun.SEA.encrypt(alias, pair)
        const signed = await Gun.SEA.sign(enc, pair)
        let comp = LZString.compress(signed)
  
        console.log(`
        
        COMPRESSED USER DATA  — size: ${comp.length} —  
        
        ${comp}
        
        `  )
        /** Store user data */
        let store = await putVal(`@${alias}`,'creds', comp)
        if (!store) resolve({ result: 'Could not store credentials' })
        resolve({ result: pair })
      }
         resolve({ result: 'Alias already exists' })
      })

      //
    ;

  const validate = (
    sea: IGunCryptoKeyPair
  ): Promise<{ ok: boolean; result: string }> =>
    new Promise((resolve) =>
      user.auth(sea.pub, sea.priv, async (ack) => {
        const cookie = await encrypt((ack as any).epriv)
        if (Object.getOwnPropertyNames(ack).includes('id')) {
          resolve({
            ok: true,
            result: cookie
          });
        } else {
          resolve({ ok: false, result: JSON.parse(JSON.stringify(ack)).err });
        }
      })
    );

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
  const putVal = async (document: string, key: string, value: any, encryptionKey?: string): Promise<string | undefined> => {
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

  const getVal = (document: string, key: string, decryptionKey?: string) => {
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
    user,
    createUser,
    validate,
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
  }
}