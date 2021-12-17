// @ts-nocheck
/*
 * Provide one instance of gun to your entire app.
 * NOTE Using this component blocks render until gun is ready
 *
 * Usage examples:
 * // index.js
 *   import { GunContextProvider } from './useGunContext'
 *   // ...
 *   <GunContextProvider>
 *     <App />
 *   </GunContextProvider>
 *
 * // App.js
 *   import useGunContext from './useGunContext'
 *   // ...
 *   const { getGun, getUser } = useGunContext()
 *
 *   getGun().get('ours').put('this')
 *   getUser().get('mine').put('that')
 */
import React, { createContext, useContext, useRef, useEffect } from 'react';
import 'gun/sea';

const GunContext = createContext({
  getGun: () => {},
  getUser: () => {},
  getCertificate: () => {},
  setCertificate: () => {},
  onAuth: () => () => {},
});


export default function useGunContext() {
  return useContext(GunContext);
}
