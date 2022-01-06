import { ActionFunction} from 'remix';
import { logout } from '~/session.server';
export let action: ActionFunction = async({request}) => { 
 //action function
  return await logout(request)
}

export default function Logout() {
// main function
  return (
<>
</>
  );
}