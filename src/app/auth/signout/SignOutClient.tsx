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

export default function SignOutClient() {
  const router = useRouter();
  const [status, setStatus] =
    useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setTimeout(() => {
      // eslint-disable-next-line react-hooks/immutability
      handleSignOut();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (status === 'success' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((c) => c - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }

    if (status === 'success' && countdown === 0) {
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
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { scale: 1, rotate: 0 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 via-white to-blue-50 px-4">
      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.div
            key="idle"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-md w-full"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
              <motion.div
                variants={iconVariants}
                className="mx-auto h-16 w-16 bg-gray-700 rounded-2xl flex items-center justify-center"
              >
                <FiLogOut className="h-8 w-8 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold">Preparing to sign out</h2>
            </div>
          </motion.div>
        )}

        {status === 'loading' && (
          <motion.div
            key="loading"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-md w-full"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="mx-auto h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center"
              >
                <FiLoader className="h-8 w-8 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold">Signing you out</h2>
            </div>
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div
            key="success"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-md w-full"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
              <motion.div
                variants={iconVariants}
                className="mx-auto h-16 w-16 bg-green-600 rounded-2xl flex items-center justify-center"
              >
                <FiCheckCircle className="h-8 w-8 text-white" />
              </motion.div>

              <h2 className="text-2xl font-bold">Signed out</h2>

              <p className="text-gray-600">
                Redirecting in <strong>{countdown}</strong>…
              </p>

              <button
                onClick={() => router.push('/')}
                className="w-full py-3 bg-blue-600 text-white rounded-lg"
              >
                Go Home Now
              </button>
            </div>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            key="error"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-md w-full"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
              <motion.div
                variants={iconVariants}
                className="mx-auto h-16 w-16 bg-red-600 rounded-2xl flex items-center justify-center"
              >
                <FiAlertCircle className="h-8 w-8 text-white" />
              </motion.div>

              <h2 className="text-2xl font-bold">Sign out failed</h2>

              <button
                onClick={handleSignOut}
                className="w-full py-3 bg-blue-600 text-white rounded-lg"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
