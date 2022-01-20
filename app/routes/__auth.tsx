/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
// app/routes/login.tsx
import { Outlet } from 'remix';
import DisplayHeading from '~/components/DisplayHeading';
import Display from '~/components/DisplayHeading';
import RoundContainer from '~/components/RoundContainer';

export default function Signup() {
  return (
    <RoundContainer>
      <div className="mt-10 pt-16 grid grid-cols-2 gap-8">
        <div className="flex flex-col justify-start">
          <DisplayHeading
            title="PASSWORDLESS"
            span="Authorization [...in progress]"
            spanColor="red-500"
            titleColor="blue-600"
            description={`
              If you have an account and have used this browser before:
              Enter your identification string and choose a combination of 
              colored symbols to verify this session of transactions.

              If you have an account and have not signed in
              using this current browser (or cleared you localStorage):
              Enter your identification string and paste your cryptographic key set.

              If you are starting a new account:
              Enter your identification string and basic profile info to generate your keys.
 
              `}
          />
        </div>

        <Outlet />
      </div>
    </RoundContainer>
  );
}
