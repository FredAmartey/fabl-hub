# Fabl MVP: Granular Task Breakdown

This document provides an incredibly granular, step-by-step plan to build the Fabl MVP. Each task is designed to be:

- **Small & Testable**: Can be completed and verified in isolation
- **Clear Scope**: Has explicit start/end conditions
- **Single Concern**: Focuses on one specific functionality

## 📋 Project Context

Fabl is now architected as a **monorepo with two separate Next.js applications**:

- **Hub App** (`/apps/hub`): The main video platform for viewers (runs on port 3000)
- **Studio App** (`/apps/studio`): Creator dashboard for content management (runs on port 3001)

This architecture provides complete separation of concerns between viewing and content creation.

**Current Status:**

- ✅ Monorepo structure established
- ✅ Two separate Next.js applications created
- ✅ Cross-app navigation implemented (Upload button → Studio)
- ✅ Environment-based URL configuration
- ✅ TailwindCSS and component structure in place

**Key Architectural Decisions:**

- Complete application separation (no shared routing)
- Single Sign-On (SSO) between applications
- Environment variables for cross-app URLs
- Seamless upload flow (Hub → Studio)

## Phase 1: Authentication Foundation

### 1.1 Authentication Service Setup

- **Task 1.1.1**: Create shared authentication service

  - Start: Two separate Next.js apps (Hub and Studio)
  - End: Shared authentication service accessible by both apps
  - Test: Authentication tokens can be validated across both applications

- **Task 1.1.2**: Implement Single Sign-On (SSO) flow
  - Start: Authentication service exists
  - End: Users can sign in on Hub and access Studio without re-authentication
  - Test: Signing in on one app provides access to the other

- **Task 1.1.3**: Update Hub Header for authentication states
  - Start: SSO flow implemented
  - End: Header shows Sign In when unauthenticated, Upload/Notifications/Profile when authenticated
  - Test: Header correctly reflects authentication state

- **Task 1.1.4**: Implement Upload button authentication check
  - Start: Header authentication states working
  - End: Upload button redirects to Studio when authenticated, shows sign-in modal when not
  - Test: Click flow works correctly based on auth state

### 1.2 Database Setup

- **Task 1.2.1**: Create shared database structure

  - Start: Authentication service exists
  - End: Shared database accessible by both Hub and Studio backend services
  - Test: Both applications can connect to the same database

- **Task 1.2.2**: Initialize Prisma for both applications

  - Start: Shared database exists
  - End: Prisma configured in both Hub and Studio with shared schema
  - Test: `npx prisma --version` works in both app directories

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

## Phase 2: Shared Packages & Backend Structure

### 2.1 Monorepo Package Structure

- **Task 2.1.1**: Create shared packages directory structure

  - Start: Current monorepo with hub and studio apps
  - End: `/packages` directory with db, types, and utils subdirectories
  - Test: Package directories exist with proper package.json files

- **Task 2.1.2**: Set up shared database package

  - Start: Package structure exists
  - End: `/packages/db` contains Prisma schema and migrations
  - Test: Prisma commands work from package directory

- **Task 2.1.3**: Create shared types package

  - Start: Database package exists
  - End: `/packages/types` exports all shared TypeScript interfaces
  - Test: Types can be imported in both hub and studio apps

- **Task 2.1.4**: Create shared utilities package

  - Start: Types package exists
  - End: `/packages/utils` contains validation, formatting helpers
  - Test: Utilities work across all applications

- **Task 2.1.5**: Configure monorepo workspace dependencies

  - Start: All packages created
  - End: Apps can import from @fabl/db, @fabl/types, @fabl/utils
  - Test: TypeScript resolves shared packages correctly

### 2.2 Shared API Service Setup

- **Task 2.2.1**: Create Fastify API application structure

  - Start: Monorepo packages configured
  - End: `/apps/api` directory with Fastify boilerplate
  - Test: Fastify server starts on port 3002

