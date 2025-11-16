# Dashboard - Next.js Frontend

A modern dashboard application for managing leads, built with Next.js 15, React 19, TypeScript, and Tailwind CSS. This application provides a complete lead management system with authentication, filtering, and CRUD operations, integrated with a Strapi backend API.

## Features

- **Lead Management**: View, create, and update leads in a table format
- **Status Filtering**: Filter leads by status (Active/Inactive)
- **User Authentication**: Login and registration with JWT-based authentication
- **Server-Side Rendering**: Leverages Next.js App Router for optimal performance
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Type Safety**: Full TypeScript support throughout the application

## Tech Stack

- **Framework**: Next.js 15.5.0 (App Router)
- **UI Library**: React 19.1.1
- **Language**: TypeScript 5.6.2
- **Styling**: Tailwind CSS 4.1.17
- **Backend API**: Strapi CMS
- **Package Manager**: Yarn (or npm)

## Getting Started

### Prerequisites

- Node.js 20+ installed
- Yarn or npm package manager
- Strapi backend running (default: http://localhost:1337)

### Installation

1. **Install dependencies:**

```bash
yarn install
# or
npm install
```

2. **Set up environment variables:**

   - Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

   - Update the values in `.env.local` with your Strapi API URL if different from the default

3. **Run the development server:**

```bash
yarn dev
# or
npm run dev
```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

The application requires the following environment variables:

- `NEXT_PUBLIC_API_URL` - The base URL of your Strapi backend API (default: `http://localhost:1337`)

See `.env.example` for a template of all required environment variables.

## Authentication

The application implements JWT-based authentication with the following features:

- **Login**: Users can log in with their email/username and password
- **Registration**: New users can create an account
- **Session Management**: JWT tokens are stored in httpOnly cookies for security
- **Protected Routes**: Server-side authentication checks protect sensitive operations
- **OAuth Support**: Google OAuth authentication via callback route

### Authentication Flow

1. User submits credentials via login/register forms
2. Server actions authenticate with Strapi backend
3. JWT token is stored in httpOnly cookie (`sid`)
4. Subsequent requests include the JWT for authorization
5. Server actions validate JWT before performing operations

## Project Structure

```
launchpad/next/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   └── auth/          # Authentication callbacks
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── page.tsx           # Main dashboard page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── dashboard/        # Dashboard components
│   ├── leads/            # Lead-related components
│   │   ├── LeadCard.tsx
│   │   ├── LeadModal.tsx
│   │   ├── LeadsTable.tsx
│   │   └── StatusFilter.tsx
│   ├── navbar/           # Navigation components
│   └── ui/               # Reusable UI components
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
├── lib/                  # Utility libraries
│   ├── config.ts         # Configuration (API URLs)
│   └── server/           # Server-side functions
│       ├── auth.ts       # Authentication server actions
│       └── leads.ts      # Leads server actions
├── types/                # TypeScript type definitions
│   ├── lead.ts          # Lead entity types
│   └── user.ts          # User entity types
└── public/              # Static assets
```

## API Integration

The application connects to the Strapi backend API for all data operations:

### Leads API

- `GET /api/leads` - Fetch all leads (supports status filtering via query params)
- `POST /api/leads` - Create a new lead
- `PUT /api/leads/:id` - Update an existing lead (requires authentication)

### Authentication API

- `POST /api/auth/local` - Login with email/username and password
- `POST /api/auth/local/register` - Register a new user
- `GET /api/users/me` - Get current authenticated user (requires JWT)

### Server Actions

The application uses Next.js Server Actions for secure server-side operations:

- `loginAction()` - Authenticate user and set JWT cookie
- `registerAction()` - Register new user and set JWT cookie
- `logoutAction()` - Clear authentication cookie
- `getMeAction()` - Fetch current user from Strapi
- `getLeadsServer()` - Fetch leads with optional status filter
- `createLeadAction()` - Create a new lead
- `updateLeadAction()` - Update an existing lead

## Development

### Available Scripts

- `yarn dev` - Start development server on http://localhost:3000
- `yarn build` - Build the application for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint to check code quality

### Development Workflow

1. Make changes to components, pages, or server actions
2. The development server will hot-reload automatically
3. Check the browser console and terminal for any errors
4. Test authentication flows and lead management operations
5. Ensure Strapi backend is running and accessible

### Code Organization

- **Server Actions**: All API calls to Strapi are handled via Server Actions in `lib/server/`
- **Components**: UI components are organized by feature in `components/`
- **Types**: TypeScript types are centralized in `types/` for consistency
- **Configuration**: Environment-specific config is in `lib/config.ts`

## Production Deployment

Before deploying to production:

1. Set `NODE_ENV=production` in your environment
2. Update `NEXT_PUBLIC_API_URL` to your production Strapi URL
3. Ensure secure cookie settings are enabled (handled automatically in production)
4. Build the application: `yarn build`
5. Start the production server: `yarn start`

## Security Considerations

- JWT tokens are stored in httpOnly cookies to prevent XSS attacks
- Secure cookies are enabled in production (`secure: true`)
- Server-side validation ensures only authenticated users can update leads
- All API requests are made server-side to protect API endpoints

## License

This project is part of a larger application stack. See the root repository for license information.
