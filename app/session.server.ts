
import Gun from "gun";
import { createCookieSessionStorage, redirect } from "remix";
import { GunCtx } from '~/lib/GunCtx/models';
import { getKey, gun, putVal, setKey } from "./lib/GunCtx";
import 'dotenv'
import { validateUsername, validatePassword } from "./lib/utils/validate-strings";

type LoginForm = {
  username: string;
  password: string;
};




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
  return redirect("/", { 
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


export async function loginAction(request: Request) {

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
  if (Object.values(fieldErrors).some(Boolean))
    return { fieldErrors, fields };

  switch (loginType) {
    case 'login': {
      let { ok, result } = await getKey(username, password);
      if (!ok) {
        return {
          fields,
          formError: `${result}`,
        };
      }
      let user = gun.user(result)
      let _put = {
        document: `users.info.@${username}`,
      }

      const res = user.get(_put.document).on(({ lastLogin }) => {

        if (!lastLogin) {
          console.log('Key Last Login Failed')
          return false
        }
        lastLogin = `${new Date().getTime}`

      })
      if (!res) {
        console.log(res)
        return { ok: false, result: 'Err updating lastLogin' };
      }

      return createUserSession(result, `/dashboard/${username}`);
    }
    case 'register': {
      let { ok, result } = await setKey(username, password);
      if (!ok) {
        return {
          fields,
          formError: `${result}`,
        };
      }
      let user = gun.user(result)
      let _put = {
        id: result.slice(1, 12) as string,
        alias: username,
        createdAt: `${new Date().getTime}`,
        lastLogin: `${new Date().getTime}`
      }
      const res = user.get(`users.info.@${username}`,).put(_put, ({ err, ok }) => {

        if (ok) {
          return true
        }
        console.error(err)
        return false

      })
      if (!res) {
        console.log(res)
        return { ok: false, result: 'Err updating lastLogin' };
      }
      return createUserSession(result, `/dashboard/${username}`);
    }
    default: {
      return { fields, formError: `Login type invalid` };
    }
  }
}