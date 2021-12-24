import type { MetaFunction, LoaderFunction } from "remix";
import { json } from "remix";
import Display from "~/components/DisplayHeading";


export let loader: LoaderFunction = () => {
  let data = {}
  return json(data) ;
};

export let meta: MetaFunction = () => {
  return {
    title: "Remix Starter",
    description: "Welcome to remix!"
  };
};

export default function Index() {

  return (
    <div className="mt-10 px-5">
      <main>
      <Display title="Remix/ GunDb" span="App Starter" description="Application boilerplate with authentication && sessionStorage, data encryption, and tailwind styling. " /> 
      </main>
      <aside>
       
      </aside>
    </div>
  );
}
