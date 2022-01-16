import React from 'react';
import { ActionFunction, Link, LoaderFunction, useLoaderData } from 'remix';
import Button from '~/components/buttons/Button';
import { gun } from '../../../lib/GunDb';
import { getUserId } from '~/session.server';

export let loader: LoaderFunction = async ({ request, params }) => {
  let userId = await getUserId(request);
  if (!userId) {
    throw new Response(`Forbidden`, { status: 403 });
  }

  return null;
};
///////////////
export let action: ActionFunction = async ({ request }) => {
  //action function
  return null;
};
///////////////

export default function UserIndex() {
  let data = useLoaderData();
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
    </>
  );
}
