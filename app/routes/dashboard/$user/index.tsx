import React from 'react';
import {
  ActionFunction,
  json,
  Link,
  LoaderFunction,
  useLoaderData,
} from 'remix';
import Button from '~/components/buttons/Button';
import Wee from '~/components/Wee';
import { getVal,putVal, setArray } from '~/lib/GunDb';
import { blogs } from '~/lib/utils/data/helpers';
import { getUserId, APP_KEY_PAIR } from '~/session.server';
import Gun from 'gun';
let gun = Gun();



export function Test() {
  const [state, setState] = React.useState([{}]);
  gun.get("testDoc").set({ hello: "world567", test: "Bresnow" });
  gun.get("testDoc").set({ hello: "lalalalala", test: "Bresnow4444" });
  gun.get("testDoc").set({ hello: "world5674444", test: "Bresnow64646" });

  gun
    .get('testDoc')
    .map()
    .once((value) => setState([value]));

  return state;
}


export let loader: LoaderFunction = async ({ request, params }) => {
  let userId = await getUserId(request);
  if (!userId) {
    throw new Response(`Forbidden`, { status: 403 });
  }
  let username = params.user;

  return null
};
///////////////
export let action: ActionFunction = async ({ request }) => {
  //action function
  return null;
};
///////////////

export default function UserIndex() {
  let data = useLoaderData();
  let state = Test();
  console.log(data);

  return (
    <>
      <div className="w-full px-4 pb-4 mx-auto text-gray-500 md:w-1/3">
        <Link to="list">
          <Button submit={true} color="blue" label="Tags" />
        </Link>
        <Link to="edit">
          <Button submit={true} color="red" label="Edit" />
        </Link>
      </div>
      <h1>Map Function</h1>
      <p className="text-yellow-500">{JSON.stringify(state)}</p>
    </>
  );
}

