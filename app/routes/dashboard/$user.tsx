import { json, Link, useCatch } from 'remix';
import Gun from 'gun';
import { gun } from '~/gun.server';
import { ActionFunction, LoaderFunction, useLoaderData } from 'remix';

import { GunClient } from '~/lib/utility-fx/GunClient';
import { getUserId } from '~/session.server';
import invariant from 'tiny-invariant';
import ProfileHeader from '~/components/ProfileHeader';

interface LoaderData {
  ok: boolean;
  result: string;
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
  let { putData, getData } = await GunClient();
  let alias = params.user;
  let userId = await getUserId(request);
  let user = gun.user(userId);
let test = gun.get('name').get('test')
test.put({alias: `${alias}`, id: userId.slice(1,12), job: 'Job Title', description: 'This is where description will go ... Edit mode in process'})
  let data =  test.on((data: any, key: string) => { return {alias: data.alias , id: data.id,job: data.job, description: data.description}})

 return data
};

///////////////
// export let action: ActionFunction = async({request}) => {
//  //action function
//   return null
// }
///////////////
export default function User() {
  let {alias,job, id, description, } = useLoaderData();

  return (
    <div className="mt-5">
      <ProfileHeader img='/images/person/3.jpg' name={alias} size="monster" job={job} desc={'User Id:  ' + id} />
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
