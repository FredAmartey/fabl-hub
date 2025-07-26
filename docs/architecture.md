# Fabl Architecture

## Overview

This document defines the core technical architecture for **Fabl**, a platform for AI-generated video content. The system supports user-uploaded AI-generated videos, featuring user accounts, channels, likes, comments, subscriptions, and a content recommendation engine. The architecture prioritizes scalability, modularity, security, and a clean codebase with best practices.

## Goals

- Handle 10,000 concurrent users reliably, with room to scale.
- Encourage public content discovery to maximize early growth.
- Support AI content moderation to reject NSFW uploads.
- Maintain code quality and modularity for long-term agility.
- Build toward personalized content recommendations.

---

## Current Implementation

This section describes what has been built and is currently running.

### Application Structure

This repository contains two **completely separate** Next.js applications that work together to provide a complete video platform experience.

#### 1. Fabl Hub (fabl.tv)

- **Location**: `/apps/hub`
- **Port**: 3000
- **Purpose**: Video platform for viewers
- **Features**:
  - Video browsing and discovery
  - Video playback
  - User profiles and channels
  - Comments and interactions
  - Subscriptions and notifications
  - Search and recommendations

#### 2. Fabl Studio (studio.fabl.tv)

- **Location**: `/apps/studio`
- **Port**: 3001
- **Purpose**: Creator dashboard for content management
- **Features**:
  - Video upload and management
  - Analytics and insights
  - Channel customization
  - Monetization settings
  - Community management
  - Content scheduling

### Running the Applications

#### Run Main App Only

```bash
npm run dev
```

Visit: http://localhost:3000

#### Run Studio Only

```bash
npm run dev:studio
```

Visit: http://localhost:3001

#### Run Both Applications

```bash
npm run dev:all
```

- Main app: http://localhost:3000
- Studio: http://localhost:3001

### Architecture Benefits

1. **Complete Separation**: Each app has its own:

   - package.json
   - Dependencies
   - Components
   - Routing
   - Build process

2. **Independent Deployment**: Can deploy separately to different domains
3. **Team Scalability**: Different teams can work on each app
4. **Performance**: Each app is optimized for its specific use case
5. **Security**: Different security models for viewers vs creators

### Current Directory Structure

```
fabl-monorepo/
├── apps/
│   ├── hub/               # Main viewing app
│   │   ├── src/
│   │   │   ├── app/       # Next.js app directory
│   │   │   ├── components/
│   │   │   │   ├── ui/    # Shadcn/ui components
│   │   │   │   └── charts/# Analytics visualizations
│   │   │   └── lib/       # Utilities
│   │   ├── public/
│   │   ├── package.json
│   │   └── ...config files
│   └── studio/            # Creator dashboard app
│       ├── src/
│       │   ├── app/       # Next.js app directory
│       │   ├── components/
│       │   │   └── ui/    # Shadcn/ui components
│       │   └── lib/       # Utilities
│       ├── public/
│       ├── package.json
│       └── ...config files
├── package.json           # Root monorepo scripts
├── docs/                  # Documentation
└── vite-archive/          # Previous Vite implementation
```

### Design System

#### UI Component Library

Both applications use a comprehensive component library based on:

- **Radix UI**: Unstyled, accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Pre-styled component patterns

#### Shared Components Include:

- Alert, Avatar, Badge, Button, Card, Dialog
- Form elements: Input, Select, Checkbox, Switch
- Navigation: Tabs, Dropdown Menu, Tooltip
- Layout: Separator, Scroll Area
- Data visualization: LineChart, DonutChart, BarChart

#### Animation System

- **Framer Motion**: Complex animations and transitions
- **AnimatedBackground**: Visual effects for enhanced UX
- **CSS Transitions**: Micro-interactions via Tailwind

### Authentication Flow

#### User Journey

1. **Unauthenticated State**:

   - Hub app shows "Sign In" button in header
   - No access to Upload, Notifications, or Profile features
   - Can browse and watch public videos

2. **Authenticated State**:

   - Hub app shows Upload button, Notifications bell, and Profile dropdown
   - "Upload" button redirects to Studio app with authentication preserved
   - Single sign-on (SSO) between Hub and Studio apps

#### Cross-App Authentication

- Both apps share authentication state
- When user clicks "Upload" on Hub:
  - If authenticated: Redirect to `studio.fabl.tv` with auth token
  - If not authenticated: Show sign-in modal, then redirect after login
- Studio validates authentication on load
- Sessions persist across both applications

### Environment Configuration

#### Hub App (`/apps/hub/.env.local`)

```env
NEXT_PUBLIC_STUDIO_URL=http://localhost:3001  # Development
# NEXT_PUBLIC_STUDIO_URL=https://studio.fabl.tv  # Production
```

#### Studio App (`/apps/studio/.env.local`)

```env
NEXT_PUBLIC_HUB_URL=http://localhost:3000  # Development
# NEXT_PUBLIC_HUB_URL=https://fabl.tv  # Production
```

