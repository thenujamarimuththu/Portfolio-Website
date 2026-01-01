/* eslint-disable @typescript-eslint/no-explicit-any */
// app/auth/signout/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiLogOut,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
} from 'react-icons/fi';

export default function SignOutPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Auto sign out after component mounts
    const timer = setTimeout(() => {
      // eslint-disable-next-line react-hooks/immutability
      handleSignOut();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (status === 'success' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (status === 'success' && countdown === 0) {
      router.push('/');
    }
  }, [status, countdown, router]);

  const handleSignOut = async () => {
    setStatus('loading');
    try {
      await signOut({ redirect: false });
      setStatus('success');
    } catch (error) {
      console.error('Sign out error:', error);
      setStatus('error');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.div
            key="idle"
            variants={containerVariants as any}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-md w-full"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
              <motion.div
                variants={iconVariants as any}
                className="mx-auto h-16 w-16 bg-linear-to-br from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <FiLogOut className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Preparing to sign out
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Please wait a moment...
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {status === 'loading' && (
          <motion.div
            key="loading"
            variants={containerVariants as any}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-md w-full"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="mx-auto h-16 w-16 bg-linear-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <FiLoader className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Signing you out
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Cleaning up your session...
                </p>
              </div>
              <div className="flex justify-center space-x-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: 0,
                  }}
                  className="h-2 w-2 bg-blue-600 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: 0.2,
                  }}
                  className="h-2 w-2 bg-purple-600 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: 0.4,
                  }}
                  className="h-2 w-2 bg-pink-600 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div
            key="success"
            variants={containerVariants as any}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-md w-full"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
              <motion.div
                variants={iconVariants as any}
                className="mx-auto h-16 w-16 bg-linear-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <FiCheckCircle className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Successfully signed out
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  You have been logged out of your account
                </p>
              </div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center justify-center"
              >
                <div className="relative">
                  <svg className="w-20 h-20">
                    <circle
                      className="text-gray-200"
                      strokeWidth="4"
                      stroke="currentColor"
                      fill="transparent"
                      r="36"
                      cx="40"
                      cy="40"
                    />
                    <motion.circle
                      className="text-green-600"
                      strokeWidth="4"
                      strokeDasharray={226}
                      strokeDashoffset={226 - (226 * (3 - countdown)) / 3}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="36"
                      cx="40"
                      cy="40"
                      initial={{ strokeDashoffset: 226 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: 3, ease: 'linear' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">
                      {countdown}
                    </span>
                  </div>
                </div>
              </motion.div>

              <p className="text-sm text-gray-500">
                Redirecting to home page...
              </p>

              <div className="pt-4 space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/')}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                  Go to Home Now
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/auth/signin')}
                  className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                  Sign In Again
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            key="error"
            variants={containerVariants as any}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-md w-full"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
              <motion.div
                variants={iconVariants as any}
                className="mx-auto h-16 w-16 bg-linear-to-br from-red-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <FiAlertCircle className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Sign out failed
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Something went wrong. Please try again.
                </p>
              </div>

              <div className="pt-4 space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSignOut}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                  Try Again
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/dashboard')}
                  className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                  Back to Dashboard
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}