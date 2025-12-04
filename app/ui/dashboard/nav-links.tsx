'use client';

import {
  HomeIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  DocumentDuplicateIcon,
  ChartBarIcon,
  BanknotesIcon,
  ArrowRightOnRectangleIcon, // Great icon for logout
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { signOut } from 'next-auth/react';

type NavLink = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const links: NavLink[] = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Overview', href: '/dashboard/DashboardOverview', icon: ChartBarIcon },
  { name: 'My Products', href: '/dashboard/MyProducts', icon: ShoppingBagIcon },
  { name: 'Messages', href: '/dashboard/Messages', icon: UserGroupIcon },
  { name: 'Help & Support', href: '/dashboard/Help&Support', icon: DocumentDuplicateIcon },
];

export default function NavLinks() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' }); // Redirect after sign out
  };

  return (
    <nav className="flex h-full flex-col justify-between overflow-y-auto py-4">
      <div className="flex flex-col gap-1">
        {links.map((link) => {
          const LinkIcon = link.icon;
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                'flex h-12 items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all',
                'hover:bg-sky-100 hover:text-blue-600',
                {
                  'bg-sky-100 text-blue-600': isActive,
                  'text-gray-700': !isActive,
                }
              )}
            >
              <LinkIcon className="h-5 w-5 shrink-0" />
              <span className="hidden md:block">{link.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Logout Button - placed at the bottom */}
      <div className="mt-auto border-t border-gray-200 pt-4">
        <button
          onClick={handleSignOut}
          className={clsx(
            'flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600',
            'hover:bg-red-50 transition-all'
          )}
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 shrink-0" />
          <span className="hidden md:block">Sign Out</span>
        </button>
      </div>
    </nav>
  );
}