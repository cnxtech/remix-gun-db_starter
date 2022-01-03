
import Gun from "gun";
import { createCookieSessionStorage, redirect } from "remix";
import {getDate, GunClient} from '~/lib/GunClient';
import { getKey, gun, putDoc, setKey} from "./gun.server";
import 'dotenv'
import { validateUsername, validatePassword } from "./lib/utils/validate-strings";
const sea = Gun.SEA
type LoginForm = {
  username: string;
  password: string;
};
type UserInfo ={
  id: string;
  alias: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function register({ username, password }: LoginForm) {
  let { ok, result } = await setKey(username, password);
  return { ok: ok, result: result }
}

export async function login({ username, password }: LoginForm) {
  let { ok, result } = await getKey(username, password);
  if (!ok) {
    return {
      ok: false,
      result: result
    };
  }
  return { ok: ok, result: result }
}


let sessionSecret = process.env.SESSION_SECRET as string || 'abcdefghijklmnopqrstuvwxyz';
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
    const user = gun.user(userId)
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

export async function authAction(request) {
  let { loginType, username, password } = Object.fromEntries(
    await request.formData()
  );
  if (
    typeof loginType !== 'string' ||
    typeof username !== 'string' ||
    typeof password !== 'string'
  ) {
    return { formError: `Form not submitted correctly.` };
  }

  let fields = { loginType, username, password };
  let fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };
  if (Object.values(fieldErrors).some(Boolean)) return { fieldErrors, fields };

  switch (loginType) {
    case 'login': {
      let { ok, result } = await login({ username, password });
      if (!ok) {
        return {
          fields,
          formError: `${result}`,
        };
      }

      return createUserSession(result, `/dashboard/${username}`);
    }
    case 'register': {
      let { ok, result } = await register({ username, password });
      if (!ok) {
        return {
          fields,
          formError: `${result}`,
        };
      }

      const _userInfo: UserInfo = {
        id: result,
        alias: username,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      let info = await putDoc('user/info', _userInfo, result)
      if (info) {
        return {
          fields,
          formError: info }
      }

      return createUserSession(result, `/dashboard/${username}`);
    }
    default: {
      return { fields, formError: `Login type invalid` };
    }
  }
}