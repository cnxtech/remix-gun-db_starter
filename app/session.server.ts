import { createCookieSessionStorage, redirect } from 'remix';
import { AuthKeys } from './lib/GunDb/GunCtx';

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

let { getSession, commitSession, destroySession } = createCookieSessionStorage({
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

export async function getSoul(request: Request) {
  let session = await getUserSession(request);
  let soul = session.get('soul');
  if (!soul || typeof soul !== 'string') return null;
  return soul;
}
export async function getEpub(request: Request) {
  let session = await getUserSession(request);
  let epub = session.get('epub');
  if (!epub || typeof epub !== 'string') return null;
  return epub;
}
export async function getSea(request: Request) {
  let session = await getUserSession(request);
  let sea = session.get('sea');
  if (!sea || typeof sea !== 'string') return null;
  return sea;
}
export async function requireSoul(request: Request) {
  let session = await getUserSession(request);
  let soul = session.get('soul');
  if (!soul || typeof soul !== 'string') throw redirect('/login');
  return soul;
}


export async function logout(request: Request) {
  let session = await getSession(request.headers.get('Cookie'));
  return redirect('/login', {
    headers: { 'Set-Cookie': await destroySession(session) },
  });
}

export async function createUserSession(result: AuthKeys, redirectTo: string) {
  let session = await getSession();
  session.set('sea', result.sea);
  session.set('epub', result.epub);
  session.set('soul', result.soul);
  return redirect(redirectTo, {
    headers: { 'Set-Cookie': await commitSession(session) },
  });
}


