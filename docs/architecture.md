# Fabl: System Architecture

## Overview

This document defines the core technical architecture for **Fabl**, a platform for AI-generated video content. The system supports user-uploaded AI-generated videos, featuring user accounts, channels, likes, comments, subscriptions, and a content recommendation engine. The architecture prioritizes scalability, modularity, security, and a clean codebase with best practices.

## Goals

- Handle 10,000 concurrent users reliably, with room to scale.
- Encourage public content discovery to maximize early growth.
- Support AI content moderation to reject NSFW uploads.
- Maintain code quality and modularity for long-term agility.
- Build toward personalized content recommendations.

---

## Tech Stack

### Frontend

- **Framework**: Next.js (React-based with SSR)
- **Styling**: TailwindCSS or CSS Modules
- **Deployment**: Vercel (includes edge caching + CI)

### Backend

- **Runtime**: Node.js
- **Framework**: Fastify (lightweight alternative to Express)
- **Authentication**: Clerk (JWT-based)
- **Database**: PostgreSQL (via Prisma ORM)
- **Video Infra**: Mux (upload, storage, transcoding, delivery)
- **Moderation**: Hive API or AWS Rekognition (NSFW scanning)
- **Queue**: BullMQ (Redis-based job processing)
- **Recommendation Engine**: Redis, vector search, optional ML model in Python microservice
- **CI/CD**: GitHub Actions
- **Monitoring**: Datadog

### API Layer Choice

- **REST (MVP)**: Fast to implement, simple endpoints, clear request/response structure
- **GraphQL (Future)**: Flexible data fetching, fewer round-trips, strong type-safety

_Recommendation_: Start with REST to reduce complexity. Introduce a GraphQL gateway once client data requirements grow and efficiency gains outweigh added setup.

## System Components

### 1. Client (Next.js)

- Handles all rendering (SSR + SPA hybrid)
- Communicates with backend via REST endpoints (GraphQL gateway can be added later)
- Authenticated via Clerk tokens
- Manages local UI state (e.g. video playback controls, menus)
- Uses React Query or SWR for server state synchronization

### 2. API Server (Fastify)

Handles business logic:

- Auth verification
- Mux upload session creation
- Moderation queueing
- CRUD for users, videos, comments, likes, subscriptions
- Serves Mux playback IDs and metadata
- Sends data to recommendation pipeline (view logs, likes, etc.)

### 3. Database (PostgreSQL)

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

### 4. Video Management (Mux)

- Users upload videos through Mux Direct Uploads
- Mux handles storage, transcoding, HLS streaming
- Playback ID is stored in DB
- Thumbnail and analytics support included

### 5. Content Delivery

- Mux CDN handles global video delivery automatically

### 6. Moderation Service

- Enqueues uploaded Mux asset metadata
- Uses Hive API to scan for NSFW, violence, and other categories
- Updates DB with `isFlagged` status

## AI Ratio Enforcement

To enforce Fabl's policy that all uploaded videos must be at least 30% AI-generated, we use a fully backend-driven, user-invisible detection pipeline:

### Detection Pipeline

1. **Trigger**: When a video finishes processing in Mux, a job is enqueued in BullMQ.
2. **Frame Sampling**: The moderation worker extracts frames from the video at 1 frame per second (configurable).
3. **Classification**: Each frame is passed through a “real vs synthetic” classifier to determine whether it appears AI-generated.
4. **AI Ratio Calculation**: We calculate the proportion of frames classified as AI-generated.
5. **Decision Logic**:
   - If `AI ratio ≥ 0.3`: The video is approved.
   - If `AI ratio < 0.3`: The video is rejected and flagged in the database; the user sees a simple error message in the UI.

### Classifier Options

