# Fabl MVP: Granular Task Breakdown

This document provides an incredibly granular, step-by-step plan to build the Fabl MVP. Each task is designed to be:

- **Small & Testable**: Can be completed and verified in isolation
- **Clear Scope**: Has explicit start/end conditions
- **Single Concern**: Focuses on one specific functionality

## 📋 Project Context

This task breakdown is designed for an **existing Vite + React + TailwindCSS frontend** with substantial UI components already built. Instead of creating a new monorepo structure, we'll:

- **Add a `/api` backend folder** to the existing project structure
- **Enhance existing UI components** (Header, Sidebar, VideoCard, VideoGrid, etc.) with real data
- **Connect existing page components** (HomePage, UploadPage, VideoPage, etc.) to the backend
- **Leverage existing styling** and component architecture

**Existing Components to Enhance:**

- ✅ Header, Sidebar, Button, VideoCard, VideoGrid
- ✅ HomePage, VideoPage, UploadPage, ProfilePage, and 6 other page components
- ✅ TailwindCSS configuration and styling
- ✅ Vite build system

## Phase 1: Project Foundation

### 1.1 Project Structure Setup

- **Task 1.1.1**: Create backend API structure within existing project

  - Start: Existing Vite React frontend project with components and pages
  - End: `/api` folder created with basic structure for backend
  - Test: Backend folder exists alongside existing frontend structure

- **Task 1.1.2**: Update package.json for full-stack development
  - Start: Existing frontend package.json and dependencies
  - End: Scripts added for running both frontend (port 5173) and backend (port 3001) concurrently
  - Test: `npm run dev` starts both frontend and backend without conflicts

### 1.2 Database Setup

- **Task 1.2.1**: Initialize Prisma in `/api/prisma`

  - Start: `/api` folder exists
  - End: Prisma initialized in backend with basic config
  - Test: `npx prisma --version` works in api folder

- **Task 1.2.2**: Create Users table schema

  - Start: Prisma initialized
  - End: `schema.prisma` contains Users model with id, email, name, createdAt
  - Test: `npx prisma validate` passes

- **Task 1.2.3**: Create Channels table schema

  - Start: Users table exists
  - End: Channels model with id, name, description, userId foreign key
  - Test: `npx prisma validate` passes

- **Task 1.2.4**: Create Videos table schema

  - Start: Channels table exists
  - End: Videos model with id, title, description, muxAssetId, channelId
  - Test: `npx prisma validate` passes

- **Task 1.2.5**: Create Comments table schema

  - Start: Videos table exists
  - End: Comments model with id, content, userId, videoId foreign keys
  - Test: `npx prisma validate` passes

- **Task 1.2.6**: Create Likes table schema

  - Start: Comments table exists
  - End: Likes model with id, userId, videoId composite unique key
  - Test: `npx prisma validate` passes

- **Task 1.2.7**: Create Subscriptions table schema

  - Start: Likes table exists
  - End: Subscriptions model with id, subscriberId, channelId
  - Test: `npx prisma validate` passes

- **Task 1.2.8**: Generate initial Prisma client
  - Start: All schemas defined
  - End: Prisma client generated in node_modules
  - Test: Import `@prisma/client` succeeds

### 1.3 Shared Types Setup

- **Task 1.3.1**: Create `/src/types` with User type

  - Start: Existing `/src` folder structure
  - End: TypeScript types for User exported from frontend types folder
  - Test: Type can be imported in both frontend and backend

- **Task 1.3.2**: Add Video, Channel, Comment types
  - Start: User type exists
  - End: All core entity types defined and exported
  - Test: All types importable and TypeScript validates in both frontend and backend

## Phase 2: Backend API Foundation

### 2.1 Fastify Server Setup

- **Task 2.1.1**: Initialize Fastify app in `/api`

  - Start: `/api` folder exists
  - End: Basic Fastify server starts on port 3001
  - Test: `curl localhost:3001/health` returns 200

- **Task 2.1.2**: Add environment configuration

  - Start: Basic server runs
  - End: `.env` loaded, DATABASE_URL configurable
  - Test: Environment variables accessible in app

- **Task 2.1.3**: Connect Prisma client to API

  - Start: Environment config exists
  - End: Database client instantiated and accessible
  - Test: Database connection successful on server start

- **Task 2.1.4**: Add request logging middleware

  - Start: Database connected
  - End: All requests logged with timestamp, method, URL
  - Test: Log output visible when making requests

