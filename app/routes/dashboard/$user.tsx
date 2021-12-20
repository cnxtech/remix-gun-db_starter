import { MetaFunction, LoaderFunction, Outlet, useLoaderData } from 'remix';
import { json } from 'remix';
import invariant from 'tiny-invariant';
import { withGun } from '~/lib/constants/Gun';

export let loader: LoaderFunction = async({request ,params}) => {
  let form = await request.formData()
  let user = form.get('username')?.toString()
  let password = form.get('password')?.toString();
 invariant(user&& password, 'undefined')
  let data = withGun().login(user, password)
  return data;
};

export let meta: MetaFunction = () => {
  return {
    title: 'Remix Starter',
    description: 'Welcome to remix!',
  };
};

export default function DashIndex() {
  let data = useLoaderData()
  return (
    <div className="remix__page">
      <div>

      </div>
      <aside>{data? data.result: 'NA'}</aside>
    </div>
  );
}
