/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, SignUpFormData } from '@/lib/schemas';
import { signIn } from 'next-auth/react';
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiUser,
  FiUserPlus,
  FiCheckCircle,
} from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

export default function SignUpClient() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const password = watch('password');

  const passwordStrength = {
    hasUpperCase: /[A-Z]/.test(password || ''),
    hasLowerCase: /[a-z]/.test(password || ''),
    hasNumber: /[0-9]/.test(password || ''),
    hasSpecial: /[^A-Za-z0-9]/.test(password || ''),
    hasMinLength: (password || '').length >= 6,
  };

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create account');
      }

      const signInResult = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        router.push('/auth/signin?registered=true');
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignUp = async (provider: 'google' | 'github') => {
    setOauthLoading(provider);
    setError('');

    try {
      await signIn(provider, { callbackUrl: '/dashboard' });
    } catch {
      setError(`Failed to sign up with ${provider}`);
      setOauthLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 via-white to-blue-50 px-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-linear-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
            <FiUserPlus className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold">Create your account</h2>
          <p className="mt-2 text-sm">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-2">
            <FiAlertCircle className="text-red-600" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <input {...register('name')} placeholder="Full Name" className="w-full py-3 px-4 border rounded-lg" />
            <input {...register('email')} placeholder="Email" className="w-full py-3 px-4 border rounded-lg" />
            <input {...register('password')} type="password" placeholder="Password" className="w-full py-3 px-4 border rounded-lg" />
            <input {...register('confirmPassword')} type="password" placeholder="Confirm Password" className="w-full py-3 px-4 border rounded-lg" />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button onClick={() => handleOAuthSignUp('google')} className="border rounded-lg py-2 flex justify-center gap-2">
              <FcGoogle /> Google
            </button>
            <button onClick={() => handleOAuthSignUp('github')} className="border rounded-lg py-2 flex justify-center gap-2">
              <FaGithub /> GitHub
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
