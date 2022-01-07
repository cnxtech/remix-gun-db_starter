import {
  ActionFunction,

} from 'remix';
import { LoaderFunction, useLoaderData } from 'remix';
import { APP_KEY_PAIR,  getUserId } from '~/session.server';
import BlogList from '~/components/blog/BlogList';

import { getVal, gun } from '~/lib/GunDb';


interface LoaderPromise {
  alias: string;
  userId: string;
}

export let loader: LoaderFunction = async ({ request, params }) => {
  let userId = await getUserId(request);
  if (!userId) {
    throw new Response(`Forbidden`, { status: 403 });
  }
  let isAlias = gun.get(`~@${params.user}`).once(async (exist) => {
    if (!exist) return false;
    return true;
  });

  if (!isAlias) {
    throw new Response(`Alias Not Found`, { status: 404 });
  }
  return getVal(`${userId}`, 'info', APP_KEY_PAIR);
};

///////////////
export let action: ActionFunction = async ({ request }) => {
  //action function
  return null;
};
///////////////
export default function List() {
    let { alias, id } = useLoaderData();
  return (
    <>
      <BlogList userId={id} alias={alias} />
    </>
  );
}