- **Task 2.1.5**: Add CORS middleware
  - Start: Logging middleware added
  - End: CORS configured for frontend origin
  - Test: Preflight requests from frontend succeed

### 2.2 Authentication Setup

- **Task 2.2.1**: Install and configure Clerk webhook validation

  - Start: CORS configured
  - End: Clerk webhook validation middleware exists
  - Test: Valid JWT tokens pass, invalid tokens rejected

- **Task 2.2.2**: Create user authentication middleware

  - Start: Clerk validation exists
  - End: Middleware extracts user info from JWT
  - Test: Protected routes return 401 without valid token

- **Task 2.2.3**: Add user sync endpoint for Clerk webhooks
  - Start: Auth middleware exists
  - End: `/webhooks/clerk` creates/updates users in DB
  - Test: Webhook creates user record in database

## Phase 3: Basic User Management

### 3.1 User CRUD Operations

- **Task 3.1.1**: Create GET /users/me endpoint

  - Start: Auth middleware works
  - End: Authenticated users can fetch their profile
  - Test: Returns user data for valid token, 401 for invalid

- **Task 3.1.2**: Create PUT /users/me endpoint

  - Start: GET /users/me works
  - End: Users can update their profile (name, bio)
  - Test: Profile updates persist in database

- **Task 3.1.3**: Add input validation for user updates
  - Start: PUT /users/me works
  - End: Invalid inputs return 400 with error messages
  - Test: Various invalid inputs properly rejected

### 3.2 Channel Management

- **Task 3.2.1**: Create POST /channels endpoint

  - Start: User validation works
  - End: Authenticated users can create channels
  - Test: Channel created with proper foreign key to user

- **Task 3.2.2**: Create GET /channels/:id endpoint

  - Start: POST /channels works
  - End: Anyone can view channel details
  - Test: Returns channel info, returns 404 for non-existent

- **Task 3.2.3**: Create PUT /channels/:id endpoint

  - Start: GET /channels/:id works
  - End: Channel owners can update their channels
  - Test: Only channel owner can update, others get 403

- **Task 3.2.4**: Create GET /users/:id/channels endpoint
  - Start: PUT /channels/:id works
  - End: List all channels for a specific user
  - Test: Returns array of channels for user

## Phase 4: Video Infrastructure

### 4.1 Mux Integration Setup

- **Task 4.1.1**: Install Mux SDK and configure credentials

  - Start: Channel management complete
  - End: Mux client initialized with API credentials
  - Test: Mux client can authenticate with service

- **Task 4.1.2**: Create POST /upload/url endpoint

  - Start: Mux client configured
  - End: Returns Mux direct upload URL for authenticated users
  - Test: Upload URL generated and has proper expiration

- **Task 4.1.3**: Add Mux webhook endpoint
  - Start: Upload URL generation works
  - End: `/webhooks/mux` receives asset status updates
  - Test: Webhook properly validates Mux signatures

### 4.2 Video CRUD Operations

- **Task 4.2.1**: Create POST /videos endpoint

  - Start: Mux webhook works
  - End: Users can create video records with Mux asset ID
  - Test: Video record created with proper channel association

- **Task 4.2.2**: Create GET /videos/:id endpoint

  - Start: POST /videos works
  - End: Anyone can view video details and playback info
  - Test: Returns video metadata including Mux playback ID

- **Task 4.2.3**: Create GET /videos endpoint with pagination

  - Start: GET /videos/:id works
  - End: List videos with limit/offset pagination
  - Test: Pagination works correctly, respects limits

- **Task 4.2.4**: Create PUT /videos/:id endpoint

  - Start: Video listing works
  - End: Video owners can update title/description
  - Test: Only video owner can update, others get 403

- **Task 4.2.5**: Create DELETE /videos/:id endpoint
  - Start: PUT /videos/:id works
  - End: Video owners can delete their videos
  - Test: Video deleted from DB, Mux asset deletion queued

## Phase 5: Frontend Integration & Enhancement

### 5.1 Vite Development Setup

- **Task 5.1.1**: Verify and update existing Vite configuration

  - Start: Existing Vite React app with TailwindCSS configured
  - End: Vite dev server confirmed running on port 5173, proxy to backend API added
  - Test: `npm run dev` starts frontend on 5173, can proxy requests to localhost:3001

- **Task 5.1.2**: Install and configure Clerk frontend SDK

  - Start: Existing React app structure
  - End: Clerk authentication components and providers added
  - Test: Clerk provider wraps app, authentication components importable

