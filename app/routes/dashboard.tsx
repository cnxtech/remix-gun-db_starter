import { Outlet } from 'remix';

export default function Profile() {
  return (
    <div>
      <Outlet />
      <aside></aside>
    </div>
  );
}
