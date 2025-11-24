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

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'DashboardOverview', href: '/dashboard/DashboardOverview', icon: HomeIcon },
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'MyProducts', href: '/dashboard/MyProducts', icon: ShoppingBagIcon },
  {
    name: 'MyProductsList',
    href: '/dashboard/MyProductsList',
    icon: DocumentDuplicateIcon,
  },
  { name: 'SellerDashboard', href: '/dashboard/SellerDashboard', icon: UserGroupIcon },
  { name: 'SellerOrderStatusChart', href: '/dashboard/SellerOrderStatusChart', icon: ChartBarIcon },
  { name: 'SellerSalesChart', href: '/dashboard/SellerSalesChart', icon: BanknotesIcon },
  { name: 'SellerTopProducts', href: '/dashboard/SellerTopProducts', icon: UserGroupIcon },
  { name: 'Orders', href: '/dashboard/Orders', icon: UserGroupIcon },
  { name: 'LiveOrders', href: '/dashboard/LiveOrders', icon: UserGroupIcon },
  { name: 'Reviews & Ratings', href: '/dashboard/Reviews&Ratings', icon: UserGroupIcon },
  { name: 'Earnings', href: '/dashboard/Earnings', icon: UserGroupIcon },
  { name: 'Messages', href: '/dashboard/Messages', icon: UserGroupIcon },
  { name: 'Craft Stories', href: '/dashboard/CraftStories', icon: UserGroupIcon },
  { name: 'Shop Analytics', href: '/dashboard/ShopAnalytics', icon: UserGroupIcon },
  { name: 'Profile Settings', href: '/dashboard/ProfileSettings', icon: UserGroupIcon },
  { name: 'Account Settings', href: '/dashboard/AccountSettings', icon: UserGroupIcon },
  { name: 'Help & Support', href: '/dashboard/Help&Support', icon: UserGroupIcon },
  { name: 'Logout', href: '/dashboard/Logout', icon: UserGroupIcon },
  

];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
             className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
