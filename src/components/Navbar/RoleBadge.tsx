'use client';

import { motion } from 'framer-motion';

interface RoleBadgeProps {
  role: string;
}

export default function RoleBadge({ role }: RoleBadgeProps) {
  const roleColors: { [key: string]: string } = {
    ADMIN: 'bg-gradient-to-r from-red-500 to-pink-600 text-white',
    USER: 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white',
    
  };

  const roleNames: { [key: string]: string } = {
    ADMIN: 'Admin',
    USER: 'User',
  };

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        roleColors[role] ||
        'bg-linear-to-r from-gray-500 to-slate-600 text-white'
      }`}
    >
      {roleNames[role] || role}
    </motion.span>
  );
}
