'use client';
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  BanknotesIcon
  


  


} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { signOut } from "next-auth/react";
// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'DashboardOverview', href: '/dashboard/DashboardOverview', icon: HomeIcon },
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'MyProducts', href: '/dashboard/MyProducts', icon: ShoppingBagIcon },
 
  
  { name: 'Messages', href: '/dashboard/Messages', icon: UserGroupIcon },
  { name: 'Help & Support', href: '/dashboard/Help&Support', icon: UserGroupIcon },

];

const handleSignout = async () => {
  signOut()
}

export default function NavLinks() {
  const pathname = usePathname();
  return (
      <nav className="h-full overflow-y-auto">
        <div className="flex flex-col gap-1 pb-4">
          {links.map((link) => {
            const LinkIcon = link.icon;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
                  {
                    "bg-sky-100 text-blue-600": pathname === link.href,
                  }
                )}
              >
                <LinkIcon className="w-6" />
                <p className="hidden md:block">{link.name}</p>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={handleSignout}
            className="mt-2 flex h-[48px] items-center justify-center gap-2 rounded-md bg-red-50 p-3 text-sm font-medium text-red-600 hover:bg-red-100 md:justify-start md:p-2 md:px-3"
          >
            Sign Out
          </button>
        </div>
      </nav>
    );
  }