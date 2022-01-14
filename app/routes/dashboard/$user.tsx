import { Outlet, useCatch } from 'remix';
import { LoaderFunction, useLoaderData } from 'remix';
import { APP_KEY_PAIR, getUserId } from '~/session.server';
import ProfileHeader from '~/components/ProfileHeader';
import { getVal, gun, putVal } from '../../lib/GunDb';
import Display from '~/components/DisplayHeading';

export let loader: LoaderFunction = async ({ request, params }) => {
  let userId = await getUserId(request);
  let username = params.user;
  let isAlias = gun.get(`~@${username}`).once(async (exist) => {
    if (!exist) return false;
    return true;
  });
  if (!isAlias) {
    throw new Response(`Forbidden`, { status: 403 });
  }
  return getVal(`${userId}//${username}`, 'info', APP_KEY_PAIR);
};

export default function User() {
 let data = useLoaderData();
 console.log(data)
let  { alias, job, description, id } = data
  return (
    <div className="mt-5">
      <ProfileHeader
        img={`https://avatars.dicebear.com/api/micah/${id}}.svg`}
        name={alias}
        size="monster"
        job={job}
        desc={description}
      />
      <h1>Get Function ◊</h1>
      <p>{JSON.stringify(data)}</p>
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
