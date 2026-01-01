/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/models/User';

export interface AuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: UserRole;
  phone?: string;
  address?: string;
  bio?: string;
  isActive?: boolean;
  lastLogin?: Date;
  authProvider?: string;
}

export function useAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const user: AuthUser | undefined = session?.user;

  // Role-based dashboard routing
  const getDashboardRoute = (): string => {
    if (!user?.role) return '/dashboard';

    const roleRoutes: Record<UserRole, string> = {
      ADMIN: '/dashboard/admin',
      USER: '/dashboard/user',
    };

    return roleRoutes[user.role] || '/dashboard/user';
  };

  // Navigate to user's dashboard
  const navigateToDashboard = () => {
    const route = getDashboardRoute();
    router.push(route);
  };

  // Get role display name for any role
  const getRoleDisplayNameForRole = (role: UserRole): string => {
    const roleNames: Record<UserRole, string> = {
      ADMIN: 'Administrator',
      USER: 'User',
    };

    return roleNames[role] || role;
  };

  // Get role badge color for any role
  const getRoleBadgeColorForRole = (role: UserRole): string => {
    const roleColors: Record<UserRole, string> = {
      ADMIN: 'bg-red-100 text-red-800 border-red-200',
      USER: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    return roleColors[role] || roleColors.USER;
  };

  // Get display name for current user
  const getDisplayName = (): string => {
    if (!user) return 'Guest';
    if (user.role === 'ADMIN') {
      return `Mr. ${user.name}`;
    }
    return user.name || 'User';
  };

  // Get role display name for current user
  const getRoleDisplayName = (): string => {
    if (!user?.role) return 'User';
    return getRoleDisplayNameForRole(user.role);
  };

  // Get role badge color for current user
  const getRoleBadgeColor = (): string => {
    if (!user?.role) return 'bg-gray-100 text-gray-800 border-gray-200';
    return getRoleBadgeColorForRole(user.role);
  };

  // Check if user is using OAuth
  const isOAuthUser = (): boolean => {
    return user?.authProvider !== 'credentials' && !!user?.authProvider;
  };

  // Get auth provider display name
  const getAuthProviderName = (): string => {
    if (!user?.authProvider) return 'Unknown';
    
    const providerNames: Record<string, string> = {
      credentials: 'Email/Password',
      google: 'Google',
      github: 'GitHub',
    };

    return providerNames[user.authProvider] || user.authProvider;
  };

  return {
    // Session data
    user,
    session,
    update,

    // Authentication status
    isAuthenticated: !!session,
    isLoading: status === 'loading',
    isError: status === 'unauthenticated',

    // Auth methods
    signIn: (provider?: string, options?: any) =>
      signIn(provider, { callbackUrl: '/dashboard', ...options }),
    signOut: () => signOut({ callbackUrl: '/' }),
    
    // Role checks
    isAdmin: user?.role === 'ADMIN',
    isUser: user?.role === 'USER',

    // Check if user has specific role(s)
    hasRole: (role: UserRole | UserRole[]): boolean => {
      if (!user?.role) return false;

      if (Array.isArray(role)) {
        return role.includes(user.role);
      }

      return user.role === role;
    },

    // Check if user can access resources requiring certain role(s)
    canAccess: (requiredRole: UserRole | UserRole[]): boolean => {
      if (!user?.role) return false;

      // Role hierarchy: ADMIN > USER
      const roleHierarchy: Record<UserRole, number> = {
        ADMIN: 100,
        USER: 30,
      };

      const userRoleLevel = roleHierarchy[user.role] || 0;

      if (Array.isArray(requiredRole)) {
        return requiredRole.some(role => userRoleLevel >= roleHierarchy[role]);
      }

      return userRoleLevel >= roleHierarchy[requiredRole];
    },

    // Feature flags
    features: {
      canManageUsers: user?.role === 'ADMIN',
      canViewAllData: user?.role === 'ADMIN',
      canEditSettings: user?.role === 'ADMIN',
    },

    // Display helpers
    getDisplayName,
    getRoleDisplayName,
    getRoleBadgeColor,
    getDashboardRoute,
    navigateToDashboard,
    getRoleDisplayNameForRole,
    getRoleBadgeColorForRole,
    isOAuthUser,
    getAuthProviderName,

    // User properties (quick access)
    userId: user?.id,
    userName: user?.name,
    userEmail: user?.email,
    userRole: user?.role,
    userImage: user?.image,
    userPhone: user?.phone,
    userAddress: user?.address,
    userBio: user?.bio,
    userIsActive: user?.isActive,
    userLastLogin: user?.lastLogin,
    userAuthProvider: user?.authProvider,
  };
}

export type { UserRole };

