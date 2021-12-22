import { Form, Link, redirect, useActionData } from 'remix';
import InputText from '~/components/InputText';
import { Strapd } from '~/lib/constants/Gun';
import SvgIcon from '~/components/SvgIcon';
import {paths} from '~/components/SvgIcon';

export async function action({ request }) {
  let {setKey} = Strapd()
  let form = await request.formData();
  let username = form.get('username')?.toString();
  let password = form.get('password')?.toString();
  return await setKey(username, password).then(() => redirect(`/dashboard/${username}`));
};

///////////////
export default function SigupForm () {
    let action = useActionData()
  return (
    <>
      <Form method="post" className="flex flex-col pt-3 md:pt-8">
        <div className="flex flex-col pt-4 mb-4">
          <InputText
            type="text"
            square={false}
            icon={<SvgIcon path={paths.email} />}
            placeholder="Username"
            name="username"
          />
        </div>

        <div className="flex flex-col pt-4 mb-12">
          <InputText
            type="password"
            square={false}
            icon={<SvgIcon path={paths.password} />}
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
        {action ? (
          <div className="flex-center mx-auto">
            <h5>
              Error:
              <span className="text-green-400 text-sm">{action.result}</span>
            </h5>
            <p>
              {' '}
              <Link
                to={`/dashboard/${action.hashId}`}
                className="font-semibold underline"
              >
                Go to Dashboard
              </Link>
            </p>
          </div>
        ) : null}
      </div>
    </>
  );
}