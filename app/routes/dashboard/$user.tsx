import { Link, useCatch } from 'remix';
import {  getUserInfo, getVal } from '~/lib/GunCtx';
import { LoaderFunction, useLoaderData } from 'remix';
import { getUserId } from '~/session.server';
import BlogList from '~/components/blog/BlogList';
import ProfileHeader from '~/components/ProfileHeader';

interface LoaderData {
  ok: boolean;
  result: UserData;
}

type UserData = {
  id: string;
  alias: string;
  createdAt: string;
  lastLogin: string;
};

export let loader: LoaderFunction = async ({ request, params }) => {
  let alias = params.user;
  let userId = await getUserId(request);

              let _put = {
                document: `users.info.@${alias}`,
              };

  // let {ok, result} = await getUserInfo(alias)
  return {ok:true, result: {alias: alias , id: userId}}
};

///////////////
// export let action: ActionFunction = async({request}) => {
//  //action function
//   return null
// }
///////////////
export default function User() {
  let {result} = useLoaderData<LoaderData>();
  console.log(result.id);
  return (
    <div className="mt-5">
      <ProfileHeader
        img="/images/person/3.jpg"
        name={result.alias}
        size="monster"
        job={'Job Not Set'}
        desc={'User Id:  ' + result.id}
      />
      {/* <BlogList /> */}
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
