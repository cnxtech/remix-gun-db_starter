import { ActionFunction, Link, LoaderFunction } from 'remix';
import Button from '~/components/buttons/Button';
export let loader: LoaderFunction = async({params}) => { 
 // loader function
  return null
}
///////////////
export let action: ActionFunction = async({request}) => { 
 //action function
  return null
}
///////////////
export default function UserIndex() {
// main function
  return (
    <>
      <div className="w-full px-4 pb-4 mx-auto text-gray-500 md:w-1/3">
        <Link to="list">
          <Button submit={true} color="blue" label="Tags" />
        </Link>
        <Link to="edit">
          <Button submit={true} color="red" label="Edit" />
        </Link>
      </div>
    </>
  );
}