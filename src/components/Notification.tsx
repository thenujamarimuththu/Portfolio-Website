'use client';

import { motion } from 'framer-motion';
import { FiBell } from 'react-icons/fi';

export default function NotificationBell() {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className='relative p-2 text-gray-600 hover:text-blue-600 transition-colors'
    >
      <FiBell className='h-6 w-6' />
      <span className='absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border border-white'></span>
    </motion.button>
  );
}
