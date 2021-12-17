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
import GunContextProvider from './lib/gun/useGunContext.js'
import { createContext, useEffect, useRef } from 'react';
import { gun } from './lib/constants/Data';
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
  const gunRef = useRef();
  const userRef = useRef();
  const certificateRef = useRef();
  const accessTokenRef = useRef();
  const onAuthCbRef = useRef();

  useEffect(() => {
    // @ts-ignore
    Gun.on('opt', (ctx) => {
      if (ctx.once) return;

      ctx.on('out',  (msg:any) => {
    // @ts-ignore
        const to = this.to;
        // Adds headers for put
        msg.headers = {
          accessToken: accessTokenRef.current,
        };
        to.next(msg); // pass to next middleware

        if (msg.err === 'Invalid access token') {
          // not implemented: handle invalid access token
          // you might want to do a silent refresh, or
          // redirect the user to a log in page
        }
      });
    });

    // create user
    const user = gun
      .user()
      // save user creds in session storage
      // this appears to be the only type of storage supported.
      // use broadcast channels to sync between tabs
      .recall({ sessionStorage: true });

    // @ts-ignore
    gun.on('auth', (...args:any) => {
      if (!accessTokenRef.current) {
        // get new token 
        //TODO: MAKE THIS AN ACTION 
        user.get('alias').once((username) => {
          fetch('http://0.0.0.0:5150/api/tokens', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username,
    // @ts-ignore
              pub: user.pub,
            }),
          })
            .then((resp) => resp.json())
            .then(({ accessToken }) => {
              // store token in app memory
              accessTokenRef.current = accessToken;
            });
        });
      }

      if (!certificateRef.current) {
        // get new certificate
        //TODO: MAKE THIS AN ACTION 
        user.get('alias').once((username) => {
          fetch('http://0.0.0.0:5150/api/certificates', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username,
    // @ts-ignore
              pub: user.is.pub,
            }),
          })
            .then((resp) => resp.json())
            .then(({ certificate }) => {
              // store certificate in app memory
              // TODO check if expiry isn't working or misconfigured
              // TODO handle expired certificates
              certificateRef.current = certificate;
            });
        });
      }

      if (onAuthCbRef.current) {
    // @ts-ignore
        onAuthCbRef.current(...args);
      }
    });

    // @ts-ignore
    gunRef.current = gun;
    // @ts-ignore
    userRef.current = user;
  }, []);
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
    navlinks: [{ to: '/', label: 'Home' }],
  };
};
function Layout({ children }: { children: React.ReactNode }) {
  let data = useLoaderData();
  return (
    <div className="remix-app">
      <Header links={data.navlinks} logo={<Logo />} />
      <div className="remix-app__main">
        <div className="container remix-app__main-content">{children}</div>
      </div>
      <footer className="remix-app__footer">
        <div className="container remix-app__footer-content">
          <p>&copy; You!</p>
        </div>
      </footer>
    </div>
  );
}
