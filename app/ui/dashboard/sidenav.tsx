import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import MarketLogo from '@/app/ui/Logo';


export default function SideNav() {
  return (
    <div className="flex h-screen flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <MarketLogo />
        </div>
      </Link>

      {/* This flex column + min-h-0 lets NavLinks scroll */}
      <div className="flex grow flex-col min-h-0">
        <NavLinks />
      </div>
    </div>
  );
}
