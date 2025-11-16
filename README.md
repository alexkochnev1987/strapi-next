# Lead Management Dashboard - Project Documentation

## Overview

A full-stack lead management application built with Next.js 15 and Strapi 5, featuring authentication, CRUD operations, and responsive design. The application is deployed at https://strapi-next-gray.vercel.app/

## Architecture Decisions

### Technology Stack

- **Frontend**: Next.js 15.5.0 with App Router, React 19, TypeScript
- **Backend**: Strapi 5.30.0 CMS with SQLite (development) / PostgreSQL (production)
- **Styling**: Tailwind CSS 4.1.17
- **Authentication**: JWT-based with httpOnly cookies, Google OAuth support

### Key Architectural Decisions

1. **Server Actions over API Routes**

   - Used Next.js Server Actions for all data mutations (create, update)
   - Benefits: Type safety, automatic request/response handling, better security
   - Location: `next/lib/server/auth.ts` and `next/lib/server/leads.ts`

2. **HttpOnly Cookies for JWT Storage**

   - JWT tokens stored in httpOnly cookies (`sid`) instead of localStorage
   - Benefits: Prevents XSS attacks, automatic cookie handling, secure by default
   - Implementation: `next/lib/server/auth.ts` (loginAction, registerAction)

3. **Server-Side Rendering (SSR)**

   - Dashboard page uses SSR to fetch leads on the server
   - Benefits: Better SEO, faster initial load, reduced client-side API calls
   - Implementation: `next/app/page.tsx` with `getLeadsServer()`

4. **Responsive Design Strategy**

   - Mobile-first approach with Tailwind CSS breakpoints
   - Cards layout for mobile (< 640px), table layout for desktop (>= 640px)
   - Implementation: `next/components/leads/LeadsTable.tsx`

5. **Authentication Context Pattern**

   - Centralized auth state management using React Context
   - Benefits: Single source of truth, easy to access across components
   - Implementation: `next/contexts/AuthContext.tsx`

6. **Type Safety Throughout**

   - Full TypeScript implementation with strict types
   - Separate type definitions for leads and users
   - Benefits: Catch errors at compile time, better IDE support
   - Location: `next/types/lead.ts` and `next/types/user.ts`

## Features

### Authentication

- **Email/Password Login**: Traditional authentication via Strapi's local provider
- **Google OAuth**: Social login via Google (redirects to Strapi, then callback to Next.js)
- **Registration**: New user signup with email validation
- **Session Management**: 30-day JWT expiration, automatic token refresh
- **Protected Routes**: Server-side authentication checks for lead updates

### Lead Management

- **View Leads**: Display all leads in responsive table/card format
- **Filter by Status**: Filter leads by Active/Inactive status
- **Create Leads**: Add new leads (no authentication required)
- **Update Leads**: Edit existing leads (authentication required)
- **Status Indicators**: Visual status badges (green for Active, gray for Inactive)

### User Interface

- **Responsive Design**:
  - Mobile: Card-based layout with vertical stacking
  - Desktop: Table layout with sortable columns
- **Authentication Status**: User info displayed in navbar header
- **Loading States**: Spinner indicators during async operations
- **Error Handling**: User-friendly error messages

## How to Run Locally

### Prerequisites

- Node.js 20+ installed
- npm or yarn package manager
- Git (for cloning the repository)

### Backend Setup (Strapi)

1. **Navigate to Strapi directory:**

```bash
cd strapi
```

2. **Install dependencies:**

```bash
npm install
# or
yarn install
```

3. **Start Strapi development server:**

```bash
npm run develop
# or
yarn develop
```

4. **Access Strapi Admin Panel:**

   - Open http://localhost:1337/admin
   - Create an admin account on first run
   - Configure Google OAuth (optional, for production)

5. **Set up Lead Content Type:**

   - The Lead content type should already be configured
   - Verify in Content-Type Builder: `/admin/plugins/content-type-builder`

### Frontend Setup (Next.js)

1. **Navigate to Next.js directory:**

```bash
cd next
```

2. **Install dependencies:**

```bash
npm install
# or
yarn install
```

3. **Configure environment variables:**

   - Create `.env.local` file in the `next` directory:

```bash
NEXT_PUBLIC_API_URL=http://localhost:1337
```

4. **Start Next.js development server:**

```bash
npm run dev
# or
yarn dev
```

5. **Access the application:**

   - Open http://localhost:3000

### Test User Credentials

For testing purposes, you can use the following pre-configured user:

- **Email**: `alexkochnev19@gmail.com`
- **Password**: `Qwerty`

Alternatively, you can:

- Register a new account via `/register`
- Use Google OAuth login (if configured)

## Project Structure

