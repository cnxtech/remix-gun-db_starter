import { json, Link, useCatch } from 'remix';
import Gun from 'gun';
import { gun } from '~/gun.server';
import { ActionFunction, LoaderFunction, useLoaderData } from 'remix';

import { GunClient } from '~/lib/GunClient';
import { getUser, getUserId } from '~/session.server';
import invariant from 'tiny-invariant';
import ProfileHeader from '~/components/ProfileHeader';
import BlogList from '~/components/blog/BlogList';

interface LoaderData {
  ok: boolean;
  result: UserData;
}

type UserData = {
  id: string;
  alias: string;
};

type Socials = {
  facebook: SocialData;
  twitter: SocialData;
  linkedIn: SocialData;
  github: SocialData;
};

type SocialData = {
  brand: string;
  url: string;
  color?: string;
};

export let loader: LoaderFunction = async ({ request, params }) => {
  let alias = params.user;
  let userId = await getUserId(request);
  // let user = await getUser(request);
  return json({ ok: true, result: { id: userId, alias: alias } });
};

///////////////
// export let action: ActionFunction = async({request}) => {
//  //action function
//   return null
// }
///////////////
export default function User() {
  let { ok, result } = useLoaderData<LoaderData>();

  return (
    <div className="mt-5">
      <ProfileHeader
        img="/images/person/3.jpg"
        name={result.alias}
        size="monster"
        job={'Job Not Set'}
        desc={'User Id:  ' + result.id}
      />
      <BlogList />
    </div>
  );
}

export function CatchBoundary() {
  let caught = useCatch();

  if (caught.status === 404) {
    return (
      <div className="error-container">
        <p>No Profile to display.</p>
        <Link to="new">Add your own</Link>
      </div>
    );
  }
  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return <div className="error-container">I did a whoopsies.</div>;
}
