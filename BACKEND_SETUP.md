# Fabl Backend Setup Guide

This guide will help you set up the complete Fabl backend infrastructure including the API server and database.

## Prerequisites

- Node.js 20+ installed
- PostgreSQL installed and running
- Redis installed and running (for queues)

### Install PostgreSQL (macOS)
```bash
brew install postgresql@15
brew services start postgresql@15
```

### Install Redis (macOS)
```bash
brew install redis
brew services start redis
```

## Quick Setup

### 1. Database Setup
```bash
# Run the automated database setup script
npm run setup:db

# This will create:
# - Database: fabl_dev
# - User: fabl_user
# - Password: fabl_password
```

### 2. Environment Configuration
Copy the example environment files:
```bash
cp apps/api/.env.example apps/api/.env.local
cp apps/hub/.env.example apps/hub/.env.local
cp apps/studio/.env.example apps/studio/.env.local
```

Update the `.env.local` files with the DATABASE_URL from step 1:
```
DATABASE_URL="postgresql://fabl_user:fabl_password@localhost:5432/fabl_dev"
```

### 3. Database Migration
```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Start All Services
```bash
# Start all apps (Hub, Studio, API)
npm run dev:all
```

## Services Overview

- **Hub** (Port 3000): Main viewing application
- **Studio** (Port 3001): Creator dashboard
- **API** (Port 3002): Backend API server
- **PostgreSQL** (Port 5432): Database
- **Redis** (Port 6379): Queue system

## API Endpoints

### Authentication
- `POST /api/auth/webhook` - Clerk user sync webhook

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `GET /api/users/:identifier` - Get user by ID/username

### Videos
- `GET /api/videos` - List videos (with pagination)
- `GET /api/videos/:id` - Get single video
- `POST /api/videos` - Create video
- `PUT /api/videos/:id` - Update video

### Upload
- `POST /api/upload/url` - Generate Mux upload URL
- `POST /api/upload/webhook/mux` - Mux webhook handler

## Database Management

```bash
# View database in browser
npm run db:studio

# Create new migration
npm run db:migrate

# Push schema changes (dev only)
npm run db:push

# Generate Prisma client
npm run db:generate
```

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
pg_isready

# Check database exists
psql -l | grep fabl_dev
```

### Redis Connection Issues
```bash
# Check if Redis is running
redis-cli ping
# Should return "PONG"
```

### Port Conflicts
If ports 3000, 3001, or 3002 are in use, update the PORT environment variables in the respective `.env.local` files.

## Next Steps

1. Set up Clerk webhooks to point to `http://localhost:3002/api/auth/webhook`
2. Configure Mux credentials for video upload
3. Set up production database and Redis instances
4. Configure environment variables for production

## Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    Hub      │    │   Studio    │    │     API     │
│  (Next.js)  │    │  (Next.js)  │    │  (Fastify)  │
│   :3000     │    │    :3001    │    │    :3002    │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                  ┌─────────────┐
                  │ PostgreSQL  │
                  │    :5432    │
                  └─────────────┘
```

## Development Workflow

1. Make schema changes in `packages/db/prisma/schema.prisma`
2. Run `npm run db:migrate` to create migration
3. Update API routes as needed
4. Test with `npm run dev:all`
5. Commit changes with proper git conventions