```
launchpad/
├── next/                 # Next.js frontend application
│   ├── app/             # App Router pages and routes
│   ├── components/      # React components
│   ├── contexts/        # React contexts (AuthContext)
│   ├── lib/             # Utilities and server actions
│   └── types/           # TypeScript type definitions
└── strapi/              # Strapi backend API
    ├── src/api/lead/    # Lead content type and API
    └── config/          # Strapi configuration files
```

## API Endpoints

### Authentication

- `POST /api/auth/local` - Email/password login
- `POST /api/auth/local/register` - User registration
- `GET /api/users/me` - Get current authenticated user
- `GET /api/connect/google` - Initiate Google OAuth

### Leads

- `GET /api/leads` - Get all leads (supports `?filters[user_status][$eq]=Active` query param)
- `POST /api/leads` - Create a new lead
- `PUT /api/leads/:id` - Update a lead (requires authentication)

## Deployment

### Frontend (Vercel)

The application is currently deployed on Vercel:

- **URL**: https://strapi-next-gray.vercel.app/
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Environment Variables**: Set `NEXT_PUBLIC_API_URL` to production Strapi URL

### Backend (Strapi)

For production deployment:

1. Set `NODE_ENV=production`
2. Configure production database (PostgreSQL recommended)
3. Set up environment variables in `.env`:

   - `DATABASE_CLIENT=postgres`
   - `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`

4. Build: `npm run build`
5. Start: `npm start`

## Security Considerations

1. **JWT Storage**: HttpOnly cookies prevent XSS attacks
2. **Secure Cookies**: Enabled in production (`secure: true`)
3. **Server-Side Validation**: All mutations validated on server
4. **Authentication Required**: Lead updates require valid JWT
5. **CORS Configuration**: Properly configured in Strapi for production

## What Would Be Done Differently with More Time

### 1. Testing

- **Unit Tests**: Add Jest/Vitest for component and utility testing
- **Integration Tests**: Test API endpoints and authentication flows
- **E2E Tests**: Playwright/Cypress tests for critical user journeys

### 2. Error Handling

- **Error Boundaries**: React error boundaries for better error recovery
- **Toast Notifications**: User-friendly toast messages for success/error states
- **Retry Logic**: Automatic retry for failed network requests

### 3. Performance Optimization

- **Pagination**: Implement pagination for large lead lists
- **Optimistic Updates**: Update UI immediately, sync with server in background
- **Caching Strategy**: Implement React Query or SWR for better data caching
- **Image Optimization**: If adding lead avatars, use Next.js Image component

### 4. Features

- **Lead Deletion**: Add delete functionality with confirmation dialog
- **Bulk Operations**: Select multiple leads for bulk status updates
- **Search Functionality**: Search leads by name, company, or email
- **Export Functionality**: Export leads to CSV/Excel
- **Lead Details Page**: Dedicated page for viewing/editing individual leads
- **Activity Log**: Track changes to leads with timestamps

### 5. UI/UX Improvements

- **Skeleton Loaders**: Replace spinners with skeleton loaders for better perceived performance
- **Animations**: Add smooth transitions and micro-interactions
- **Dark Mode**: Implement dark mode toggle
- **Accessibility**: Enhanced ARIA labels, keyboard navigation, screen reader support
- **Form Validation**: Real-time validation with helpful error messages

### 6. Code Quality

- **ESLint Configuration**: Stricter linting rules
- **Prettier**: Code formatting consistency
- **Pre-commit Hooks**: Husky for running tests/linters before commits
- **Documentation**: JSDoc comments for all public functions

### 7. Infrastructure

- **Database Migrations**: Proper migration system for schema changes
- **Environment Management**: Better separation of dev/staging/prod configs
- **Monitoring**: Error tracking (Sentry), analytics (Plausible/Posthog)
- **CI/CD Pipeline**: Automated testing and deployment

### 8. Authentication Enhancements

- **Email Verification**: Verify email addresses on registration
- **Password Reset**: Forgot password functionality
- **Two-Factor Authentication**: Optional 2FA for enhanced security
- **Session Management**: View and manage active sessions

## Development Workflow

1. **Local Development**: Both servers run on localhost (Next.js: 3000, Strapi: 1337)
2. **Hot Reload**: Both servers support hot reload during development
3. **Type Checking**: Run `npm run build` to check for TypeScript errors
4. **Linting**: Run `npm run lint` in the Next.js directory

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure Strapi CORS is configured to allow requests from `http://localhost:3000`
2. **Authentication Fails**: Check that JWT cookie is being set (check browser DevTools > Application > Cookies)
3. **Leads Not Loading**: Verify Strapi is running and accessible at the configured URL
4. **Google OAuth Not Working**: Ensure Google OAuth is properly configured in Strapi admin panel

## License

MIT License - See LICENSE file for details

## Contact

For questions or issues, please contact the development team.
