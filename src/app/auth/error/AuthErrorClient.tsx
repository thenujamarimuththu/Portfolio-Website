'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthErrorClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    const errorParam = searchParams.get('error');

    const errorMessages: Record<string, string> = {
      Configuration:
        'There is a problem with the server configuration.',
      AccessDenied:
        'You do not have permission to sign in.',
      Verification:
        'The verification token has expired or has already been used.',
      AccountDisabled:
        'Your account has been disabled. Please contact support.',
      AuthenticationFailed:
        'Authentication failed. Please try again.',
      Default:
        'An error occurred during authentication. Please try again.',
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setError(errorMessages[errorParam ?? 'Default'] ?? errorMessages.Default);
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="mx-auto h-12 w-12 text-red-600">
          <svg
            className="h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h2 className="text-3xl font-extrabold text-gray-900">
          Authentication Error
        </h2>

        <p className="text-sm text-gray-600">{error}</p>

        <div className="space-y-3 pt-6">
          <button
            onClick={() => router.push('/auth/signin')}
            className="w-full py-2 px-4 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Back to Sign In
          </button>

          <button
            onClick={() => router.push('/')}
            className="w-full py-2 px-4 rounded-md border bg-white hover:bg-gray-50"
          >
            Go to Home
          </button>

          <a
            href="mailto:support@yourapp.com"
            className="block text-sm text-blue-600 hover:text-blue-500"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
