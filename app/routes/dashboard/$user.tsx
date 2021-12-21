import { LoaderFunction, useLoaderData, json } from 'remix';

export let loader: LoaderFunction = async({params}) => {
  let user = {}
return json(user)
};



export default function DashIndex() {
let data = useLoaderData()
  return (
    <>
      <div>
      </div>
      <aside>{data}</aside>
    </>
  );
}
