# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fabl Hub is a video content platform for AI-generated videos. Built with Next.js 15, React 19, and TypeScript for optimal performance and SEO.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

## Architecture

### Current Stack
- **Framework**: Next.js 15 with App Router
- **UI**: React 19 + TypeScript
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Font Optimization**: Next/font with Inter and Afacad

### Planned Backend Architecture
- **Frontend**: Next.js with SSR
- **Backend**: Fastify + PostgreSQL + Prisma
- **Video Infrastructure**: Mux (upload, storage, streaming)
- **Authentication**: Clerk
- **AI Moderation**: Hive API for NSFW detection
- **Queue**: BullMQ (Redis-based)

### Component Structure
```
/src
├── /app                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with fonts
│   ├── page.tsx           # Home page
│   ├── video/[id]/        # Dynamic video pages
│   ├── category/[slug]/   # Dynamic category pages
│   └── [other routes]
├── /components
│   ├── ClientLayout.tsx   # Client-side layout wrapper
│   ├── AnimatedBackground.tsx
│   ├── Button.tsx
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── VideoCard.tsx
│   └── VideoGrid.tsx
```

## Key Implementation Details

### AI Content Policy
All videos must be ≥30% AI-generated. Backend detection pipeline:
1. Frame extraction (1fps)
2. AI/synthetic detection per frame
3. Ratio calculation and enforcement
4. No user-facing metadata required

### Video Management
- Direct uploads via Mux
- HLS streaming delivery
- Automatic transcoding
- Global CDN distribution

### Routing
- Uses Next.js 15 App Router with file-based routing
- Dynamic routes for videos (`/video/[id]`) and categories (`/category/[slug]`)
- All components marked with `"use client"` for interactivity
- Prefetching enabled on Link components for performance

## Code Standards

- TypeScript strict mode enabled
- ESLint for code quality
- Component-based architecture
- Responsive design with TailwindCSS breakpoints
- No comments unless explicitly requested