- **Task 2.2.2**: Implement shared middleware

  - Start: Basic Fastify server runs
  - End: Auth, CORS, logging, rate limiting middleware configured
  - Test: Middleware properly intercepts requests

- **Task 2.2.3**: Set up route structure

  - Start: Middleware configured
  - End: `/apps/api/src/routes` with organized endpoint structure
  - Test: Sample routes respond correctly

- **Task 2.2.4**: Create services layer

  - Start: Routes structure exists
  - End: `/apps/api/src/services` with business logic separation
  - Test: Services properly abstract database operations

- **Task 2.2.5**: Configure Docker development environment

  - Start: API service exists
  - End: docker-compose.yml with API, database, Redis services
  - Test: `docker-compose up` starts full development stack

## Phase 3: Backend API Foundation

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

## Phase 4: BFF Pattern Implementation

### 4.1 Hub BFF Layer

- **Task 4.1.1**: Create Next.js API routes structure in Hub

  - Start: Hub app running
  - End: `/apps/hub/src/api` directory with route handlers
  - Test: API routes accessible at /api/* endpoints

- **Task 4.1.2**: Implement authentication proxy

  - Start: API routes structure exists
  - End: Auth tokens validated and forwarded to Fastify API
  - Test: Protected routes require valid authentication

- **Task 4.1.3**: Add response caching layer

  - Start: Auth proxy works
  - End: Frequently accessed data cached in Next.js API
  - Test: Cache headers properly set, performance improved

- **Task 4.1.4**: Implement API aggregation

  - Start: Caching works
  - End: Single Hub API call can fetch from multiple Fastify endpoints
  - Test: Reduced client-side API calls

### 4.2 Studio BFF Layer

- **Task 4.2.1**: Create Next.js API routes structure in Studio

  - Start: Studio app running
  - End: `/apps/studio/src/api` directory with route handlers
  - Test: API routes accessible at /api/* endpoints

- **Task 4.2.2**: Implement creator-specific API logic

  - Start: API routes structure exists
  - End: Upload tokens, analytics aggregation handled in BFF
  - Test: Creator workflows simplified

- **Task 4.2.3**: Add file upload preprocessing

  - Start: Creator API logic works
  - End: Video validation before sending to Mux
  - Test: Invalid files rejected at BFF layer

## Phase 5: Video Infrastructure

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

## Phase 5: Hub App Development

### 5.1 Hub Authentication Integration

- **Task 5.1.1**: Integrate authentication provider in Hub app

  - Start: Hub Next.js app structure exists
  - End: Authentication provider configured in Hub app
  - Test: Authentication context available throughout Hub app

- **Task 5.1.2**: Create sign-in modal component

  - Start: Authentication provider integrated
  - End: Modal appears when unauthenticated user clicks Upload
  - Test: Sign-in modal shows and functions correctly

- **Task 5.1.3**: Update Header component with auth states

  - Start: Sign-in modal exists
  - End: Header shows correct buttons based on authentication
  - Test: Header dynamically updates when user signs in/out

- **Task 5.1.4**: Implement authenticated navigation to Studio
  - Start: Header auth states working
  - End: Upload button redirects to Studio with auth token
  - Test: Seamless redirect to Studio upload page when authenticated

### 5.2 UI Consistency & Data Integration

- **Task 5.2.1**: Replace hardcoded profile data with dynamic user data

  - Start: Header component with hardcoded profile info
  - End: Profile dropdown shows real user data (name, avatar, username)
  - Test: Profile dropdown reflects actual logged-in user information

- **Task 5.2.2**: Sync profile avatar between icon and dropdown

  - Start: User icon shows generic gradient, dropdown shows real image
  - End: User icon displays actual user profile picture as avatar
  - Test: Profile icon and dropdown show same user image consistently

- **Task 5.2.3**: Replace mock notification data with real notifications

  - Start: Notifications dropdown shows hardcoded sample data
  - End: Notifications reflect real user activity (likes, comments, subscriptions)
  - Test: Notification count and content updates based on actual user activity

- **Task 5.2.4**: Remove hardcoded fallback data throughout components

  - Start: Components have placeholder/mock data
  - End: All components show loading states or real data, no hardcoded fallbacks
  - Test: No placeholder usernames, images, or content visible in production

### 5.3 Hub Core Features

- **Task 5.3.1**: Implement video browsing on homepage

  - Start: UI consistency issues resolved
  - End: Homepage displays video grid with real data
  - Test: Videos load and display correctly with real thumbnails and metadata

- **Task 5.3.2**: Create video player page

  - Start: Video browsing works
  - End: Individual video pages with player and metadata
  - Test: Videos play correctly with comments/likes visible

- **Task 5.3.3**: Implement search functionality
  - Start: Video player works
  - End: Search bar returns relevant video results
  - Test: Search queries return appropriate videos

- **Task 5.3.4**: Replace hardcoded video data with dynamic content

  - Start: VideoCard and VideoGrid components exist
  - End: All video data comes from API, no hardcoded video information
  - Test: Video cards show real titles, views, creators, upload dates

### 5.4 Additional Hub Features

- **Task 5.4.1**: Implement Explore page functionality

  - Start: Basic page structure exists
  - End: Explore page shows curated content categories
  - Test: Different content sections load with real data

- **Task 5.4.2**: Complete Settings page implementation

  - Start: Settings UI with tabs exists
  - End: All settings (permissions, defaults, privacy) functional
  - Test: Settings changes persist and affect app behavior

- **Task 5.4.3**: Implement Help/Support section

  - Start: Help directory exists
  - End: Help pages with FAQs, guides, and support contact
  - Test: Help content accessible and searchable

- **Task 5.4.4**: Add chart components for analytics

  - Start: LineChart and DonutChart components exist
  - End: Charts display real user/video analytics data
  - Test: Charts update with real-time data

### 5.5 Authentication Integration

- **Task 5.5.1**: Create authentication routes

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

## Phase 6: Studio App Development

### 6.1 Studio Upload Implementation

- **Task 6.1.1**: Create Studio upload page

  - Start: Studio app with authentication
  - End: Upload page accessible at `/upload` in Studio app
  - Test: Authenticated users can access upload page

- **Task 6.1.2**: Implement video file selection

  - Start: Upload page exists
  - End: File input accepts video files with validation
  - Test: Non-video files rejected, validation messages shown

- **Task 6.1.3**: Integrate Mux direct upload

  - Start: File validation works
  - End: Selected files upload to Mux with progress tracking
  - Test: Upload progress shown, completion triggers next step

- **Task 6.1.4**: Create video metadata form

  - Start: Mux upload works
  - End: Form for title, description, thumbnail after upload
  - Test: Form validates required fields correctly

- **Task 6.1.5**: Connect to video creation API
  - Start: Metadata form works
  - End: Successful uploads create video records
  - Test: Video appears in creator's content dashboard

### 6.2 Studio UI Consistency & Data Integration

- **Task 6.2.1**: Replace hardcoded studio dashboard data

  - Start: Studio dashboard with mock analytics data
  - End: Dashboard shows real creator analytics and video metrics
  - Test: All charts and numbers reflect actual user data

- **Task 6.2.2**: Implement dynamic video management

  - Start: Studio shows placeholder video content
  - End: Studio displays actual uploaded videos with real metadata
  - Test: Video list updates when new videos are uploaded

- **Task 6.2.3**: Sync user profile between Hub and Studio

  - Start: Different profile data in each app
  - End: Consistent user profile information across both apps
  - Test: Profile changes in one app immediately reflect in the other

### 6.3 Studio Creator Dashboard

- **Task 6.3.1**: Create content management dashboard

  - Start: UI consistency resolved
  - End: Dashboard shows creator's uploaded videos with real data
  - Test: Videos listed with actual views, likes, comments count

- **Task 6.3.2**: Implement video editing functionality

  - Start: Dashboard displays real videos
  - End: Creators can edit video title, description, thumbnail
  - Test: Edits save correctly and reflect in Hub app

- **Task 6.3.3**: Add analytics dashboard
  - Start: Video editing works
  - End: Analytics showing real views, engagement metrics
  - Test: Analytics data updates correctly based on actual user activity

### 6.4 Additional Studio Features

- **Task 6.4.1**: Implement Audio Library functionality

  - Start: Audio library page structure exists
  - End: Creators can browse and use royalty-free audio
  - Test: Audio tracks can be searched and added to videos

- **Task 6.4.2**: Build Monetization dashboard

  - Start: Monetization page exists
  - End: Revenue tracking, ad settings, sponsorship management
  - Test: Monetization metrics display correctly

- **Task 6.4.3**: Create Playlist management

  - Start: Playlists directory exists
  - End: Creators can create, edit, and organize playlists
  - Test: Playlists sync with Hub app for viewers

- **Task 6.4.4**: Implement Customization features

  - Start: Customization page exists
  - End: Channel branding, layout customization options
  - Test: Customizations reflect in Hub channel pages

- **Task 6.4.5**: Add Modal system for workflows

  - Start: Modal component exists
  - End: All Studio workflows use consistent modal patterns
  - Test: Modals handle forms, confirmations, and multi-step processes

- **Task 6.4.6**: Implement enhanced Studio layout

  - Start: StudioLayoutEnhanced component exists
  - End: Collapsible sidebar, tooltips, smooth animations
  - Test: Layout responsive and maintains state across navigation

### 6.5 Cross-App Integration

- **Task 6.5.1**: Ensure authentication persistence

  - Start: Both apps have authentication
  - End: Signing in on Hub persists to Studio and vice versa
  - Test: SSO flow works seamlessly between apps

- **Task 6.5.2**: Implement shared user profile

  - Start: SSO working
  - End: User profile changes in one app reflect in the other
  - Test: Profile updates synchronize across apps

- **Task 6.5.3**: Create navigation between apps

  - Start: Shared profile works
  - End: Clear navigation paths between Hub and Studio
  - Test: Users can easily switch between viewing and creating

- **Task 6.5.4**: Implement notification sync
  - Start: Navigation works
  - End: Notifications appear in both apps appropriately
  - Test: Creator notifications in Studio, viewer notifications in Hub

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

## Phase 8: Content Moderation & AI Enforcement

### 8.1 Queue Infrastructure Setup

- **Task 8.1.1**: Install and configure BullMQ with Redis

  - Start: Redis running in Docker
  - End: BullMQ connected and operational
  - Test: Can add and process test jobs

- **Task 8.1.2**: Create workers directory structure

  - Start: BullMQ configured
  - End: `/apps/api/src/workers` with moderation and AI detection workers
  - Test: Workers can be started independently

- **Task 8.1.3**: Implement worker health monitoring

  - Start: Workers running
  - End: Health checks and auto-restart on failure
  - Test: Workers recover from crashes

### 8.2 Content Moderation Implementation

- **Task 8.2.1**: Create moderation worker

  - Start: Worker structure exists
  - End: Worker processes video moderation jobs
  - Test: Jobs execute and update video status

- **Task 8.2.2**: Integrate Hive API for NSFW detection

  - Start: Moderation worker exists
  - End: Hive API validates video content
  - Test: NSFW content properly flagged

- **Task 8.2.3**: Implement webhook validation

  - Start: Hive API integrated
  - End: Webhook signatures validated for security
  - Test: Invalid webhooks rejected

### 8.3 AI Content Detection Pipeline

- **Task 8.3.1**: Implement frame extraction worker

  - Start: Worker infrastructure ready
  - End: Extract 1 frame per second from Mux videos
  - Test: Frames saved for processing

- **Task 8.3.2**: Integrate AI detection classifier

  - Start: Frame extraction works
  - End: Frames analyzed by AI detector (Sensity/Amber/Custom)
  - Test: Each frame gets AI/real classification

- **Task 8.3.3**: Calculate AI ratio percentage

  - Start: Frame classification works
  - End: Overall video AI percentage calculated
  - Test: Accurate ratio stored in database

- **Task 8.3.4**: Implement 30% threshold enforcement

  - Start: AI ratio calculated
  - End: Videos <30% AI automatically rejected
  - Test: Only AI content passes moderation

- **Task 8.3.5**: Add frame sampling configuration

  - Start: Basic frame extraction works
  - End: Configurable sampling rate (frames per second)
  - Test: Different sampling rates produce accurate results

### 8.4 Moderation UI

- **Task 8.4.1**: Add upload status indicators

  - Start: Moderation status in API
  - End: Upload page shows processing/approved/rejected status
  - Test: Users see clear feedback on upload status

- **Task 8.4.2**: Filter approved videos in public listings
  - Start: Status indicators work
  - End: Only approved videos appear in public feeds
  - Test: Rejected videos don't appear in public areas

## Phase 9: Security Implementation

### 9.1 API Security

- **Task 9.1.1**: Implement rate limiting

  - Start: Fastify API running
  - End: Rate limits on all public endpoints
  - Test: Excessive requests properly throttled

- **Task 9.1.2**: Add input validation middleware

  - Start: Rate limiting works
  - End: All inputs validated and sanitized
  - Test: Malicious inputs rejected

- **Task 9.1.3**: Configure CORS properly

  - Start: Input validation works
  - End: CORS locked to frontend origins only
  - Test: Cross-origin requests properly handled

- **Task 9.1.4**: Implement security headers

  - Start: CORS configured
  - End: Security headers (HSTS, CSP, etc.) set
  - Test: Security scan shows proper headers

### 9.2 Authentication Security

- **Task 9.2.1**: Implement JWT refresh tokens

  - Start: Basic JWT auth works
  - End: Short-lived tokens with refresh mechanism
  - Test: Tokens expire and refresh properly

- **Task 9.2.2**: Add session management

  - Start: Refresh tokens work
  - End: Centralized session tracking across apps
  - Test: Sessions can be revoked

- **Task 9.2.3**: Implement webhook signature validation

  - Start: Sessions work
  - End: All webhooks (Mux, Hive) validated
  - Test: Invalid signatures rejected

## Phase 10: Recommendation Engine

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

## Phase 10: Mock to Real Data Transition

### 10.1 Data Fetching Infrastructure

- **Task 10.1.1**: Create API client utilities

  - Start: API endpoints exist
  - End: Centralized API client in packages/utils
  - Test: Client handles auth, errors, retries

- **Task 10.1.2**: Add React Query to Hub app

  - Start: API client exists
  - End: React Query configured with providers
  - Test: Basic query works with caching

- **Task 10.1.3**: Add React Query to Studio app

  - Start: Hub has React Query
  - End: Studio configured with React Query
  - Test: Data fetching with loading states

- **Task 10.1.4**: Create custom hooks for data fetching

  - Start: React Query configured
  - End: useUser, useVideos, useNotifications hooks
  - Test: Hooks return proper loading/error states

### 10.2 Component Migration - Hub

- **Task 10.2.1**: Migrate Header user data

  - Start: Header shows "Alex Neural"
  - End: Header shows real logged-in user
  - Test: Profile pic, name update dynamically

- **Task 10.2.2**: Migrate notifications to real data

  - Start: Hardcoded notification array
  - End: Real notifications from API
  - Test: New notifications appear in real-time

- **Task 10.2.3**: Migrate VideoCard/Grid components

  - Start: Mock video data
  - End: Videos fetched from API
  - Test: Pagination and filtering work

- **Task 10.2.4**: Add loading skeletons

  - Start: Components without loading states
  - End: Smooth skeleton loaders during fetch
  - Test: No layout shift when data loads

### 10.3 Component Migration - Studio

- **Task 10.3.1**: Migrate dashboard analytics

  - Start: Static chart data
  - End: Real metrics from API
  - Test: Charts update with date ranges

- **Task 10.3.2**: Migrate content management

  - Start: Mock video list
  - End: Creator's actual videos
  - Test: CRUD operations work

- **Task 10.3.3**: Add error boundaries

  - Start: No error handling
  - End: Graceful error states
  - Test: API failures don't crash app

### 10.4 Feature Flags & Rollout

- **Task 10.4.1**: Implement feature flag system

  - Start: All or nothing deployment
  - End: Gradual feature rollout capability
  - Test: Can toggle between mock and real

- **Task 10.4.2**: Create staging environment

  - Start: Local development only
  - End: Staging with real API, test data
  - Test: All flows work in staging

- **Task 10.4.3**: Production rollout plan

  - Start: Feature flags configured
  - End: Phased rollout to users
  - Test: Can rollback if issues occur

## Phase 11: Skeleton-to-Functional UI Audit

### 10.1 Comprehensive UI Consistency Review

- **Task 10.1.1**: Audit all hardcoded user data

  - Start: All core features implemented
  - End: Complete list of all hardcoded user information across both apps
  - Test: Documentation of every instance of mock/placeholder user data

- **Task 10.1.2**: Audit all hardcoded content data

  - Start: User data audit complete
  - End: Complete list of all hardcoded videos, comments, likes, etc.
  - Test: Documentation of every instance of mock/placeholder content

- **Task 10.1.3**: Audit visual inconsistencies

  - Start: Content data audit complete
  - End: List of all visual mismatches between different UI states
  - Test: Screenshots documenting inconsistencies (like profile icon vs dropdown)

### 10.2 Data Integration Fixes

- **Task 10.2.1**: Replace all hardcoded user references

  - Start: UI inconsistencies documented
  - End: All user data dynamically sourced from authentication/API
  - Test: No hardcoded usernames, emails, or IDs anywhere in the UI

- **Task 10.2.2**: Implement consistent avatar/profile image system

  - Start: User data dynamic
  - End: User avatars consistent across all components and states
  - Test: Profile image matches between header icon, dropdowns, and profile pages

- **Task 10.2.3**: Remove all placeholder content

  - Start: Avatar system consistent
  - End: All video, comment, and notification data sourced from APIs
  - Test: No "Alex Neural" or other placeholder names/content visible

### 10.3 Loading States & Error Handling

- **Task 10.3.1**: Add loading states for all dynamic content

  - Start: Placeholder content removed
  - End: Proper loading skeletons/spinners for all API-dependent UI
  - Test: Graceful loading states when data is being fetched

- **Task 10.3.2**: Add empty states for all lists/grids

  - Start: Loading states implemented
  - End: Appropriate empty states when users have no content
  - Test: Empty video lists, notifications, etc. show helpful empty states

- **Task 10.3.3**: Add error states for failed API calls

  - Start: Empty states implemented
  - End: Error handling and retry mechanisms for all API failures
  - Test: Network errors display user-friendly error messages

## Phase 11: Testing Infrastructure

### 11.1 Unit Testing Setup

- **Task 11.1.1**: Set up testing framework for Hub app

  - Start: No testing infrastructure
  - End: Jest and React Testing Library configured
  - Test: Sample test runs successfully

- **Task 11.1.2**: Set up testing framework for Studio app

  - Start: No testing infrastructure
  - End: Jest and React Testing Library configured
  - Test: Sample test runs successfully

- **Task 11.1.3**: Write component tests for UI library

  - Start: Testing frameworks configured
  - End: All UI components have basic unit tests
  - Test: Component tests pass with coverage > 80%

### 11.2 Integration Testing

- **Task 11.2.1**: Write API integration tests

  - Start: Unit tests complete
  - End: Core API endpoints have integration tests
  - Test: Test suite runs successfully

- **Task 11.2.2**: Write cross-app integration tests

  - Start: API tests exist
  - End: SSO and navigation flows tested
  - Test: Cross-app workflows verified

### 11.3 E2E Testing

- **Task 11.3.1**: Set up Playwright for E2E testing

  - Start: Integration tests complete
  - End: Playwright configured for both apps
  - Test: Basic E2E test runs successfully

- **Task 11.3.2**: Write critical user journey tests

  - Start: Playwright configured
  - End: Sign up, upload, view video flows tested
  - Test: All critical paths have E2E coverage

## Phase 12: DevOps & Deployment

### 12.1 CI/CD Pipeline

- **Task 12.1.1**: Set up GitHub Actions for CI

  - Start: No CI configuration
  - End: Automated testing on pull requests
  - Test: CI runs on every PR

- **Task 12.1.2**: Configure deployment pipeline

  - Start: CI working
  - End: Automated deployment to staging/production
  - Test: Deployments triggered by merges

### 12.2 Infrastructure Setup

- **Task 12.2.1**: Configure production environments

  - Start: Local development only
  - End: Production infrastructure provisioned
  - Test: Both apps accessible on production URLs

- **Task 12.2.2**: Set up monitoring and logging

  - Start: No monitoring
  - End: Error tracking, performance monitoring active
  - Test: Alerts configured for critical issues

### 12.3 Performance Optimization

- **Task 12.3.1**: Implement code splitting

  - Start: Large bundle sizes
  - End: Dynamic imports for route-based splitting
  - Test: Initial bundle size < 200KB

- **Task 12.3.2**: Add caching strategies

  - Start: No caching
  - End: CDN, browser, and API caching configured
  - Test: Performance metrics improved

- **Task 12.3.3**: Optimize images and assets

  - Start: Unoptimized assets
  - End: Image optimization, lazy loading implemented
  - Test: Lighthouse scores > 90

## Phase 13: Monitoring & Observability

### 13.1 Datadog Setup

- **Task 13.1.1**: Install Datadog agent

  - Start: Production infrastructure ready
  - End: Datadog agent running on all services
  - Test: Basic metrics visible in Datadog

- **Task 13.1.2**: Configure custom metrics

  - Start: Agent installed
  - End: Business metrics (uploads, views) tracked
  - Test: Custom dashboards show real data

- **Task 13.1.3**: Set up distributed tracing

  - Start: Custom metrics work
  - End: Request traces across all services
  - Test: Can trace requests from frontend to backend

### 13.2 Logging Infrastructure

- **Task 13.2.1**: Configure centralized logging

  - Start: Services running
  - End: All logs aggregated in central location
  - Test: Can search logs across services

- **Task 13.2.2**: Implement structured logging

  - Start: Central logging works
  - End: Logs in JSON format with context
  - Test: Can filter logs by request ID

- **Task 13.2.3**: Set up alerts

  - Start: Structured logging works
  - End: Alerts for errors, performance issues
  - Test: Alerts trigger on test conditions

---

## Testing Strategy for Each Task

For every task, verify completion using these methods:

1. **Unit Tests**: Where applicable, write tests that verify the specific functionality
2. **Manual Testing**: Use curl, Postman, or browser to verify endpoints work
3. **Integration Testing**: Ensure the feature works with existing components
4. **Error Case Testing**: Verify proper handling of invalid inputs/edge cases

## Success Criteria

The MVP is complete when:

- Users can sign up on either Hub or Studio with SSO between apps
- Authenticated users see Upload button, unauthenticated see Sign In
- Upload button seamlessly redirects authenticated users to Studio
- Users can create channels and upload videos in Studio
- Videos uploaded in Studio appear in Hub for viewing
- Videos are automatically moderated for content and AI ratio
- Basic social features (likes, comments, subscriptions) work
- Trending and recommendation systems provide relevant content
- Both applications are production-ready with proper error handling

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
