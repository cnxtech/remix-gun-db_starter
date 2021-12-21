import { MetaFunction, LoaderFunction, Outlet } from 'remix';
import { json } from 'remix';

export let loader: LoaderFunction = () => {
  let data = {};
  return json(data);
};

export let meta: MetaFunction = () => {
  return {
    title: 'Remix Starter',
    description: 'Welcome to remix!',
  };
};

export default function DashIndex() {
  return (
    <div className="remix__page">
      <div><Outlet/></div>
      <aside></aside>
    </div>
  );
}