### Navigation Flow

#### Upload Flow

1. User clicks "Upload" button in Hub header
2. System checks authentication status
3. If authenticated: Opens Studio in new tab at upload page
4. If not authenticated: Shows sign-in modal → authenticates → redirects to Studio

#### Header Components

- **Signed Out**: Logo | Search | Sign In button
- **Signed In**: Logo | Search | Upload button | Notifications | Profile

---

## System Architecture (Blueprint)

This section describes the complete system design including backend services, infrastructure, and future implementations.

### Tech Stack

#### Frontend

- **Framework**: Next.js (React-based with SSR)
- **Styling**: TailwindCSS or CSS Modules
- **Deployment**: Vercel (includes edge caching + CI)

#### Backend

- **Runtime**: Node.js
- **Framework**: Fastify (lightweight alternative to Express)
- **Authentication**: Clerk (JWT-based)
- **Database**: PostgreSQL (via Prisma ORM)
- **Video Infra**: Mux (upload, storage, transcoding, delivery)
- **Moderation**: Hive API (NSFW scanning)
- **Queue**: BullMQ (Redis-based job processing)
- **Recommendation Engine**: Redis, vector search, optional ML model in Python microservice
- **CI/CD**: GitHub Actions
- **Monitoring**: Datadog

#### API Layer Choice

- **REST (MVP)**: Fast to implement, simple endpoints, clear request/response structure
- **GraphQL (Future)**: Flexible data fetching, fewer round-trips, strong type-safety

### System Components

#### 1. Client (Next.js)

- Handles all rendering (SSR + SPA hybrid)
- Communicates with backend via REST endpoints (GraphQL gateway can be added later)
- Authenticated via Clerk tokens
- Manages local UI state (e.g. video playback controls, menus)
- Uses React Query or SWR for server state synchronization

#### 2. API Server (Fastify)

Handles business logic:

- Auth verification
- Mux upload session creation
- Moderation queueing
- CRUD for users, videos, comments, likes, subscriptions
- Serves Mux playback IDs and metadata
- Sends data to recommendation pipeline (view logs, likes, etc.)

#### 3. Database (PostgreSQL)

Relational schema to support:

- `users`
- `channels`
- `videos` (stores Mux asset ID)
- `comments`
- `likes`
- `subscriptions`
- `moderation_logs`
- `view_events`

Manages persistent state for all user and content-related data.

#### 4. Video Management (Mux)

- Users upload videos through Mux Direct Uploads
- Mux handles storage, transcoding, HLS streaming
- Playback ID is stored in DB
- Thumbnail and analytics support included

#### 5. Content Delivery

- Mux CDN handles global video delivery automatically

#### 6. Moderation Service

- Enqueues uploaded Mux asset metadata
- Uses Hive API to scan for NSFW, violence, and other categories
- Updates DB with `isFlagged` status

### AI Ratio Enforcement

To enforce Fabl's policy that all uploaded videos must be at least 30% AI-generated, we use a fully backend-driven, user-invisible detection pipeline:

#### Detection Pipeline

1. **Trigger**: When a video finishes processing in Mux, a job is enqueued in BullMQ.
2. **Frame Sampling**: The moderation worker extracts frames from the video at 1 frame per second (configurable).
3. **Classification**: Each frame is passed through a "real vs synthetic" classifier to determine whether it appears AI-generated.
4. **AI Ratio Calculation**: We calculate the proportion of frames classified as AI-generated.
5. **Decision Logic**:
   - If `AI ratio ≥ 0.3`: The video is approved.
   - If `AI ratio < 0.3`: The video is rejected and flagged in the database; the user sees a simple error message in the UI.

#### Classifier Options

- **XceptionNet-based Detectors** (open source): Trained on FaceForensics++, detects GAN/Deepfake features.
- **RealForensics (MIT Media Lab)**: Frame-based classifier tuned for synthetic artifact detection.
- **Sensity API**: Hosted API returning frame-level manipulation confidence scores.
- **Amber Video**: Commercial API for deepfake detection and content integrity.
- **Custom Vision Transformer (ViT)**: Fine-tuned on labeled AI vs real datasets specific to Fabl's expected content types.

This process requires no manual metadata from the user and ensures accurate enforcement of platform integrity with no friction during uploads.

#### 7. Recommendation Engine _(scalable)_

- Collects `view_events`, `likes`, and `subscriptions`
- Option 1: Build scoring model using Postgres + Redis (trending, popular, relevant)
- Option 2: Vector-based search with Pinecone, Weaviate, or custom embedding model
- Option 3: Train collaborative filtering model (matrix factorization or deep learning)
- Serves `/recommendations` endpoint based on behavior + content features

#### 8. Notification System _(future upgrade)_

- Pub/Sub system using Redis or SNS for:
  - New comments
  - Sub activity
  - Upload success/failure

### Data & State Management

