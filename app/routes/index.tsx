import { MetaFunction, LoaderFunction, Link } from 'remix';
import { json } from 'remix';
import Display from '~/components/DisplayHeading';

export let loader: LoaderFunction = () => {
  return {
    display: {
      title: '',
      span: '',
      description: '',
    },
  };
};

export let meta: MetaFunction = () => {
  return {
    title: 'Remix Starter',
    description: 'Welcome to remix!',
  };
};

export default function Index() {
  return (
    <div className="bg-white dark:bg-gray-800 flex relative z-20 items-center overflow-hidden">
      <div className="container mx-auto px-6 flex relative py-16">
        <div className="sm:w-2/3 lg:w-2/5 flex flex-col relative z-20">
          <Display
            title="Remix/ GunDb"
            titleColor="white"
            spanColor="pink-500"
            span="App Starter"
            description="Application boilerplate with authentication && sessionStorage, data encryption, and tailwind styling. "
          />
          <div className="flex mt-8">
            <Link to="/login"
              className="uppercase animate-bounce py-2 px-4 rounded-lg bg-pink-500 border-2 border-transparent text-white text-md mr-4 hover:bg-pink-400"
            >
              Get started
            </Link>
          </div>
        </div>
        <div className="hidden sm:block sm:w-1/3 lg:w-3/5 relative">
          <img
          alt=''
            src="/images/object/10.png"
            className="max-w-xs md:max-w-sm m-auto"
          />
        </div>
      </div>
    </div>
  );
}
