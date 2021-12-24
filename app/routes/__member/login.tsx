import { Form, useActionData } from 'remix';
import InputText from '~/components/InputText';
import SvgIcon from '~/components/SvgIcon';
import { paths } from '~/components/SvgIcon';

import { validateUsername, validatePassword } from '~/lib/constants/models';
import { createUserSession, login, register } from '~/session.server';

type ActionData = {
  formError?: string;
  fieldErrors?: { username: string | undefined; password: string | undefined };
  fields?: { loginType: string; username: string; password: string };
};

export async function action({ request }) {

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

      return createUserSession(result, `/profile/${username}}`);
    }
    case 'register': {
      let { ok, result } = await register({ username, password });
      if (!ok) {
        return {
          fields,
          formError: `${result}`,
        };
      }
      return createUserSession(result, `/profile/${username}}`);
    }
    default: {
      return { fields, formError: `Login type invalid` };
    }
  }
}

///////////////
export default function Login() {
  let action = useActionData<ActionData>();

  return (
    <>
      <Form
        method="post"
        aria-describedby={action?.formError ? 'form-error-message' : undefined}
        className="flex flex-col pt-3 md:pt-8"
      >
        <fieldset>
          <legend className="sr-only">Login or Register?</legend>
          <label>
            <input
              type="radio"
              name="loginType"
              value="login"
              defaultChecked={
                !action?.fields?.loginType ||
                action?.fields?.loginType === 'login'
              }
            />{' '}
            Login
          </label>
          <label>
            <input
              type="radio"
              name="loginType"
              value="register"
              defaultChecked={action?.fields?.loginType === 'register'}
            />{' '}
            Register
          </label>
        </fieldset>
        <div className="flex flex-col pt-4 mb-4">
          <InputText
            type="text"
            square={false}
            icon={<SvgIcon size="15" path={paths.email} />}
            placeholder="Username"
            error={
              action?.fieldErrors ? action?.fieldErrors?.username : undefined
            }
            name="username"
          />
        </div>
        {action?.fieldErrors?.username ? (
          <p className="form-validation-error" role="alert" id="username-error">
            {action.fieldErrors.username}
          </p>
        ) : null}
        <div className="flex flex-col pt-4 mb-12">
          <InputText
            type="password"
            square={false}
            icon={<SvgIcon size="15" path={paths.password} />}
            placeholder="Password"
            error={action?.fieldErrors?.password ? 'password-error' : undefined}
            name="password"
          />
        </div>
        {action?.fieldErrors?.password ? (
          <p className="form-validation-error" role="alert" id="password-error">
            {action.fieldErrors.password}
          </p>
        ) : null}

        <button
          type="submit"
          className="w-full px-4 py-2 text-base font-semibold text-center text-white transition duration-200 ease-in bg-black shadow-md hover:text-black hover:bg-white focus:outline-none focus:ring-2"
        >
          <span className="w-full">Submit</span>
        </button>
      </Form>
      <div className="pt-12 pb-12 text-center">
        {' '}
        {action?.formError ? (
          <p className="form-validation-error" role="alert">
            {action.formError}
          </p>
        ) : null}
      </div>
    </>
  );
}