- **Frontend UI State**: Component-local (React useState) and global (React Context or Zustand if needed)
- **Server State**: Fetched via REST APIs using SWR or React Query
- **Persistent State**: Stored in PostgreSQL and queried via Prisma
- **Media State**: Managed by Mux; metadata stored in DB
- **Moderation State**: In Redis-backed BullMQ queues, with status logged in DB
- **Recommendation State**: Aggregated from views/likes, updated asynchronously
- **Auth State**: JWT handled via Clerk SDK (frontend) and Fastify middleware (backend)

### Service Connections

- **Client → API**: Authenticated REST calls using JWT headers
- **API → DB**: Prisma ORM, using connection pooling
- **API → Mux**: Upload sessions, asset status, playback ID retrieval
- **API → Moderation Queue**: Pushes Mux asset info to BullMQ
- **Moderation Worker → Scanner API**: Calls Hive
- **Scanner API → API Server**: Flags unsafe content via webhook or polling
- **API → Recommender**: Sends interaction events to engine
- **Mux → Client**: HLS playback via `<video>` or Mux player

### Core Design Patterns

| Pattern          | Use Case                           |
| ---------------- | ---------------------------------- |
| Repository       | Database abstraction layer         |
| Factory          | Extendable content types           |
| Queue-based Jobs | Moderation, recommendation updates |
| Middleware       | Auth, logging, rate-limiting       |

### Security Best Practices

- Rate limiting on public API routes
- Mux upload tokens expire after one use
- JWT with short TTL and refresh logic
- Input validation + sanitation (backend and frontend)
- CORS locked to frontend origin
- Webhook validation from Mux and moderation APIs

---

## Future Development

### Target File + Folder Structure (MVP)

```
/fabl
├── /apps
│   ├── /hub              # Main viewing app (Next.js)
│   │   ├── /src
│   │   │   ├── /app      # Next.js app directory
│   │   │   ├── /components
│   │   │   ├── /lib      # Client utilities
│   │   │   └── /api      # API routes (Next.js API)
│   │   └── package.json
│   ├── /studio           # Creator dashboard (Next.js)
│   │   ├── /src
│   │   │   ├── /app      # Next.js app directory
│   │   │   ├── /components
│   │   │   ├── /lib      # Client utilities
│   │   │   └── /api      # API routes (Next.js API)
│   │   └── package.json
│   └── /api              # Shared backend services (Fastify)
│       ├── /src
│       │   ├── /routes   # API endpoints
│       │   ├── /services # Business logic
│       │   ├── /workers  # Queue workers (moderation, AI detection)
│       │   └── /lib      # Backend utilities
│       └── package.json
├── /packages
│   ├── /db               # Prisma schema + migrations
│   ├── /types            # Shared TypeScript types
│   └── /utils            # Shared utils (validation, API helpers)
├── /infrastructure       # Terraform/IaC (optional)
├── /scripts              # DB seeders, moderation jobs
├── docker-compose.yml    # Dev environment orchestration
└── README.md
```

#### Architecture Notes:

- **Hub & Studio Apps**: Remain as separate Next.js applications
- **Shared API Service**: Fastify backend serves both Hub and Studio
- **Next.js API Routes**: Used for BFF (Backend for Frontend) pattern - handling auth, caching, and API aggregation
- **Fastify API**: Core business logic, database operations, video processing, moderation
- **Shared Packages**: Database schema, types, and utilities used across all apps

### Scaling Plan (Post-MVP)

- **Horizontal scale** backend/API using container orchestration (e.g. ECS or Kubernetes)
- Load-balanced services and autoscaling groups
- Separate services for comments, notifications, and recommendations
- Caching layer (Redis, DAX, or Varnish)
- Offload media workloads entirely to Mux CDN
- Move recommender to dedicated ML microservice (Python + Faiss or TensorFlow)

### Optional Future Features

- Prompt-to-video integrations (via third-party AI APIs)
- Livestream support for AI-generated characters (Mux Live API)
- Creator analytics dashboards
- Monetization (ads, tips, subscription)
- Private/unlisted videos (later phase)

### Implementation Considerations

- Deploy main app to `fabl.tv`
- Deploy studio to `studio.fabl.tv`
- Implement shared authentication service
- Consider using Turborepo for better monorepo management
- Implement shared component library if needed
- Add OAuth providers (Google, GitHub, etc.)
- Implement JWT-based authentication with refresh tokens
- Add CORS configuration for cross-origin requests

---

## Appendix

### Tools to Evaluate for NSFW Moderation

- [Hive](https://thehive.ai/)
- [Sightengine](https://sightengine.com/)
- [AWS Rekognition](https://aws.amazon.com/rekognition/)

### Mux Asset Example Fields (Stored in DB)

```
mux_asset_id: string
mux_playback_id: string
thumbnail_url: string
status: 'ready' | 'errored' | 'processing'
is_flagged: boolean
```

---

This document serves as the architectural source of truth for all developers working on Fabl. Updates should be versioned and reviewed by tech leads.
