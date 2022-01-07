import {
  Outlet,
  useCatch,
} from 'remix';
import { LoaderFunction, useLoaderData } from 'remix';
import { APP_KEY_PAIR, getUserId } from '~/session.server';
import ProfileHeader from '~/components/ProfileHeader';
import { getVal, gun,  } from '~/lib/GunDb';
import Display from '~/components/DisplayHeading';

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
  return getVal(`${userId}`, 'info', APP_KEY_PAIR); 
};


export default function User() {
  let {alias,job, description, id} = useLoaderData();

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
