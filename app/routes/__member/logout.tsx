import { ActionFunction, redirect } from 'remix';
import { destroySession, getSession, logout } from '~/session.server';
export let action: ActionFunction = async ({ request }) => {
  //action function
  let session = await getSession(request.headers.get('Cookie'));
  let unset = await logout(request);
  if (unset)
  return redirect('/');
};

export default function Logout() {
  // main function
  return (
    <>
      <h1>Logged Out</h1>
    </>
  );
}
