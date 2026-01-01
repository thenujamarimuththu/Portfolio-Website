/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { connectDB } from '@/lib/mongodb';
import UserModel, { UserRole } from '@/models/User';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Type declarations for NextAuth
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
      phone?: string;
      address?: string;
      bio?: string;
      isActive: boolean;
      lastLogin?: Date;
      authProvider?: string;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: UserRole;
    phone?: string;
    address?: string;
    bio?: string;
    isActive: boolean;
    lastLogin?: Date;
    password?: string;
    authProvider?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    picture?: string | null;
    role: UserRole;
    phone?: string;
    address?: string;
    bio?: string;
    isActive: boolean;
    lastLogin?: Date;
    authProvider?: string;
  }
}

// Interface for OAuth profile
interface OAuthProfile {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

// Helper function to create user object
const createUserObject = (user: any) => ({
  id: user._id?.toString() || user.id,
  name: user.name,
  email: user.email,
  image: user.image,
  role: user.role,
  phone: user.phone,
  address: user.address,
  bio: user.bio,
  isActive: user.isActive,
  lastLogin: user.lastLogin,
  authProvider: user.authProvider,
});

// Update last login timestamp
const updateLastLogin = async (userId: string): Promise<void> => {
  try {
    await connectDB();
    await UserModel.findByIdAndUpdate(
      userId,
      { lastLogin: new Date() },
      { new: true }
    );
  } catch (error) {
    console.error('Failed to update last login:', error);
  }
};

// Handle OAuth user creation/update
const handleOAuthUser = async (user: OAuthProfile, provider: string) => {
  try {
    await connectDB();

    if (!user.email) {
      throw new Error('Email is required for OAuth authentication');
    }

    let dbUser = await UserModel.findOne({
      email: user.email.toLowerCase().trim(),
    });

    if (!dbUser) {
      // Create new user for OAuth sign-in
      dbUser = await UserModel.create({
        name: user.name || 'User',
        email: user.email.toLowerCase().trim(),
        image: user.image || undefined,
        role: 'USER',
        isActive: true,
        emailVerified: new Date(),
        lastLogin: new Date(),
        authProvider: provider,
      });
      console.log(`New ${provider} user created:`, user.email);
    } else {
      // Update existing user
      const updateData: any = {
        lastLogin: new Date(),
        image: user.image || dbUser.image,
        name: user.name || dbUser.name,
      };

      // Only set authProvider if not already set (preserve original auth method)
      if (!dbUser.authProvider) {
        updateData.authProvider = provider;
      }

      // Set emailVerified if not already verified (OAuth emails are verified)
      if (!dbUser.emailVerified) {
        updateData.emailVerified = new Date();
      }

      dbUser = await UserModel.findByIdAndUpdate(
        dbUser._id,
        updateData,
        { new: true }
      );
      console.log(`${provider} user updated:`, user.email);
    }

    return dbUser;
  } catch (error) {
    console.error(`${provider} user handling error:`, error);
    throw new Error(`Failed to process ${provider} user`);
  }
};

// Validate credentials for sign-in
// Note: Sign-in validation is intentionally less strict than sign-up
const validateCredentials = (email?: string, password?: string) => {
  if (!email || !password) {
    return {
      isValid: false,
      error: 'Email and password are required',
    };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      error: 'Password must be at least 6 characters',
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Invalid email format',
    };
  }

