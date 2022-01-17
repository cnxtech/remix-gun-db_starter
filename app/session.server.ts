import { createCookieSessionStorage, redirect } from 'remix';
import { AuthKeys, decrypt, encrypt } from './lib/GunDb/GunCtx';

export function getDate() {
  const newDate = new Date();
  var dd = String(newDate.getDate()).padStart(2, 'O');
  var mm = String(newDate.getMonth() + 1).padStart(2, 'O');
  var yyyy = newDate.getFullYear();
  var sec = String(newDate.getTime());
  var timestamp = `${dd}.${mm}.${yyyy}:${sec}`;
  return timestamp;
}
export const APP_KEY_PAIR = process.env.APP_KEY_PAIR;

let sessionSecret =
  (process.env.SESSION_SECRET as string) || 'abcdefghijklmnopqrstuvwxyz';
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
  if (!sea || typeof sea !== 'string') return null;
  return sea;
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

export async function createUserSession(result: string, redirectTo: string) {
  let session = await getSession();
  session.set('sea', result);
 
  return redirect(redirectTo, {
    headers: { 'Set-Cookie': await commitSession(session) },
  });
}


