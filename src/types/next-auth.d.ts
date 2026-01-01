import { DefaultSession, DefaultUser } from 'next-auth';
import { UserRole } from '@/models/User';

declare module 'next-auth' {
  /**
   * Extended session interface with custom user properties
   */
  interface Session {
    user: {
      id: string;
      role: UserRole;
      phone?: string;
      address?: string;
      bio?: string;
      isActive: boolean;
      lastLogin?: Date;
      authProvider?: string;
    } & DefaultSession['user'];
  }

  /**
   * Extended user interface with custom properties
   */
  interface User extends DefaultUser {
    id: string;
    role: UserRole;
    phone?: string;
    address?: string;
    bio?: string;
    isActive: boolean;
    lastLogin?: Date;
    authProvider?: string;
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extended JWT interface with custom properties
   */
  interface JWT {
    id: string;
    role: UserRole;
    phone?: string;
    address?: string;
    bio?: string;
    isActive: boolean;
    lastLogin?: Date;
    authProvider?: string;
  }
}