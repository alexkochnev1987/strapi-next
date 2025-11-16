# Dashboard - Next.js Frontend

A simple dashboard application for managing leads, built with Next.js and TypeScript.

## Features

- View leads in a table format (Name, Company, Email, Status)
- Filter leads by status (Active/Inactive)
- Add new leads via modal
- Update existing leads
- Integration with Strapi API

## Getting Started

1. Install dependencies:
```bash
yarn install
# or
npm install
```

2. Create `.env.local` file with:
```
NEXT_PUBLIC_API_URL=http://localhost:1337
```

3. Run the development server:
```bash
yarn dev
# or
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `app/page.tsx` - Main dashboard page
- `components/leads/` - Lead-related components (Table, Modal, Filter)
- `lib/api/leads.ts` - API functions for Strapi integration
- `types/lead.ts` - TypeScript types for Lead entities

## API Integration

The application connects to Strapi backend API:
- `GET /api/leads` - Fetch all leads
- `POST /api/leads` - Create a new lead
- `PUT /api/leads/:id` - Update a lead
