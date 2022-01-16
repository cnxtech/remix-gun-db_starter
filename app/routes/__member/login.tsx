import { Form, useActionData } from 'remix';
import InputText from '~/components/InputText';
import SvgIcon from '~/components/SvgIcon';
import { paths } from '~/components/SvgIcon';
import { signAction } from '~/lib/GunDb';
import { createUserSession } from '~/session.server';

type ActionData = { ok: boolean; result: string };

export async function action({ request }) {
  return await signAction(request);
 
}

///////////////
export default function Login() {
  // let {ok, result} = useActionData();

  return (
    <>
      <Form
        method="post"
        className="flex flex-col pt-3 md:pt-8"
      >
        <div className="flex flex-col pt-4 mb-4">
          <InputText
            type="text"
            square={false}
            icon={<SvgIcon size="15" path={paths.email} />}
            placeholder="Username"
            name="username"
          />
        </div>
        <div className="flex flex-col pt-4 mb-12">
          <InputText
            type="password"
            square={false}
            icon={<SvgIcon size="15" path={paths.password} />}
            placeholder="Password"
            name="password"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-base font-semibold text-center text-white transition duration-200 ease-in bg-black shadow-md hover:text-black hover:bg-white focus:outline-none focus:ring-2"
        >
          <span className="w-full">Submit</span>
        </button>
      </Form>
      <div className="pt-12 pb-12 text-center">
        {' '}
        {/* {!ok? (
          <p className="form-validation-error" role="alert">
            {result}
          </p>
        ) : null} */}
      </div>
    </>
  );
}