- **Task 5.1.3**: Create API client utility

  - Start: Clerk SDK installed
  - End: `/src/lib/api.ts` utility for authenticated API calls
  - Test: API client includes proper authorization headers from Clerk

- **Task 5.1.4**: Add React Router for navigation
  - Start: API client exists
  - End: React Router configured with routes for existing page components
  - Test: Navigation between pages works, URLs update correctly

### 5.2 Enhance Existing Layout Components

- **Task 5.2.1**: Update existing Header component with authentication

  - Start: Existing Header component in `/src/components/Header.tsx`
  - End: Header includes user authentication state and sign-in/sign-out buttons
  - Test: Header shows different UI for authenticated vs unauthenticated users

- **Task 5.2.2**: Update existing Sidebar component with dynamic navigation

  - Start: Existing Sidebar component
  - End: Sidebar navigation items reflect user authentication status
  - Test: Authenticated users see additional navigation options

- **Task 5.2.3**: Create main Layout wrapper using existing components
  - Start: Updated Header and Sidebar components
  - End: Layout component that uses existing Header/Sidebar with routing
  - Test: All pages render within consistent layout structure

### 5.3 Authentication Integration

- **Task 5.3.1**: Create authentication routes

  - Start: React Router configured
  - End: `/sign-in` and `/sign-up` routes with Clerk components
  - Test: Authentication pages render and function correctly

- **Task 5.3.2**: Add protected route wrapper

  - Start: Authentication routes exist
  - End: Protected route component that redirects unauthenticated users
  - Test: Protected pages redirect to sign-in when not authenticated

- **Task 5.3.3**: Update existing page components with authentication
  - Start: Protected routes work
  - End: Existing page components (UploadPage, ProfilePage) use authentication state
  - Test: Pages display appropriate content based on authentication status

## Phase 6: Video Upload & Display Implementation

### 6.1 Enhance Existing Upload Page

- **Task 6.1.1**: Update existing UploadPage component with API integration

  - Start: Existing UploadPage component in `/src/components/pages/UploadPage.tsx`
  - End: UploadPage connects to backend upload URL endpoint
  - Test: Upload page makes API calls to get Mux upload URLs

- **Task 6.1.2**: Add file input validation to UploadPage

  - Start: UploadPage has API integration
  - End: File input accepts only video files with size/type validation
  - Test: Non-video files rejected, validation messages shown

- **Task 6.1.3**: Integrate Mux direct upload in UploadPage

  - Start: File validation works
  - End: Selected files upload directly to Mux with progress tracking
  - Test: Upload progress shown, completion triggers next step

- **Task 6.1.4**: Add video metadata form to UploadPage

  - Start: Mux upload works
  - End: Form for title, description, channel selection after upload
  - Test: Form validates required fields, submits to video creation API

- **Task 6.1.5**: Connect UploadPage to video creation API
  - Start: Metadata form works
  - End: Successful uploads create video records and redirect user
  - Test: Video appears in user's content after upload completion

### 6.2 Enhance Existing Video Display Components

- **Task 6.2.1**: Update existing VideoCard component with real data

  - Start: Existing VideoCard component in `/src/components/VideoCard.tsx`
  - End: VideoCard displays real video data from API calls
  - Test: VideoCard renders with actual video thumbnails, titles, metadata

- **Task 6.2.2**: Update existing VideoGrid component with API integration

  - Start: Updated VideoCard exists, existing VideoGrid component
  - End: VideoGrid fetches and displays videos from backend API
  - Test: Grid loads videos from API, handles loading and error states

- **Task 6.2.3**: Update existing VideoPage with Mux player
  - Start: VideoGrid works, existing VideoPage component
  - End: VideoPage displays Mux video player and video metadata
  - Test: Videos play correctly, metadata displays properly

### 6.3 Enhance Existing Page Components

- **Task 6.3.1**: Update existing HomePage with real video data

  - Start: Video display components work, existing HomePage component
  - End: HomePage fetches and displays recent videos using VideoGrid
  - Test: Homepage loads real videos from API with proper pagination

- **Task 6.3.2**: Create CategoryPage functionality

  - Start: HomePage works, existing CategoryPage component
  - End: CategoryPage shows videos filtered by category/channel
  - Test: Category pages show correct filtered video content

- **Task 6.3.3**: Update existing ProfilePage with user's content

  - Start: CategoryPage works, existing ProfilePage component
  - End: ProfilePage shows user's channels and uploaded videos
  - Test: Profile page displays user's content correctly with proper authentication

