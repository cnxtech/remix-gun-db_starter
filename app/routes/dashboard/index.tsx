import { Link, useCatch } from "remix";
import Gun from 'gun';
import { ActionFunction, LoaderFunction, useLoaderData } from 'remix';

import { Strapd } from '~/lib/constants/Strapd';

export let loader: LoaderFunction = async ({ request, params }) => {
  let { putData, getData } = Strapd();

  return null;
};

///////////////
// export let action: ActionFunction = async({request}) => {
//  //action function
//   return null
// }
///////////////
export default function User() {
  let data = useLoaderData();

  return (
    <div>
      <p></p>
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