  return { isValid: true };
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'user@example.com',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: '••••••••',
        },
      },
      async authorize(credentials) {
        const validation = validateCredentials(
          credentials?.email,
          credentials?.password
        );

        if (!validation.isValid) {
          throw new Error(validation.error);
        }

        try {
          await connectDB();

          const user = await UserModel.findOne({
            email: credentials!.email.toLowerCase().trim(),
          }).select('+password');

          if (!user) {
            throw new Error('Invalid email or password');
          }

          // Check if account is active
          if (!user.isActive) {
            throw new Error('Your account has been disabled. Please contact support.');
          }

          // Check if user has a password (not OAuth-only account)
          if (!user.password) {
            throw new Error(
              'This account uses social login. Please sign in with your social account.'
            );
          }

          const isPasswordValid = await bcrypt.compare(
            credentials!.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error('Invalid email or password');
          }

          await updateLastLogin(user._id.toString());

          console.log('User authenticated successfully:', user.email);
          return createUserObject(user);
        } catch (error) {
          console.error('Credentials auth error:', error);
          if (error instanceof Error) {
            throw error;
          }
          throw new Error('Authentication failed. Please try again.');
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'USER' as UserRole,
          isActive: true,
        };
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          role: 'USER' as UserRole,
          isActive: true,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.phone = user.phone;
        token.address = user.address;
        token.bio = user.bio;
        token.isActive = user.isActive;
        token.lastLogin = user.lastLogin;
        token.authProvider = user.authProvider;

        // Handle OAuth providers
        if (account?.provider !== 'credentials') {
          try {
            const oauthProfile: OAuthProfile = {
              name: user.name,
              email: user.email,
              image: user.image,
            };
            
            const dbUser = await handleOAuthUser(
              oauthProfile,
              account?.provider || 'unknown'
            );
            
            token.id = dbUser._id.toString();
            token.role = dbUser.role;
            token.phone = dbUser.phone;
            token.address = dbUser.address;
            token.bio = dbUser.bio;
            token.isActive = dbUser.isActive;
            token.lastLogin = dbUser.lastLogin;
            token.authProvider = dbUser.authProvider;
          } catch (error) {
            console.error('OAuth token update error:', error);
          }
        }
      }

      // Handle token updates (e.g., when session.update() is called)
      if (trigger === 'update') {
        try {
          await connectDB();
          const dbUser = await UserModel.findById(token.id);

          if (dbUser) {
            token.role = dbUser.role;
            token.phone = dbUser.phone;
            token.address = dbUser.address;
            token.bio = dbUser.bio;
            token.isActive = dbUser.isActive;
            token.name = dbUser.name;
            token.email = dbUser.email;
            token.picture = dbUser.image;
          }
        } catch (error) {
          console.error('Token update error:', error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user = {
          id: token.id,
          name: token.name,
          email: token.email,
          image: token.picture,
          role: token.role,
          phone: token.phone,
          address: token.address,
          bio: token.bio,
          isActive: token.isActive,
          lastLogin: token.lastLogin,
          authProvider: token.authProvider,
        };
      }

      return session;
    },

    async signIn({ user, account }) {
      try {
        // Allow credentials provider to proceed
        if (account?.provider === 'credentials') {
          return true;
        }

        // Handle OAuth providers (Google and GitHub)
        if (
          (account?.provider === 'google' || account?.provider === 'github') &&
          user.email
        ) {
          await connectDB();

          const dbUser = await UserModel.findOne({
            email: user.email.toLowerCase().trim(),
          });

          // Allow new users to sign in
          if (!dbUser) {
            return true;
          }

          // Check if existing user is active
          if (!dbUser.isActive) {
            console.warn(`Inactive user attempted sign in: ${user.email}`);
            return '/auth/error?error=AccountDisabled';
          }

          return true;
        }

        // Reject unknown providers
        console.error(`Unknown provider: ${account?.provider}`);
        return false;
      } catch (error) {
        console.error('Sign in callback error:', error);
        return '/auth/error?error=AuthenticationFailed';
      }
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    },
  },

  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/new-user',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === 'development',

  events: {
    async signIn({ user, account, isNewUser }) {
      console.log(`User signed in: ${user.email} via ${account?.provider}`);
      if (isNewUser) {
        console.log(`New user registered: ${user.email}`);
      }
    },
    async signOut({ token }) {
      console.log(`User signed out: ${token.email}`);
    },
    async createUser({ user }) {
      console.log(`User created: ${user.email}`);
    },
    async updateUser({ user }) {
      console.log(`User updated: ${user.email}`);
    },
  },
};

// Export handlers for Next.js App Router
export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);

// Sign Up Schema with strong password requirements
export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters')
      .regex(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces'),
    email: z
      .string()
      .email('Please enter a valid email address')
      .min(1, 'Email is required'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password is too long')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;

// Sign In Schema (less strict than sign-up)
export const signInSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export type SignInFormData = z.infer<typeof signInSchema>;