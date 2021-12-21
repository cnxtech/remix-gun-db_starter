import { Form, Link, redirect, useActionData } from 'remix';
import InputText from '~/components/InputText';
import { Strapd } from '~/lib/constants/Gun';
import invariant from 'tiny-invariant';


export async function action({ request }) {
  let {createUser,login, gun, addData} = Strapd()
  let form = await request.formData();
  let username = form.get('username')?.toString();
  let password = form.get('password')?.toString();
  invariant(username && password, 'string');

  return await new Promise((resolve) =>
    gun.get(`~@${username}`).once(async (user) => {
      invariant(username && password, 'string');
      if (!user) {
        const err = await createUser(username, password);
        if (err) {
          resolve({ ok: false, result: err });
        }
      }
      const { ok, result } = await login(username, password);
      if (!ok) {
        resolve({ ok, result });
      }

      const res = await addData('keys', 'master', result, password);
      if (res === 'Added data!') {
        resolve({ ok: true, result: result });
      } else {
        resolve({ ok: false, result: res });
      }
    })
  ).then(() => redirect(`/dashboard/${username}`));
};

///////////////
export default function SigupForm () {
    let action = useActionData()
  return (
    <>
      <Form method="post" className="flex flex-col pt-3 md:pt-8">
        <div className="flex flex-col pt-4">
          <InputText
            type="text"
            square={false}
            icon={
              <svg
                width="15"
                height="15"
                fill="currentColor"
                viewBox="0 0 1792 1792"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1792 710v794q0 66-47 113t-113 47h-1472q-66 0-113-47t-47-113v-794q44 49 101 87 362 246 497 345 57 42 92.5 65.5t94.5 48 110 24.5h2q51 0 110-24.5t94.5-48 92.5-65.5q170-123 498-345 57-39 100-87zm0-294q0 79-49 151t-122 123q-376 261-468 325-10 7-42.5 30.5t-54 38-52 32.5-57.5 27-50 9h-2q-23 0-50-9t-57.5-27-52-32.5-54-38-42.5-30.5q-91-64-262-182.5t-205-142.5q-62-42-117-115.5t-55-136.5q0-78 41.5-130t118.5-52h1472q65 0 112.5 47t47.5 113z" />
              </svg>
            }
            placeholder="Username"
            name="username"
          />
        </div>

        <div className="flex flex-col pt-4 mb-12">
          <InputText
            type="password"
            square={false}
            icon={
              <svg
                width="15"
                height="15"
                fill="currentColor"
                viewBox="0 0 1792 1792"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1376 768q40 0 68 28t28 68v576q0 40-28 68t-68 28h-960q-40 0-68-28t-28-68v-576q0-40 28-68t68-28h32v-320q0-185 131.5-316.5t316.5-131.5 316.5 131.5 131.5 316.5q0 26-19 45t-45 19h-64q-26 0-45-19t-19-45q0-106-75-181t-181-75-181 75-75 181v320h736z" />
              </svg>
            }
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