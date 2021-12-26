import { Link, useCatch } from "remix";
import Gun from 'gun';
import { gun, } from "~/gun.server";
import { ActionFunction, LoaderFunction, useLoaderData } from 'remix';

import { GunClient } from '~/lib/utility-fx/GunClient';
import { getUserId } from "~/session.server";
import invariant from "tiny-invariant";

interface LoaderData {
  ok: boolean;
  result: string;
}

type UserData = {
  id: string;
  alias: string;
}

type Socials = {
  facebook: SocialData
  twitter: SocialData
  linkedIn: SocialData
  github: SocialData
}

type SocialData = {
  brand: string;
  url: string;
  color?: string;
}
export let loader: LoaderFunction = async ({ request, params }) => {
  let {  putData } = GunClient();
  let userId = await getUserId(request);
if (!userId) {
  return {ok: false, result: 'public key not found. Please allow cookies'}
}
let user = gun.user().recall({ sessionStorage: true })
user.get('name').get('test').put({test:'testyteststs' })
return {
  ok: true, 
  result:userId
  }

}
      

///////////////
// export let action: ActionFunction = async({request}) => {
//  //action function
//   return null
// }
///////////////
export default function User() {
  let data = useLoaderData();

console.log(data.result)
  return (
    <div className='mt-5'>

      <p> Your PublicKey is : {data.result}</p>
    </div>
  );
}

export function CatchBoundary() {
  let caught = useCatch();

  if (caught.status === 404) {
    return (
      <div className="error-container">
        <p>There are no jokes to display.</p>
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