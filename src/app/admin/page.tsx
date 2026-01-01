'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { isAuthenticated, isLoading, user, canAccess } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Protected Page</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p>Welcome, {user?.name}!</p>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role}</p>
        
        {canAccess('ADMIN') && (
          <div className="mt-4 p-4 bg-blue-50 rounded">
            <p className="font-semibold">Admin Only Content</p>
            <p>You have admin access!</p>
          </div>
        )}
      </div>
    </div>
  );
}