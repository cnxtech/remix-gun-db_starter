import {
  LoaderFunction,
  MetaFunction,
  Outlet,
  useCatch,
  useLoaderData,
  useLocation,
} from 'remix';
import React from 'react';
import Document from './components/remix/Document';
import type { LinksFunction } from 'remix';
import styles from '~/styles/tailwind.css';
import globalStylesUrl from '~/styles/global.css';
import darkStylesUrl from '~/styles/dark.css';
import Layout from './components/remix/Layout';
import Display from './components/DisplayHeading';
import Header from './components/Header';
import CNXTLogo from './components/svg/logos/CNXT';
import Gun from 'gun';
import { IGunCryptoKeyPair } from 'gun/types/types';
import { get, gun, put } from './lib/remix-gun-context/context';

export const loader: LoaderFunction = () => {

  
  return null;
};

export default function App() {
  const location = useLocation();
  // console.log(location);
  let data = {
    links: [
      { to: '/', label: 'Home', isFat: true },
      { to: '/login', label: 'LogIn' },
      { to: '/logout', label: 'LogOut' },
    ],
  };
  let [state, setState] = React.useState({})
  React.useEffect(() => {
    
     get('test', 'testy', (data) => {
      setState(data)
    }, {client: true});
  })

  console.log(state)
  ;
  return (
    <Document>
      <Layout theme={'dark'}>
        <Header
          links={data.links}
          hideHelp={true}
          hideGitHubLink={true}
          logo={<CNXTLogo />}
        />
        <Outlet />
      </Layout>
    </Document>
  );
}
export let links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: globalStylesUrl },
    {
      rel: 'stylesheet',
      href: darkStylesUrl,
      media: '(prefers-color-scheme: dark)',
    },
    { rel: 'stylesheet', href: styles },
    {
      rel: 'stylesheet',
      href: 'https://use.fontawesome.com/releases/v5.15.4/css/all.css',
    },
    {
      rel: 'stylesheet',
      href: 'https://cdn.materialdesignicons.com/6.5.95/css/materialdesignicons.min.css',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-touch-icon.png',
    },
    { rel: 'apple-touch-startup-image', href: '/apple-touch-icon.png' },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: '/favicon-16x16.png',
    },
    { rel: 'manifest', href: '/manifest.json' },
  ];
};
export const meta: MetaFunction = () => {
  return {
    title: 'Bresnow Design Studio',
    description: 'Remix/ GunDB/ Tailwind Boilerplate',
    'format-detection': 'telephone=no',
    'apple-mobile-web-app-title': 'Bresnow',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-transparent',
    'theme-color': '#000',
    'mobile-web-app-capable': 'yes',
    'msapplication-config': '/browserconfig.xml',
    'msapplication-TileColor': '#000',
  };
};

// https://remix.run/docs/en/v1/api/conventions#errorboundary
export function ErrorBoundary({ error }) {
  console.error(error);
  return (
    <Document title={`Uh-oh! ${error}`}>
      <div className="min-h-screen py-4 flex flex-col justify-center items-center">
        <Display
          title="F#@k!"
          titleColor="white"
          span={error.message}
          spanColor="red-500"
          description={`${error}`}
        />
      </div>
    </Document>
  );
}

// https://remix.run/docs/en/v1/api/conventions# catchboundary
export function CatchBoundary() {
  let caught = useCatch();

  switch (caught.status) {
    case 401:
    case 403:
    case 404:
      return (
        <Document title={`${caught.status} ${caught.statusText}`}>
          <div className="min-h-screen py-4 flex flex-col justify-center items-center">
            <Display
              title={`${caught.status}`}
              titleColor="white"
              span={`${caught.statusText}`}
              spanColor="pink-500"
              description={`${caught.statusText}`}
            />
          </div>
        </Document>
      );

    default:
      throw new Error(
        `Unexpected caught response with status: ${caught.status}`
      );
  }
}

/** Gun — 
 * setting up the initial schema browser storage
 * 
 */



export let initialState = [];
export let reducer = (state: any, set: any) => {
  return [...state, set];
};
/////

// const gun = Gun({ peers: peers });
export function map(document: string, dispatch: React.Dispatch<any>) {
  return gun
    .get(document)
    .map()
    .on(async (data) => {
      if (!data) return undefined;
      data = await Gun.SEA.decrypt(data, master);
      dispatch(data);
    });
}

const master= 'abcdefg'