- **XceptionNet-based Detectors** (open source): Trained on FaceForensics++, detects GAN/Deepfake features.
- **RealForensics (MIT Media Lab)**: Frame-based classifier tuned for synthetic artifact detection.
- **Sensity API**: Hosted API returning frame-level manipulation confidence scores.
- **Amber Video**: Commercial API for deepfake detection and content integrity.
- **Custom Vision Transformer (ViT)**: Fine-tuned on labeled AI vs real datasets specific to Fabl’s expected content types.

This process requires no manual metadata from the user and ensures accurate enforcement of platform integrity with no friction during uploads.

### 7. Recommendation Engine _(scalable)_

- Collects `view_events`, `likes`, and `subscriptions`
- Option 1: Build scoring model using Postgres + Redis (trending, popular, relevant)
- Option 2: Vector-based search with Pinecone, Weaviate, or custom embedding model
- Option 3: Train collaborative filtering model (matrix factorization or deep learning)
- Serves `/recommendations` endpoint based on behavior + content features

### 8. Notification System _(future upgrade)_

- Pub/Sub system using Redis or SNS for:
  - New comments
  - Sub activity
  - Upload success/failure

---

## File + Folder Structure (MVP)

```
/fabl
├── /apps
│   ├── /web              # Next.js frontend
│   └── /api              # Fastify backend
├── /packages
│   ├── /db               # Prisma schema + migrations
│   ├── /types            # Shared TypeScript types
│   └── /utils            # Shared utils (validation, API helpers)
├── /infrastructure       # Terraform/IaC (optional)
├── /scripts              # DB seeders, moderation jobs
├── docker-compose.yml    # Dev environment orchestration
└── README.md
```

---

## Data & State Management

- **Frontend UI State**: Component-local (React useState) and global (React Context or Zustand if needed)
- **Server State**: Fetched via REST APIs using SWR or React Query
- **Persistent State**: Stored in PostgreSQL and queried via Prisma
- **Media State**: Managed by Mux; metadata stored in DB
- **Moderation State**: In Redis-backed BullMQ queues, with status logged in DB
- **Recommendation State**: Aggregated from views/likes, updated asynchronously
- **Auth State**: JWT handled via Clerk SDK (frontend) and Fastify middleware (backend)

---

## Service Connections

- **Client → API**: Authenticated REST calls using JWT headers
- **API → DB**: Prisma ORM, using connection pooling
- **API → Mux**: Upload sessions, asset status, playback ID retrieval
- **API → Moderation Queue**: Pushes Mux asset info to BullMQ
- **Moderation Worker → Scanner API**: Calls Hive or Rekognition
- **Scanner API → API Server**: Flags unsafe content via webhook or polling
- **API → Recommender**: Sends interaction events to engine
- **Mux → Client**: HLS playback via `<video>` or Mux player

---

## Core Design Patterns

| Pattern          | Use Case                           |
| ---------------- | ---------------------------------- |
| Repository       | Database abstraction layer         |
| Factory          | Extendable content types           |
| Queue-based Jobs | Moderation, recommendation updates |
| Middleware       | Auth, logging, rate-limiting       |

---

## Security Best Practices

- Rate limiting on public API routes
- Mux upload tokens expire after one use
- JWT with short TTL and refresh logic
- Input validation + sanitation (backend and frontend)
- CORS locked to frontend origin
- Webhook validation from Mux and moderation APIs

---

## Scaling Plan (Post-MVP)

- **Horizontal scale** backend/API using container orchestration (e.g. ECS or Kubernetes)
- Load-balanced services and autoscaling groups
- Separate services for comments, notifications, and recommendations
- Caching layer (Redis, DAX, or Varnish)
- Offload media workloads entirely to Mux CDN
- Move recommender to dedicated ML microservice (Python + Faiss or TensorFlow)

---

## Optional Future Features

- Prompt-to-video integrations (via third-party AI APIs)
- Livestream support for AI-generated characters (Mux Live API)
- Creator analytics dashboards
- Monetization (ads, tips, subscription)
- Private/unlisted videos (later phase)

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
