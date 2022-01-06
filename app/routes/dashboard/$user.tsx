import {
  ActionFunction,
  json,
  Link,
  Outlet,
  useActionData,
  useCatch,
} from 'remix';
import { LoaderFunction, useLoaderData } from 'remix';
import { getUser, getUserId } from '~/session.server';
import BlogList from '~/components/blog/BlogList';
import ProfileHeader from '~/components/ProfileHeader';
import { IGunChainReference } from 'gun/types/chain';
import { getVal, gun, putVal, user } from '~/lib/GunDb';
import Display from '~/components/DisplayHeading';
import { decrypt, encrypt } from '~/lib/GunDb/client';

interface LoaderPromise {
  alias: string;
  userId: string;
}

export let loader: LoaderFunction = async ({ request, params }) => {
  let userId = await getUserId(request);
  if (!userId) {
    throw new Response(`Forbidden`, { status: 403 });
  }
 let isAlias =  gun.get(`~@${params.user}`).once(async (exist) => {
    if (!exist) return false
    return true
  });

  if (!isAlias){
    throw new Response(`Alias Not Found`, { status: 404 });
  }

  let data = {
    alias: params.user,
    id: userId.slice(1, 12),
    avatar: 'newStuff',
    job: 'Interface Illustratoe',
    description: 'New Description',
  };

  let test = gun.get('test');
let put =  await putVal('test1234', 'lala2', data, userId);

if (!put) {
throw new Error('Didnt Put The Value')
}


  return getVal('test1234', 'lala2', userId); 
};

/////////////
export let action: ActionFunction = async ({ request, params }) => {
  let userId = await getUserId(request);
  let user = await getUser(request);

  return null;
};
/////////////
export default function User() {
  let {alias, avatar, job, description, id} = useLoaderData();
  let user = useActionData();

  return (
    <div className="mt-5">
      <ProfileHeader
        img={`https://avatars.dicebear.com/api/micah/${id}}.svg`}
        name={alias}
        size="monster"
        job={job}
        desc={description}
      />
      <Outlet />
      {/* <BlogList /> */}
    </div>
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
        description={`${error}`}
      />
    </div>
  );
}
