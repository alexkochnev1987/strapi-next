# Dashboard API - Strapi Backend

A simplified Strapi backend API for managing leads in a dashboard application.

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 6.0.0 or yarn

### Installation

Install dependencies:

```bash
yarn install
# or
npm install
```

### Development

Start Strapi in development mode with auto-reload:

```bash
yarn develop
# or
npm run develop
```

The admin panel will be available at `http://localhost:1337/admin`

### Production

Build and start the production server:

```bash
yarn build
yarn start
# or
npm run build
npm start
```

## API Endpoints

The API provides REST endpoints for managing leads:

- `GET /api/leads` - Get all leads (supports filtering by status)
- `GET /api/leads/:id` - Get a specific lead
- `POST /api/leads` - Create a new lead
- `PUT /api/leads/:id` - Update a lead
- `DELETE /api/leads/:id` - Delete a lead

### Example Requests

**Get all active leads:**

```
GET /api/leads?filters[status][$eq]=Active
```

**Create a new lead:**

```
POST /api/leads
Content-Type: application/json

{
  "data": {
    "name": "John Doe",
    "company": "Acme Corp",
    "email": "john@acme.com",
    "status": "Active"
  }
}
```

**Update a lead:**

```
PUT /api/leads/1
Content-Type: application/json

{
  "data": {
    "status": "Inactive"
  }
}
```

## Lead Schema

- `name` (string, required) - Lead's name
- `company` (string, required) - Company name
- `email` (email, required, unique) - Email address
- `status` (enum, required) - Status: "Active" or "Inactive" (default: "Active")

## Authentication

Authentication is handled through the `users-permissions` plugin. Create users through the admin panel at `/admin`.

## Database

By default, the project uses SQLite for development. The database file is stored at `.tmp/data.db`.

To use PostgreSQL or MySQL in production, update the `DATABASE_CLIENT` environment variable in your `.env` file.

## Learn More

- [Strapi Documentation](https://docs.strapi.io)
- [Strapi API Documentation](https://docs.strapi.io/dev-docs/api/rest)
