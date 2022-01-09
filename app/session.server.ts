
import { createCookieSessionStorage, redirect } from "remix";
import { getKey, gun, putVal, setKey } from "./lib/GunDb";
import { blogs, loadDummy } from "./lib/utils/data/helpers";
import { validateUsername, validatePassword } from "./lib/utils/validate-strings";


export function getDate() {
  const newDate = new Date();
  var dd = String(newDate.getDate()).padStart(2, 'O');
  var mm = String(newDate.getMonth() + 1).padStart(2, 'O');
  var yyyy = newDate.getFullYear();
  var sec = String(newDate.getTime())
  var timestamp = `${dd}.${mm}.${yyyy}:${sec}`
  return timestamp;
}
export const APP_KEY_PAIR = process.env.APP_KEY_PAIR

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
  let user = gun.user(userId)
  return user
}

export async function logout(request: Request) {
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
  const timestamp = getDate()
  switch (loginType) {
    case 'login': {
      let { ok, result } = await getKey(username, password);
      if (!ok) {
        return {
          fields,
          formError: `${result}`,
        };
      }

      let put2 = await putVal(`${result}//${username}`, 'test', "['hello', 'world', 'sam', 'hyde' ]", APP_KEY_PAIR)
      if (!put2) {
        console.error('no put for stringed array')
      }
      let datatime = {
        logged_in: timestamp,
      }

      let time = await putVal(`${result}//${username}`, 'info/time', datatime, APP_KEY_PAIR );

      if (!time) {
        throw new Error('Didnt Put Time Values')
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
      let data = {
        created: timestamp,
        id: result,
        alias: username,
        job: 'What is your job?',
        description: 'Write a description...'
      };

      let put = await putVal(`${result}//${username}`, 'info', data, APP_KEY_PAIR);

      if (!put) {
        throw new Error('Didnt Put Info Values')
      }

      let datatime = {
        logged_in: timestamp,
      }

      let time = await putVal(`${result}//${username}`, 'info/time', datatime, APP_KEY_PAIR);

      if (!time) {
        throw new Error('Didnt Put Time Values')
      }


      loadDummy(result, blogs)

      return createUserSession(result, `/dashboard/${username}`);
    }
    default: {
      return { fields, formError: `Login type invalid` };
    }
  }
}