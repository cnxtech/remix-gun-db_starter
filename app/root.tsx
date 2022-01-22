import {
  LoaderFunction,
  MetaFunction,
  Outlet,
  useActionData,
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
import { IGunChainReference } from 'gun/types/chain';
import { encrypt, decrypt } from './lib/remix-gun-context/context';
import { OptParams } from './lib/remix-gun-context/types';

 const master: IGunCryptoKeyPair = {
  pub: process.env.PUB,
  priv: process.env.PRIV,
  epub: process.env.EPUB,
  epriv: process.env.EPRIV,
};

export let loader: LoaderFunction = () => {

  let links= [
        { to: '/', label: 'Home' },
        { to: '/login', label: 'LogIn' },
        { to: '/logout', label: 'LogOut' },
      ]
  return {links}
};

export default function App() {
  const {links} = useLoaderData()


  let [state, setState] = React.useState({})
  React.useEffect(() => {
    
     get('test', 'testy', (data) => {
      setState(data)
    }, {client: true});
  })


  ;
  return (
    <Document>
      <Layout theme={'dark'}>
        <Header
          links={links}
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

const ports = {
  DOMAIN: process.env.DOMAIN,
  RELAY: process.env.GUN_PORT,
  CLIENT: process.env.CLIENT_PORT,
};

export const gun = new Gun({
  peers: [`http://0.0.0.0:${ports.RELAY}gun`],
  radisk: false,
  localStorage: true,
});
export const relay = new Gun({
  peers: [
    `http://${ports.DOMAIN}:${ports.CLIENT}gun` ||
      `https://${ports.DOMAIN}:${ports.CLIENT}gun`,
  ],
  radisk: false,
  localStorage: true,
});
export const put = (
  document: string,
  key: string,
  value: any,
  { client = false, encryptionKey }: OptParams
) => {
  let db: IGunChainReference;
  if (!client) {
    db = relay;
  }
  db = gun;
  return db
    .get(document)
    .get(key)
    .put(value as never, async (ack) => {
      if (encryptionKey) {
        value = await encrypt(value, encryptionKey);
      }
      value = await encrypt(value, master);
      // console.log(ack);
      return ack.ok ? 'Added data!' : ack.err?.message ?? undefined;
    });
};

export const get = (
  document: string,
  key: string,
  cb: (data: any) => any,
  { client = false, encryptionKey }: OptParams
) => {
  let db: IGunChainReference;
  if (!client) {
    db = relay;
  }
  db = gun;
  return db
    .get(document)
    .get(key)
    .once(async (data) => {
      // console.log('data:', data);
      encryptionKey
        ? (data = await decrypt(data, encryptionKey))
        : (data = await decrypt(data, master));
      if (cb) {
        return cb(data);
      }
      return data;
    });
};



