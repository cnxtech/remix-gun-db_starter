import { IGunCryptoKeyPair } from 'gun/types/types';
import { ActionFunction, Form, useActionData, useCatch } from 'remix';
import Display from '~/components/DisplayHeading';
import InputText from '~/components/InputText';
import { Context, decrypt, encrypt, GunCtx } from '../../../lib/GunDb/GunCtx';
import React from 'react';
import RoundContainer from '~/components/RoundContainer';
import { db } from '~/root';

interface NumberPad {
  label: string;
  color: string;
  value: string;
  onClick?: any;
}
interface ActionData {
  result: string;
  keys?: IGunCryptoKeyPair;
}
export let action:ActionFunction = async({ context, request }) =>{
  const { authenticate } = context as Context;
  let { ok, result, keys } = await authenticate(request);
}

//////////

const initialState = [];

// Create a reducer that will update the components array
function reducer(state, set) {
  return [set, ...state];
}
export let numbers: Array<NumberPad> = [];
export default function Login() {
  let action = useActionData<ActionData>();
  let [state, dispatch] = React.useReducer(reducer, initialState);
  // ᐀▝㨆#耙虃〫ా뎳輞耹뱰걔̺㢪錑輂虊籏錔/鱣簔Ი뎤뀉뒎鄻ᲀઙᤉ㺠耦뫠鋗覺�ꪺ�㫧ྀ䰍焚䀒頍ࠅ贾詑쵗夘遲ሀᖘ䀆ᑑ⋺䢝ރ虲棶⠲ᘊꆀ˱䀀
  let numbers = [
    {
      label: '뎳輞',
      color: 'red',
      value: '1',
    },
    {
      label: '➍',
      color: 'blue',
      value: '2',
    },
    {
      label: 'ሌጀ',
      color: 'green',
      value: '3',
    },
    {
      label: '֍',
      color: 'yellow',
      value: '4',
    },
    {
      label: '⬤',
      color: 'orange',
      value: '5',
    },
  ];
  let creds = db.get('USERS/LIST').get('1.0.1');

  React.useEffect(() => {
    creds.map().on((data) => {
      dispatch(data);
    });
  });
  // console.log(state);

  return (
    <RoundContainer>
      <div
        className="w-full mx-auto rounded-xl bg-gray-900 shadow-xl text-gray-800 relative overflow-hidden"
        style={{ maxWidth: '600px' }}
      >
        <div className="w-full h-40 bg-gradient-to-b from-gray-800 to-gray-700 flex items-end text-right">
          <div className="w-full py-5 px-6 text-6xl text-white font-thin"></div>
        </div>

        <div className="w-full bg-gradient-to-b from-indigo-400 to-indigo-500">
          <Form method="post" className="flex flex-col px-5 md:pt-8 max-w-l">
            <RoundContainer>
              {' '}
              {/* <NumPad /> */}
              <ul className="flex w-full">
                {numbers.map((number) => (
                  <NumberButton
                    label={number.label}
                    color={number.color}
                    onClick={() => console.log('clicked  ' + number.label)}
                    value={number.value}
                  />
                ))}
              </ul>
            </RoundContainer>
            <div className="flex flex-col pt-4 mb-4">
              <InputText
                type="text"
                square={false}
                // icon={<SvgIcon size="15" path={paths.email} />}
                placeholder="Username"
                name="alias"
              />
            </div>
            <button
              disabled
              type="submit"
              className="w-full px-4 py-2 text-base font-semibold text-center text-white transition duration-200 ease-in bg-black shadow-md hover:text-black hover:bg-white focus:outline-none focus:ring-2"
            >
              <span className="w-full">Submit</span>
            </button>
          </Form>
        </div>
      </div>
      <p> {JSON.stringify(state)}</p>
      {action ? <p>{JSON.stringify(action)}</p> : null}
      <div className="pt-12 pb-12 text-center"></div>
    </RoundContainer>
  );
}

export function CatchBoundary() {
  let caught = useCatch();

  switch (caught.status) {
    case 401:
    case 403:
    case 404:
      return (
        <div className="min-h-screen py-4 flex flex-col justify-center items-center">
          <Display
            title={`${caught.status}`}
            titleColor="white"
            span={`${caught.statusText}`}
            spanColor="pink-500"
            description={`${caught.statusText}`}
          />
        </div>
      );
  }
  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <div className="min-h-screen py-4 flex flex-col justify-center items-center">
      <Display
        title="Error:"
        titleColor="white"
        span={error.message}
        spanColor="red-500"
        description={`error`}
      />
    </div>
  );
}

export function NumberButton({ label, value, onClick, color }: NumberPad) {
  return (
    <li
      key={Math.floor(Math.random() * 10)}
      onClick={onClick}
      className={`column w-1/4 items-center border-r border-b border-indigo-400`}
    >
      <RoundContainer
        className={`w-full h-16 outline-none rounded-sm focus:outline-none hover:bg-${color}-700 h hover:bg-opacity-20 text-white text-xl font-light`}
      >
        {label}
      </RoundContainer>
      <input type="hidden" />
    </li>
  );
}
