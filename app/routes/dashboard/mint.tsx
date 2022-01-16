import { useEffect, useRef } from 'react';
import type { ActionFunction } from 'remix';
import { Form, json, useActionData, redirect } from 'remix';
import invariant from 'tiny-invariant';
import Button from '~/components/elements/buttons/Button';
import InputArea from '~/components/form/inputtext/InputArea';
import { putVal } from '~/lib/GunDb';

export function meta() {
  return { title: 'Mint Tokens' };
}
type ActionMessage = {
  pubKey: string;
  privKey: string;
};
// When your form sends a POST, the action is called on the server.
// - https://remix.run/api/conventions#action
// - https://remix.run/guides/data-updates
export let action: ActionFunction = async ({ request }) => {
  let body = await request.formData();
  let name = body.get('name');
  let description = body.get('description');
  let publisher = body.get('publisher');
  let url = body.get('url');
  let put = putVal('test', 'data', body);
  console.log(put);

  return redirect('/');
};

export default function ActionsDemo() {
  // https://remix.run/api/remix#useactiondata
  let actionMessage = useActionData<ActionMessage>();
  let answerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionMessage && answerRef.current) {
      answerRef.current.select();
    }
  }, [actionMessage]);

  return (
    <div className="flex relative z-20 justify-center w-full overflow-hidden">
      <div className="sm:w-2/3 lg:w-2/5 flex flex-col relative z-20">
        <span className="w-20 h-2 bg-gray-800 dark:bg-white mb-12"></span>
        <h1 className="font-bebas-neue uppercase text-6xl sm:text-8xl font-black flex flex-col leading-none dark:text-white text-gray-800">
          Mint Your Tagged
          <span className="text-5xl sm:text-7xl dark:text-red-500">
            MetricToken
          </span>
        </h1>
        <Form method="post" className="flex max-w-full space-x-3">
          <div className="w-full max-w-2xl px-5 py-10 m-auto mt-10 bg-white rounded-lg shadow dark:bg-gray-800">
            <div className="mb-6 text-3xl font-light text-center text-gray-800 dark:text-white"></div>

            <div className="grid max-w-xl grid-cols-2 gap-4 m-auto">
              <div className="col-span-2 lg:col-span-1">
                <input
                  className="block w-full py-1.5 pl-10 pr-4 leading-normal rounded-2xl focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ring-opacity-90 bg-gray-100 dark:bg-gray-900 text-gray-400 aa-inpu"
                  ref={answerRef}
                  placeholder="Tag"
                  name="name"
                />
              </div>
              <div className="col-span-2 lg:col-span-1">
                <input
                  className="block w-full py-1.5 pl-10 pr-4 leading-normal rounded-2xl focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ring-opacity-90 bg-gray-100 dark:bg-gray-900 text-gray-400 aa-inpu"
                  ref={answerRef}
                  placeholder="Url"
                  name="url"
                  type="url"
                />
              </div>
              <div className="col-span-2 lg:col-span-1">
                <input
                  className="block w-full py-1.5 pl-10 pr-4 leading-normal rounded-2xl focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ring-opacity-90 bg-gray-100 dark:bg-gray-900 text-gray-400 aa-inpu"
                  ref={answerRef}
                  placeholder="Publisher"
                  name="publisher"
                />
              </div>

              <div className="col-span-2 lg:col-span-1">
                <input
                  className="block w-full py-1.5 pl-10 pr-4 leading-normal rounded-2xl focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ring-opacity-90 bg-gray-100 dark:bg-gray-900 text-gray-400 aa-inpu"
                  placeholder="Url Service Is Only Available"
                  disabled={true}
                  name="service"
                />
              </div>

              <InputArea />

              <div className="col-span-2">
                {' '}
                {actionMessage ? (
                  <p>
                    <b>{actionMessage}</b>
                  </p>
                ) : null}
              </div>

              <div className="col-span-2 text-right">
                <div className=" inline-flex rounded-md shadow">
                  <button className="py-4 px-6  bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
