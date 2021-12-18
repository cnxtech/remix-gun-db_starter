import React, { useState, useEffect, createContext } from 'react';
import { useGunKeys, useGunKeyAuth } from '@altrx/gundb-react-hooks';
import Relays from '~/lib/constants/relay-peers';
import Gun from 'gun';
import 'gun/lib/radix';
import 'gun/lib/radisk';
import 'gun/lib/store';
import 'gun/lib/rindexed';
import 'gun/lib/not.js';
import { IGunConstructorOptions } from 'gun/types/options';

type KeyPair = {
  pub: string;
  priv: string;
  epub: string;
  epriv: string;
};

type GunContextType = {
  login: (keys: undefined | string | KeyPair) => void;
  logout: (cb:any) => void;
  appKeys: undefined | string | KeyPair;
  isLoggedIn: boolean;
};

type Storage = {
  getItem: (key: string) => any;
  setItem: (key: string, data: string) => any;
  removeItem: (key: string) => any;
};

type ProviderOpts = {

  keyFieldName: string;
  [key: string]: any;
};

const sea = Gun.SEA
let gunOpts = async() => {
 let relay = await Relays();
 let relayOpts: IGunConstructorOptions = {
  peers: relay,
  
};
return relayOpts
}
  const gun = Gun(gunOpts);
const GunContext = createContext<GunContextType>({
  login: () => {},
  logout: () => {},
  appKeys: undefined, 
  isLoggedIn: false
});
export const trimSoul = (data:any) => {
  if (!data || !data['_'] || typeof data['_'] !== 'object') return data;
  delete data['_'];
  return data;
};

const storage: Storage = {
  getItem: (id) => {
    return new Promise((resolve, reject) => {
      if (!id) reject(`${id} is not here.`);
      gun
        .get('keys')
        .get(id)
        .map()
        .once((data, key) => {
          resolve([id, trimSoul(data)]);
        });
    });
  },
  setItem: (key: string, item: string) => {
    return new Promise((resolve, reject) => {
      console.log(`Storing ${JSON.stringify(item)}`);
      gun
        .get('keys')
        .get(key)
        .set({ key: item }, (ack: any) => {
          ack.err ? reject(ack.err) : resolve(item);
        });
    });
  },
  removeItem: async (key) => {
    return new Promise((resolve, reject) => {
      gun
        .get('Items')
        .get(key)
        .set({key: null}, (ack) => {
          if (ack.err) reject(ack.err);
          else resolve(key);
        });
    });
  },
};



const GunProvider = ({
  keyFieldName='keys',
  ...props
}: ProviderOpts) => {


  const [{ isReadyToAuth, existingKeys, keyStatus }, setStatuses] = useState({
    isReadyToAuth: '',
    existingKeys: null,
    keyStatus: '',
  });


  // new keypair
  const newKeys = useGunKeys(sea);
  const [user, isLoggedIn] = useGunKeyAuth(
    gun,
    // @ts-ignore
    existingKeys,
    isReadyToAuth === 'ready'
  );

  useEffect(() => {
    if (isLoggedIn && existingKeys && keyStatus === 'new') {
      const storeKeys = async () => {
        await storage.setItem(keyFieldName, JSON.stringify(existingKeys));
      };

      storeKeys();
    }
  }, [isLoggedIn, existingKeys, keyFieldName, keyStatus, user]);

  useEffect(() => {
    if (!existingKeys) {
      const getKeys = async () => {
        const k = await storage.getItem(keyFieldName);
        const ks = JSON.parse(k || 'null');
        setStatuses({
          isReadyToAuth: 'ready',
          existingKeys: ks,
          keyStatus: ks ? 'existing' : 'new',
        });
      };
      getKeys();
    }
  }, [keyFieldName, setStatuses, existingKeys]);

  const login = React.useCallback(
    async (keys) => {
      // use keys sent by the user or a new set
      setStatuses({
        isReadyToAuth: 'ready',
        existingKeys: keys || newKeys,
        keyStatus: 'new',
      });
    },
    [setStatuses, newKeys]
  );

  const logout = React.useCallback(
    (onLoggedOut) => {
      const removeKeys = async () => {
        await storage.removeItem(keyFieldName);
        onLoggedOut();
      };

      removeKeys();
    },
    [keyFieldName]
  );

  const value = React.useMemo(() => {
    const newGunInstance = (opts = gunOpts) => {
      return Gun(opts);
    };
    return {
      gun,
      user,
      login,
      logout,
      sea,
      appKeys: existingKeys || newKeys,
      isLoggedIn,
      newGunInstance,
    };
  }, [user, login, logout, newKeys, existingKeys, isLoggedIn]);

  return <GunContext.Provider value={value} {...props} />;
};

function useAuth() {
  const context = React.useContext(GunContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a GunProvider`);
  }
  return context;
}

const GunCtxProvider = ({children}: React.PropsWithChildren<{}>) => {
  return(
    <GunProvider keyFieldName='AppKeys' >{children}</GunProvider>
  )
}

export { GunCtxProvider, GunProvider, useAuth };