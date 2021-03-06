import { Outlet, useCatch } from 'remix';
import { LoaderFunction, useLoaderData } from 'remix';
import ProfileHeader from '~/components/ProfileHeader';
import Display from '~/components/DisplayHeading';

export let loader: LoaderFunction = async ({ request, params }) => {
  return null;
};

export default function User() {
  let { data, keys } = useLoaderData();
  console.log(keys);

  return (
    <div className="mt-5">
      <ProfileHeader
        img={`https://avatars.dicebear.com/api/micah/${
          data.alias ?? data.alias
        }}.svg`}
        name={data.alias ?? data.alias}
        size="monster"
        job={data.job ?? data.job}
        desc={data.description ?? data.description}
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
