import {
  LoaderFunction,
  Link,
  Links,
  LiveReload,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from 'remix';
import type { LinksFunction } from 'remix';
import styles from '~/styles/tailwind.css';
import globalStylesUrl from '~/styles/global.css';
import darkStylesUrl from '~/styles/dark.css';
import Header from './components/Header';
import Logo from './components/Logo';
// @ts-ignore
import GunContextProvider from './lib/contexts/useGunContext.js';
import { createContext, useEffect, useRef } from 'react';
import { gun, user } from './lib/constants/Data';
import Gun from 'gun';
import { IGunChainReference } from 'gun/types/chain';
import { IGunStatic } from 'gun/types/static';
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
    { rel: 'manifest', href: '/site.webmanifest' },
  ];
};

export const meta: MetaFunction = () => {
  return {
    title: 'Bresnow Design Studio',
    description: 'Remix/ GunDB/ Tailwind Boilerplate',
    viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
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

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

// https://remix.run/docs/en/v1/api/conventions#errorboundary
export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <Document title="Error!">
      <Layout>
        <div>
          <h1>There was an error</h1>
          <p>{error.message}</p>
          <hr />
          <p>
            Hey, developer, you should replace this with what you want your
            users to see.
          </p>
        </div>
      </Layout>
    </Document>
  );
}

// https://remix.run/docs/en/v1/api/conventions#catchboundary
export function CatchBoundary() {
  let caught = useCatch();

  let message;
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      );
      break;
    case 404:
      message = (
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      );
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout>
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </Layout>
    </Document>
  );
}

function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  let data = useLoaderData();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        {data && data.ENV && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
            }}
          />
        )}
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}

export let loader: LoaderFunction = async ({ params }) => {
  // loader function
  return {
    links: [
      { to: '/', label: 'Home' },
      { to: '/login', label: 'Login' },
    ],
  };
};
function Layout({ children }: { children: React.ReactNode }) {
  let data = useLoaderData();
  return (
    <div className="relative">
      <div className="mx-auto h-full" style={{ minHeight: 85 + 'vh' }}>
        <div className="relative z-10 pb-8 overflow-hidden sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32 h-full">
          <div className="dark">
            <Header
              links={data.links}
              hideHelp={true}
              logo={<Logo />}
            />
          </div>

          <main className={`mx-auto px-4 mt-8 sm:px-6  lg:px-8 h-full`}>
            {children}
          </main>
        </div>
      </div>
      <div className="dark">{/* <FooterLight links={footerLink} /> */}</div>
    </div>
  );
}
