/**
 * Server-side authentication functions
 * Server Actions for authentication operations
 */
'use server';

import { cookies } from 'next/headers';

import { STRAPI_URL } from '@/lib/config';
import type {
  AuthErrorResponse,
  LoginInput,
  RegisterInput,
  User,
} from '@/types/user';

/**
 * Get current authenticated user (Server Action)
 * Uses JWT from httpOnly cookie to fetch user data from Strapi
 */
export async function getMeAction(): Promise<User | null> {
  try {
    // Get JWT from cookie
    const cookieStore = await cookies();
    const jwt = cookieStore.get('sid')?.value;

    if (!jwt) {
      return null;
    }

    // Fetch user data from Strapi using JWT
    const response = await fetch(`${STRAPI_URL}/api/users/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      // If unauthorized, return null user (not an error)
      if (response.status === 401) {
        return null;
      }

      // For other errors, log and return null
      console.error(`Failed to fetch user: ${response.statusText}`);
      return null;
    }

    const userData = await response.json();

    // Map Strapi user data to our User type
    const user: User = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      provider: userData.provider,
      confirmed: userData.confirmed,
      blocked: userData.blocked,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    };

    return user;
  } catch (error) {
    console.error('Error fetching user (server action):', error);
    return null;
  }
}

/**
 * Login user (Server Action)
 * Authenticates user with Strapi and sets JWT cookie
 */
export async function loginAction(
  input: LoginInput
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    // Call Strapi login endpoint
    const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: input.identifier,
        password: input.password,
      }),
    });

    if (!response.ok) {
      const error: AuthErrorResponse = await response.json();
      return {
        success: false,
        error: error.error?.message || 'Login failed',
      };
    }

    const data = await response.json();
    const { jwt, user: userData } = data;

    // Set HttpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'sid',
      value: jwt,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    // Map user data
    const user: User = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      provider: userData.provider,
    };

    return { success: true, user };
  } catch (error) {
    console.error('Login error (server action):', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed',
    };
  }
}

/**
 * Register new user (Server Action)
 * Registers user with Strapi and sets JWT cookie
 */
export async function registerAction(
  input: RegisterInput
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    // Call Strapi register endpoint
    const response = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: input.username,
        email: input.email,
        password: input.password,
      }),
    });

    if (!response.ok) {
      const error: AuthErrorResponse = await response.json();
      return {
        success: false,
        error: error.error?.message || 'Registration failed',
      };
    }

    const data = await response.json();
    const { jwt, user: userData } = data;

    // Set HttpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'sid',
      value: jwt,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    // Map user data
    const user: User = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      provider: userData.provider,
    };

    return { success: true, user };
  } catch (error) {
    console.error('Registration error (server action):', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Registration failed',
    };
  }
}

/**
 * Logout user (Server Action)
 * Clears JWT cookie
 */
export async function logoutAction(): Promise<{ success: boolean; error?: string }> {
  try {
    // Clear the cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'sid',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return { success: true };
  } catch (error) {
    console.error('Logout error (server action):', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Logout failed',
    };
  }
}

