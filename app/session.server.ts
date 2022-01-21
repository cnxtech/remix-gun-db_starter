import Gun from 'gun';
import { IGunCryptoKeyPair } from 'gun/types/types';
import { createCookieSessionStorage, redirect } from 'remix';
import { AuthKeys, decrypt, encrypt } from '../lib/GunDb/GunCtx';


export const master: IGunCryptoKeyPair = {
  pub: process.env.PUB,
  priv: process.env.PRIV,
  epub: process.env.EPUB,
  epriv: process.env.EPRIV
  
} 

let sessionSecret = master.epriv;
if (typeof sessionSecret !== 'string') {
  throw new Error('SESSION_SECRET must be set');
}

export let { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: 'FM_session',
    secure: true,
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export function getUserSession(request: Request) {
  return getSession(request.headers.get('Cookie'));
}


export async function getSea(request: Request) {
  let session = await getUserSession(request);
  let sea = session.get('sea');
  let dec =  await decrypt(sea, master);
  return dec;
}
export async function requireSEA(request: Request) {
  let session = await getUserSession(request);
  let sea = session.get('sea');
  if (!sea || typeof sea !== 'string') throw redirect('/login');
  return sea;
}


export async function logout(request: Request) {
  let session = await getSession(request.headers.get('Cookie'));
  session.set('sea', null)
  let sea = session.get('sea');
  return sea
}

export async function createUserSession(result: any, colorCode: string , redirectTo: string) {
  let session = await getSession();
  let store = {
    enc: result,
    v: colorCode
  }
  let res = await Gun.SEA.encrypt(store, master)
  session.set('sea', res);
 
  return redirect(redirectTo, {
    headers: { 'Set-Cookie': await commitSession(session) },
  });
}