- **Task 6.3.4**: Connect remaining page components to backend
  - Start: Core pages working
  - End: TrendingPage, SubscriptionsPage, FavoritesPage, WatchLaterPage, NotificationsPage connected to respective APIs
  - Test: All existing page components display appropriate data from backend

## Phase 7: Social Features

### 7.1 Likes System

- **Task 7.1.1**: Create POST /videos/:id/like endpoint

  - Start: Video display complete
  - End: Authenticated users can like videos
  - Test: Like count increases, duplicate likes handled

- **Task 7.1.2**: Create DELETE /videos/:id/like endpoint

  - Start: Like creation works
  - End: Users can unlike videos they've liked
  - Test: Like count decreases, unlike works correctly

- **Task 7.1.3**: Add like button to video player

  - Start: Unlike functionality works
  - End: Like button shows state, handles clicks
  - Test: Button reflects like status, optimistic updates work

- **Task 7.1.4**: Add like counts to video cards
  - Start: Like button works
  - End: Video cards display like counts
  - Test: Like counts update in real-time

### 7.2 Comments System

- **Task 7.2.1**: Create POST /videos/:id/comments endpoint

  - Start: Likes system complete
  - End: Authenticated users can add comments
  - Test: Comments saved to DB with proper associations

- **Task 7.2.2**: Create GET /videos/:id/comments endpoint

  - Start: Comment creation works
  - End: List comments for a video with pagination
  - Test: Comments returned in correct order with pagination

- **Task 7.2.3**: Add comment form to video page

  - Start: Comment listing works
  - End: Comment form below video player
  - Test: New comments appear immediately after submission

- **Task 7.2.4**: Add comment list to video page
  - Start: Comment form works
  - End: Comments displayed below video with user info
  - Test: Comments show user names, timestamps correctly

### 7.3 Subscriptions System

- **Task 7.3.1**: Create POST /channels/:id/subscribe endpoint

  - Start: Comments system complete
  - End: Users can subscribe to channels
  - Test: Subscription created, duplicate subscriptions handled

- **Task 7.3.2**: Create DELETE /channels/:id/subscribe endpoint

  - Start: Subscribe functionality works
  - End: Users can unsubscribe from channels
  - Test: Subscription removed correctly

- **Task 7.3.3**: Add subscribe button to channel pages

  - Start: Unsubscribe works
  - End: Subscribe button shows correct state
  - Test: Button toggles subscription status correctly

- **Task 7.3.4**: Create subscriptions page
  - Start: Subscribe button works
  - End: `/subscriptions` shows user's subscribed channels
  - Test: Page lists subscribed channels with recent videos

## Phase 8: Content Moderation

### 8.1 Moderation Queue Setup

- **Task 8.1.1**: Install and configure BullMQ

  - Start: Social features complete
  - End: Redis-backed job queue operational
  - Test: Jobs can be added to and processed from queue

- **Task 8.1.2**: Create moderation job processor

  - Start: BullMQ configured
  - End: Worker processes video moderation jobs
  - Test: Jobs execute and update video status in DB

- **Task 8.1.3**: Integrate moderation API (Hive or AWS Rekognition)

  - Start: Job processor exists
  - End: Worker calls external moderation service
  - Test: API returns moderation results correctly

- **Task 8.1.4**: Add moderation status to video schema
  - Start: Moderation API integrated
  - End: Videos have pending/approved/rejected status
  - Test: Video status updates based on moderation results

### 8.2 AI Content Detection

- **Task 8.2.1**: Add AI detection job to moderation pipeline

  - Start: Basic moderation works
  - End: Videos analyzed for AI content ratio
  - Test: AI ratio calculated and stored for each video

- **Task 8.2.2**: Implement AI ratio enforcement

  - Start: AI detection works
  - End: Videos with <30% AI content rejected
  - Test: Non-AI videos properly flagged and hidden

- **Task 8.2.3**: Add moderation status to video API responses
  - Start: AI enforcement works
  - End: API includes moderation status in video data
  - Test: Frontend can display pending/rejected videos correctly

### 8.3 Moderation UI

- **Task 8.3.1**: Add upload status indicators

  - Start: Moderation status in API
  - End: Upload page shows processing/approved/rejected status
  - Test: Users see clear feedback on upload status

- **Task 8.3.2**: Filter approved videos in public listings
  - Start: Status indicators work
  - End: Only approved videos appear in public feeds
  - Test: Rejected videos don't appear in public areas

## Phase 9: Basic Recommendations

