import { putVal, getKey, setKey, gun } from "~/lib/GunDb";
import { validateUsername, validatePassword } from "~/lib/utils/validate-strings";
import { createUserSession } from "~/session.server";
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

            const res = user.get(_put.document).on( ({lastLogin}) => {

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