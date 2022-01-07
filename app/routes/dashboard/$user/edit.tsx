import { ActionFunction, LoaderFunction, useCatch } from 'remix';
import Avatar from '~/components/Avatar';
import Button from '~/components/buttons/Button';
import Display from '~/components/DisplayHeading';
import FormSubscribe from '~/components/FormSubscribe';
import InputText from '~/components/InputText';

type ActionData = {
  formError?: string;
  fieldErrors?: { username: string | undefined; password: string | undefined };
  fields?: Fields;
};

export let loader: LoaderFunction = async ({ params }) => {
  // loader function
  return null;
};
///////////////
export type Fields = {
  tags: string[];
  title: string;
  categ: string;
  img: URL;
  desc: string;
};

export let action: ActionFunction = async ({ request }) => {
  //action function
  return null;
};
///////////////
export default function Edit() {
  // main function
  return (
    <>
      <section className="h-screen bg-opacity-50">
        <form className="container max-w-2xl mx-auto shadow-md md:w-3/4">
          <div className="p-4 border-t-2 border-indigo-400 rounded-lg bg-opacity-5">
            <div className="max-w-sm mx-auto md:w-full md:mx-0">
              <div className="inline-flex items-center space-x-4">
                {/* <Avatar /> */}
                <h1 className="text-gray-600"></h1>
              </div>
            </div>
          </div>
          <div className="space-y-6 bg-white">
            <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
              <h2 className="max-w-sm mx-auto md:w-1/3">Account</h2>
              <div className="max-w-sm mx-auto md:w-2/3">
                <InputText placeholder="Email" id="user-info-email" />
              </div>
            </div>

            <hr />
            <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
              <h2 className="max-w-sm mx-auto md:w-1/3">Personal info</h2>
              <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
                <div>
                  <InputText placeholder="Name" id="user-info-name" />
                </div>
                <div>
                  <InputText placeholder="Phone number" id="user-info-phone" />
                </div>
              </div>
            </div>

            <hr />
            <div className="items-center w-full p-8 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
              <h2 className="max-w-sm mx-auto md:w-4/12">Change password</h2>

              <div className="w-full max-w-sm pl-2 mx-auto space-y-5 md:w-5/12 md:pl-9 md:inline-flex">
                <InputText placeholder="Password" id="user-info-password" />
              </div>

              <div className="text-center md:w-3/12 md:pl-6">
                <Button color="pink" label="Change" />
              </div>
            </div>

            <hr />
            <div className="w-full px-4 pb-4 ml-auto text-gray-500 md:w-1/3">
              <Button submit={true} color="blue" label="Save" />
            </div>
          </div>
        </form>
      </section>
      {/* <FormSubscribe input={} submitLabel="Submit" ariaDescribed="" /> */}
    </>
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
