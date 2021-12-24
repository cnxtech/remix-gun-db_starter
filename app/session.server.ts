
import Gun from "gun";
import { createCookieSessionStorage, redirect } from "remix";
import {getDate, Strapd} from '~/lib/constants/Strapd';
import { gun} from "./gun.server";
import 'dotenv'
const sea = Gun.SEA
type LoginForm = {
  username: string;
  password: string;
};
const {createUser, setKey, putData, getKey,} = Strapd()
export async function register({ username, password }: LoginForm) {
  let err = await createUser(username, password);
  if (err) {
    return {ok: false, result: err}
  }
  
  let { ok, result } = await setKey(username, password);
  const userInfo = {
    alias: username,
    id: result.slice(0, 10),
    createdAt: getDate,
    updatedAt: getDate

  }

  const res = await putData('user/info', username, userInfo);
  if (res !== 'Added data!') {
    return { ok: false, result: 'Could not create user info' };
  } 
  return {ok:ok, result:result}
}

export async function login({ username, password }: LoginForm) {
  let { ok, result } = await getKey(username, password);
  if (!ok) {
    return {
      ok: false,
      result: result
    };
  }


  return {ok:ok, result: result}
}

let sessionSecret = process.env.SESSION_SECRET as string //|| 'abcdefghijklmnopqrstuvwxyz';
if (typeof sessionSecret !== 'string') {
  throw new Error("SESSION_SECRET must be set");
}

let { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: "FM_session",
    secure: true,
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export function getUserSession(request: Request) {
  return getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  let session = await getUserSession(request);
  let userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

export async function requireUserId(request: Request) {
  let session = await getUserSession(request);
  let userId = session.get("userId");
  if (!userId || typeof userId !== "string") throw redirect("/login");
  return userId;
}

export async function getUser(request: Request) {
  let userId = await getUserId(request);
  if (typeof userId !== "string") return null;

  try {
    const user = gun.user(userId).recall({ sessionStorage: true });
    return user;
  } catch {
    throw logout(request);
  }
}

export async function logout(request: Request) {
  gun.user().leave();
  let session = await getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: { "Set-Cookie": await destroySession(session) },
  });
}

export async function createUserSession(userId: string, redirectTo: string) {
  let session = await getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}