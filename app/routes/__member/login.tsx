import { IGunCryptoKeyPair } from 'gun/types/types';
import { Form, json, useActionData, useCatch } from 'remix';
import Button from '~/components/buttons/Button';
import Display from '~/components/DisplayHeading';
import InputText from '~/components/InputText';
import SvgIcon from '~/components/svg/logos/SvgIcon';
import { paths } from '~/components/svg/logos/SvgIcon';
import { createUser, setMap } from '~/lib/GunDb/GunCtx';
import { blogs } from '~/lib/utils/data/helpers'
import Gun from 'gun'
import { useEffect, useReducer, useState } from 'react';

export async function action({ request }) {
  let { alias, priv } = Object.fromEntries(await request.formData());
  if (typeof alias !== 'string') {}
  let fields = { alias};
  console.log(fields);
  let {result} = await createUser(fields.alias);
  if (typeof {result} === 'string') return new Response(`The alias ${fields.alias} exists... but your credentials are not stored in the browser. Paste credentials below. `);
  return  result;
}
let initialState = []
let reducer = (state: any, set: any) => {
  return [...state, set ]
}
///////////////
export default function Login() {
  let action = useActionData();
  let [state, dispatch] = useReducer(reducer,initialState)
  let gun = Gun()

// blogs.forEach((value: any) => {
//   let set = gun.get('test3').put(value)
//     gun.get('document').set(set)
// })

useEffect(() => {
  gun.get('document').map().once(data => {
        if (!data) return {undefined}
        dispatch(data)

      }) 
}, [gun.get('document').off()])
 
    


    
  

// console.log( test);
  return (
    <>
      <Form method="post" className="flex flex-col pt-3 md:pt-8 max-w-xl">
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
        <button
          type="submit"
          className="w-full px-4 py-2 text-base font-semibold text-center text-white transition duration-200 ease-in bg-black shadow-md hover:text-black hover:bg-white focus:outline-none focus:ring-2"
        >
          <span className="w-full">Submit</span>
        </button>
      </Form>
      <p> {JSON.stringify(state)} </p>
      { action ? <p>{JSON.stringify(action)}</p> : null}
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
