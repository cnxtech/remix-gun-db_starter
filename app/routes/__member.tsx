/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
// app/routes/login.tsx
import { Outlet } from 'remix';

export default function Signup() {
  return (
    <div className="flex flex-wrap w-full">
      <div className="flex flex-col w-full md:w-1/2">
        <div className="flex justify-center pt-12 md:justify-start md:pl-12 md:-mb-24">
          {/* <h1 className="p-4 text-xl font-bold text-white bg-black">Design.</h1> */}
        </div>
        <div className="flex flex-col justify-center px-8 pt-8 my-auto md:justify-start md:pt-0 md:px-24 lg:px-32">
         
          <Outlet />
        </div>
      </div>

      <div className="w-1/2 shadow-2xl">
        <img
          className="hidden object-cover z-0 w-full h-screen md:block"
          src="/images/object/8.jpg"
        />
      </div>
    </div>
  );
}
