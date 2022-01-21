import React from 'react';
import { ActionFunction, Link, LoaderFunction, useLoaderData } from 'remix';
import Button from '~/components/buttons/Button';

export let loader: LoaderFunction = async ({ request, params }) => {
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
      <div className="w-full flex-row px-4 pb-4 mx-auto text-gray-500 md:w-1/3">
        <Link to="list">
          <Button submit={true} color="gray" disabled={true} label="Tags" />
        </Link>
        <Link to="edit">
          <Button submit={true} color="red" label="Edit Profile Info" />
        </Link>
      </div>
    </>
  );
}
