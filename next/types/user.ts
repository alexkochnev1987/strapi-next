/**
 * User entity from Strapi
 */
export interface User {
  id: number;
  username: string;
  email: string;
  provider?: string;
  confirmed?: boolean;
  blocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Login request payload
 */
export interface LoginInput {
  identifier: string; // email or username
  password: string;
}

/**
 * Register request payload
 */
export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

/**
 * Auth response from Strapi
 */
export interface AuthResponse {
  jwt: string;
  user: User;
}

/**
 * Error response from Strapi
 */
export interface AuthErrorResponse {
  error: {
    status: number;
    message: string;
    name: string;
  };
}

