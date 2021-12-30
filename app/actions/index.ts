import { GunClient } from "~/lib/utility-fx/GunClient";
import { validateUsername, validatePassword } from "~/lib/utility-fx/validate-strings";
import { login, createUserSession, register } from "~/session.server";

export async function loginAction(request: any) {
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
            let profile = { id: result.slice(1, 12), alias: username, createdAt: `${new Date().getTime}`, updatedAt: `${new Date().getTime}` }
            const res = await GunClient().putData(`public/@${username}`, `profile`, profile );
            if (res !== 'Added data!') {
                return { ok: false, result: res };
            } 
            return createUserSession(result, `/dashboard/${username}`);
        }
        default: {
            return { fields, formError: `Login type invalid` };
        }
    }
}