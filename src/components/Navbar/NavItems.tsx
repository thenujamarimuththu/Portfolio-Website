'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  FiHome,
  FiActivity,
  FiCalendar,
  FiShoppingCart,
  FiUsers,
  FiClipboard,
  FiDroplet,
  FiPackage,
  FiFileText,
} from 'react-icons/fi';

interface NavItemsProps {
  mobile?: boolean;
  onItemClick?: () => void;
}

export default function NavItems({
  mobile = false,
  onItemClick,
}: NavItemsProps) {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();

  const getDashboardLink = () => {
    if (!user?.role) return '/dashboard';

    const roleMap: { [key: string]: string } = {
      ADMIN: '/dashboard/admin',
    };

    return roleMap[user.role] || '/dashboard';
  };

  const getRoleBasedNavigation = () => {
    const baseNavigation = [{ name: 'Home', href: '/', icon: FiHome }];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const roleSpecificItems: { [key: string]: any[] } = {
      
      ADMIN: [
        { name: 'Users', href: '/admin/users', icon: FiUsers },
        {
          name: 'Departments',
          href: '/dashboard/admin/departments',
          icon: FiActivity,
        },
        {
          name: 'Reports',
          href: '/records',
          icon: FiFileText,
        },
      ],
    };

    const defaultItems = [
      { name: 'Shop', href: '/shop/pharmacy', icon: FiShoppingCart },
    ];

    const middleItems =
      isAuthenticated && user?.role
        ? roleSpecificItems[user.role] || defaultItems
        : defaultItems;

    const dashboardItem = isAuthenticated
      ? [{ name: 'Dashboard', href: getDashboardLink(), icon: FiActivity }]
      : [];

    return [...baseNavigation, ...middleItems, ...dashboardItem];
  };

  const navigation = getRoleBasedNavigation();

  const itemVariants: Variants = {
    hover: {
      scale: 1.05,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const mobileItemVariants: Variants = {
    hover: {
      x: 5,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const currentVariants = mobile ? mobileItemVariants : itemVariants;

  return (
    <>
      {navigation.map(item => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <motion.div
            key={item.name}
            variants={currentVariants}
            whileHover='hover'
          >
            <Link
              href={item.href}
              onClick={onItemClick}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg
                transition-all duration-200
                ${
                  isActive
                    ? 'bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }
                ${mobile ? 'w-full' : ''}
              `}
            >
              <Icon className='h-5 w-5' />
              <span className='font-medium'>{item.name}</span>
            </Link>
          </motion.div>
        );
      })}
    </>
  );
}