### 9.1 View Tracking

- **Task 9.1.1**: Create POST /videos/:id/view endpoint

  - Start: Moderation complete
  - End: Video views tracked in database
  - Test: View counts increment correctly

- **Task 9.1.2**: Add view tracking to video player

  - Start: View endpoint works
  - End: Views automatically tracked on video play
  - Test: View count increases when videos are watched

- **Task 9.1.3**: Add view counts to video displays
  - Start: View tracking works
  - End: Video cards and pages show view counts
  - Test: View counts display correctly across the app

### 9.2 Basic Recommendation Engine

- **Task 9.2.1**: Create trending algorithm

  - Start: View tracking complete
  - End: Algorithm calculates trending videos based on recent views
  - Test: Trending videos identified correctly

- **Task 9.2.2**: Create GET /videos/trending endpoint

  - Start: Trending algorithm works
  - End: API returns trending videos list
  - Test: Trending videos returned in correct order

- **Task 9.2.3**: Add trending page to frontend

  - Start: Trending API works
  - End: `/trending` page shows trending videos
  - Test: Trending page displays current trending content

- **Task 9.2.4**: Create basic recommendation algorithm

  - Start: Trending page works
  - End: Recommend videos based on user's likes and subscriptions
  - Test: Recommendations are relevant to user behavior

- **Task 9.2.5**: Create GET /videos/recommended endpoint

  - Start: Recommendation algorithm works
  - End: API returns personalized recommendations
  - Test: Different users get different recommendations

- **Task 9.2.6**: Update homepage to show recommendations
  - Start: Recommendation API works
  - End: Homepage shows mix of recent and recommended videos
  - Test: Authenticated users see personalized content

## Phase 10: Testing & Polish

### 10.1 Integration Testing

- **Task 10.1.1**: Write API integration tests

  - Start: All features implemented
  - End: Core API endpoints have integration tests
  - Test: Test suite runs successfully in CI

- **Task 10.1.2**: Write frontend component tests
  - Start: API tests exist
  - End: Key components have unit tests
  - Test: Frontend tests pass consistently

### 10.2 Performance Optimization

- **Task 10.2.1**: Add database indexing

  - Start: Tests complete
  - End: Key queries have proper database indexes
  - Test: Query performance improved measurably

- **Task 10.2.2**: Implement API response caching
  - Start: Database optimized
  - End: Frequently accessed data cached appropriately
  - Test: Cache hit rates show performance improvement

### 10.3 Production Readiness

- **Task 10.3.1**: Add error handling and logging

  - Start: Caching implemented
  - End: Comprehensive error handling and structured logging
  - Test: Errors are caught and logged appropriately

- **Task 10.3.2**: Add health check endpoints

  - Start: Error handling complete
  - End: Health checks for API, database, and external services
  - Test: Health checks return correct status information

- **Task 10.3.3**: Configure production environment
  - Start: Health checks work
  - End: Production deployment configuration ready
  - Test: Application runs correctly in production environment

---

## Testing Strategy for Each Task

For every task, verify completion using these methods:

1. **Unit Tests**: Where applicable, write tests that verify the specific functionality
2. **Manual Testing**: Use curl, Postman, or browser to verify endpoints work
3. **Integration Testing**: Ensure the feature works with existing components
4. **Error Case Testing**: Verify proper handling of invalid inputs/edge cases

## Success Criteria

The MVP is complete when:

- Users can sign up, create channels, and upload videos
- Videos are automatically moderated for content and AI ratio
- Basic social features (likes, comments, subscriptions) work
- Trending and recommendation systems provide relevant content
- The application is production-ready with proper error handling and monitoring

Each task should be completed in isolation and thoroughly tested before moving to the next task.

---

## Post-MVP Considerations

Once the MVP is live and validated with real users, consider the **Next.js Migration Plan** documented in [`docs/nextjs-migration.md`](./nextjs-migration.md).

**Key Benefits of Future Migration:**

- 🚀 **Enhanced SEO** - Server-side rendering for better search indexing
- ⚡ **Improved Performance** - Faster initial page loads and Core Web Vitals
- 🎯 **Zero UI Changes** - Identical user experience with technical improvements

**Migration Prerequisites:**

- ✅ MVP live with validated users
- ✅ Product-market fit demonstrated
- ✅ User feedback incorporated
- ✅ Resources available for 6-8 week migration project

The migration plan ensures your beautiful existing UI design remains 100% identical while gaining production-grade performance and SEO benefits.
