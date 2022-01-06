import Header from '~/components/Header';
import Logo from '../Logo';


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="mx-auto h-full" style={{ minHeight: 85 + 'vh' }}>
        <div className="relative z-10 pb-8 overflow-hidden sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32 h-full">
          <div className="dark">{children}</div>
        </div>
      </div>
    </div>
  );
}
