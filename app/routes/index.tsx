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
    <div className="remix__page">
      <main>
      <Display title="Remix" /> 
      </main>
      <aside>
       
      </aside>
    </div>
  );
}
