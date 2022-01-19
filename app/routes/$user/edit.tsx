import {
  ActionFunction,
  Form,
  json,
  LoaderFunction,
  redirect,
  useActionData,
  useCatch,
  useLoaderData,
} from 'remix';
import Button from '~/components/buttons/Button';
import Display from '~/components/DisplayHeading';
import FormSubscribe from '~/components/FormSubscribe';
import InputText from '~/components/InputText';
import { validateJob, validateDescription } from '~/lib/utils/validate-strings';

type ActionData = {
  formError?: string;
  fieldErrors?: { job: string | undefined; description: string | undefined };
  fields?: { job: string; description: string };
};

export let loader: LoaderFunction = async ({ params }) => {
  return null;
};
///////////////

export let action: ActionFunction = async ({ request, params }) => {
return null;
};

///////////////
export default function Edit() {
  let err = useActionData();
  return (
    <>
      <section className="h-screen bg-opacity-50">
        <h1>{err ?? err}</h1>
        <Form
          method="post"
          className="container max-w-2xl mx-auto shadow-md md:w-3/4"
        >
          <div className="p-4 border-t-2 border-indigo-400 rounded-lg bg-opacity-5">
            <div className="max-w-sm mx-auto md:w-full md:mx-0">
              <div className="inline-flex items-center space-x-4">
                {/* <Avatar /> */}
                <h1 className="text-blue-500">Edit Profile</h1>
              </div>
            </div>
          </div>
          <div className="space-y-6 bg-gray-800">
            <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0"></div>

            <hr />
            <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
              <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
                <div className="max-w-sm mx-auto md:w-2/3">
                  <InputText placeholder="Job Title" name="job" type="text" />
                </div>
                <div>
                  <InputText placeholder="Description" name="description" />
                </div>
                {/* <div>
                  <InputText placeholder="Phone number" id="user-info-phone" />
                </div> */}
              </div>
            </div>

            <hr />
            {/* <div className="items-center w-full p-8 space-y-4 text-gray-500 md:inline-flex md:space-y-0"> */}
            {/* <h2 className="max-w-sm mx-auto md:w-4/12">Change password</h2>

              <div className="w-full max-w-sm pl-2 mx-auto space-y-5 md:w-5/12 md:pl-9 md:inline-flex">
                <InputText placeholder="Password" id="user-info-password" />
              </div>

              <div className="text-center md:w-3/12 md:pl-6">
                <Button color="pink" label="Change" />
              </div>
            </div>

            <hr /> */}
            <div className="w-full px-4 pb-4 ml-auto text-gray-500 md:w-1/3">
              <Button submit={true} color="blue" label="Save" />
            </div>
          </div>
        </Form>
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
