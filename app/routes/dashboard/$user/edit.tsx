import { ActionFunction, LoaderFunction } from 'remix';
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
export default function Edit() {
// main function
  return (
<>
<p>Edit</p>
</>
  );
}