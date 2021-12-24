import Gun from 'gun';
import { ActionFunction, LoaderFunction, useLoaderData } from 'remix';

import { Strapd } from '~/lib/constants/Strapd';

export let loader: LoaderFunction = async({request, params}) => { 
  let { putData, getData,} = Strapd()

return null
}

///////////////
// export let action: ActionFunction = async({request}) => { 
//  //action function
//   return null
// }
///////////////
export default function User() {
let data = useLoaderData()

  return (
<div>
<p></p>
</div>
  );
}

