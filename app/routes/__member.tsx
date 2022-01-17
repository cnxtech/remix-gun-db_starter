/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
// app/routes/login.tsx
import { Outlet } from 'remix';
import Display from '~/components/DisplayHeading';

export default function Signup() {
  return (
    <div className="flex flex-wrap w-full">
      <div className="flex flex-col w-full md:w-1/2">
        <div className="flex justify-center pt-12 md:justify-start md:pl-12 md:-mb-24">
        </div>

      </div>

      <div className="w-1/2 "> 
          <Display title="Auth" titleColor={'red-500'} span='signup' spanColor='blue-500'  />{' '}
       <Outlet />
    </div></div>
  );
}
