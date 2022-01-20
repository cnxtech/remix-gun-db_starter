import { IGunCryptoKeyPair } from 'gun/types/types';
import { Form, useActionData, useCatch } from 'remix';
import Display from '~/components/DisplayHeading';
import InputText from '~/components/InputText';
import { createUser, decrypt, encrypt, gun } from '~/lib/GunDb/GunCtx';
import Gun from 'gun';
import { getGun, loc, peers } from '~/lib/GunDb';
import { useEffect, useReducer } from 'react';
import NumPad from '~/components/NumberPad';
import { master } from '~/session.server';
import { IGunChainReference } from 'gun/types/chain';
import React from 'react';

interface NumberPad {
  label: string;
  onClick?: () => void;
}
interface ActionData {
  result: string;
  keys?: IGunCryptoKeyPair;
}
export async function action({ request }) {
  let { alias, priv } = Object.fromEntries(await request.formData());
  if (typeof alias !== 'string') {
  }
  let fields = { alias };
  console.log(fields);

  let { ok, result, keys } = await createUser(fields.alias);
  console.log(result);
  if (ok) return { result, keys };
  return result;
}

//////////

const initialState = [];

// Create a reducer that will update the components array
function reducer(state, set) {
  return [set, ...state];
}
const db = Gun({
  peers: ['http://localhost:5150/gun'],
});
export let numbers: Array<NumberPad> = [];
export default function Login() {
  let action = useActionData<ActionData>();
  let [state, dispatch] = React.useReducer(reducer, initialState);
  let numbers = [
    {
      label: '뎳輞',
    },
  ];
  let creds = db.get('user/store');

  React.useEffect(() => {
    creds.map().on(async (data) => {
      if (!data) return undefined;
      //  data = await decrypt(data, master);
      dispatch({val: data.val});
    });
  });


  return (
    <>
      <div
        className="w-full mx-auto rounded-xl bg-gray-900 shadow-xl text-gray-800 relative overflow-hidden"
        style={{ maxWidth: '600px' }}
      >
        <div className="w-full h-40 bg-gradient-to-b from-gray-800 to-gray-700 flex items-end text-right">
          <div className="w-full py-5 px-6 text-6xl text-white font-thin"></div>
        </div>

        <div className="w-full bg-gradient-to-b from-indigo-400 to-indigo-500">
          <Form method="post" className="flex flex-col px-5 md:pt-8 max-w-l">
            <div className="flex flex-col pt-4 mb-4">
              <InputText
                type="text"
                square={false}
                // icon={<SvgIcon size="15" path={paths.email} />}
                placeholder="Username"
                name="alias"
              />
            </div>
            <div className="flex flex-col pt-4 mb-12">
              <InputText
                type="text"
                square={false}
                // icon={<SvgIcon size="15" path={paths.password} />}
                placeholder="Password"
                name="priv"
              />
            </div>

            {/* <NumPad /> */}

            <div className="flex w-full">
              {numbers.map((number) => (
                <NumberButton
                  onClick={() => {
                    creds.set({ val: '77' });
                    return console.log('clicked');
                  }}
                  label={number.label}
                />
              ))}
              <div className="w-1/4 border-r border-b border-indigo-400">
                <button className="w-full h-16 outline-none focus:outline-none bg-indigo-700 bg-opacity-10 hover:bg-opacity-20 text-white text-xl font-light">
                  +
                </button>
              </div>
            </div>
            <div className="flex w-full">
              <div className="w-1/4 border-r border-indigo-400">
                <button className="w-full h-16 outline-none focus:outline-none hover:bg-indigo-700 hover:bg-opacity-20 text-white text-xl font-light">
                  0
                </button>
              </div>
              <div className="w-1/4 border-r border-indigo-400"></div>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-base font-semibold text-center text-white transition duration-200 ease-in bg-black shadow-md hover:text-black hover:bg-white focus:outline-none focus:ring-2"
            >
              <span className="w-full">Submit</span>
            </button>
          </Form>
        </div>
      </div>
      {/* <p> {JSON.stringify(state)} </p> */}
      {action ? <p>{JSON.stringify(action)}</p> : null}
      <div className="pt-12 pb-12 text-center"></div>
    </>
  );
}

export function CatchBoundary() {
  let caught = useCatch();

  switch (caught.status) {
    case 401:
    case 403:
    case 404:
      return (
        <div className="min-h-screen py-4 flex flex-col justify-center items-center">
          <Display
            title={`${caught.status}`}
            titleColor="white"
            span={`${caught.statusText}`}
            spanColor="pink-500"
            description={`${caught.statusText}`}
          />
        </div>
      );
  }
  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <div className="min-h-screen py-4 flex flex-col justify-center items-center">
      <Display
        title="Error:"
        titleColor="white"
        span={error.message}
        spanColor="red-500"
        description={`error`}
      />
    </div>
  );
}

export function NumberButton({ label, onClick }: NumberPad) {
  return (
    <div key={label} className={`w-1/4 border-r border-b border-indigo-400`}>
      <div
        onClick={() => console.log(`clicked`)}
        className={`w-full h-16 outline-none rounded-xl focus:outline-none hover:bg-red-700 hover:bg-opacity-20 text-white text-xl font-light`}
      >
        {label}
      </div>
    </div>
  );
}
