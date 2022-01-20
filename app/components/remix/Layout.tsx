
import FMLogo from '../svg/logos/FltngMmth';

export default function Layout({ children, theme }: { children: React.ReactNode , theme: 'dark' | 'light' }) {
  return (
    <div className={theme}>
      <div className="relative bg-zinc-300 dark:bg-zinc-900 z-10 px-8 overflow-hidden sm:px-16 md:px-20 lg:w-full lg:px-28 xl:px-32 h-screen">
        {children}
        <FMLogo height="30" width="auto" color={'white'} textcolor={'pink'} />
      </div>
    </div>
  );
}
