# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fabl Hub is a video content platform for AI-generated videos. Built with Next.js 15, React 19, and TypeScript for optimal performance and SEO.

## Implementation Best Practices

### 0 — Purpose  

These rules ensure maintainability, safety, and developer velocity. 
**MUST** rules are enforced; **SHOULD** rules are strongly recommended.

---

### 1 — Before Coding

- **BP-1 (MUST)** Ask the user clarifying questions.
- **BP-2 (SHOULD)** Draft and confirm an approach for complex work.  
- **BP-3 (SHOULD)** If ≥ 2 approaches exist, list clear pros and cons.

---

### 2 — While Coding

- **C-1 (SHOULD)** Write failing test first when implementing new features.
- **C-2 (MUST)** Name functions consistently with existing codebase patterns.  
- **C-3 (SHOULD NOT)** Introduce classes when small testable functions suffice.  
- **C-4 (SHOULD)** Prefer simple, composable, testable functions.
- **C-5 (MUST)** Use proper TypeScript types for all parameters and returns.
- **C-6 (MUST)** Use `import type { … }` for type-only imports.
- **C-7 (SHOULD NOT)** Add comments except for critical caveats; rely on self‑explanatory code.
- **C-8 (SHOULD)** Default to `type`; use `interface` only when extending or for better readability.
- **C-9 (SHOULD NOT)** Extract a new function unless it will be reused, improves testability, or drastically improves readability.
- **C-10 (MUST)** Use Next.js Image component for optimized image loading where applicable.
- **C-11 (MUST)** Mark interactive components with `"use client"` directive.
- **C-12 (SHOULD)** Enable prefetching on Link components for better performance.

---

### 3 — Testing

- **T-1 (MUST)** Add tests for new features and bug fixes.
- **T-2 (SHOULD)** Colocate unit tests in `*.test.ts` or `*.spec.ts` files.
- **T-3 (MUST)** Test both happy path and edge cases.
- **T-4 (SHOULD)** Prefer integration tests over heavy mocking.  
- **T-5 (SHOULD)** Test the entire structure in one assertion when possible.

---

### 4 — Next.js Specific

- **N-1 (MUST)** Use App Router patterns (not Pages Router).
- **N-2 (MUST)** Handle dynamic params with Next.js 15's promise-based params.
- **N-3 (SHOULD)** Optimize fonts using next/font.
- **N-4 (SHOULD)** Use proper metadata exports for SEO.
- **N-5 (MUST)** Handle loading and error states properly.

---

### 5 — Code Organization

- **O-1 (MUST)** Place pages in `/src/app` following Next.js conventions.
- **O-2 (MUST)** Place shared components in `/src/components`.
- **O-3 (SHOULD)** Group related components in subdirectories.
- **O-4 (MUST)** Use absolute imports when possible.

---

### 6 — Tooling Gates

- **G-1 (MUST)** `npm run lint` passes.  
- **G-2 (MUST)** `npm run build` succeeds without errors.
- **G-3 (SHOULD)** No TypeScript errors or warnings.

---

### 7 - Git

- **GH-1 (MUST)** Use Conventional Commits format: https://www.conventionalcommits.org/en/v1.0.0
- **GH-2 (SHOULD NOT)** Refer to Claude or Anthropic in commit messages.
- **GH-3 (SHOULD)** Keep commits focused and atomic.

---

## Remember Shortcuts

Remember the following shortcuts which the user may invoke at any time.

### QNEW

When I type "qnew", this means:
```
Understand all BEST PRACTICES listed in CLAUDE.md.
Your code SHOULD ALWAYS follow these best practices.
```

### QPLAN

When I type "qplan", this means:
```
Analyze similar parts of the codebase and determine whether your plan:
- is consistent with rest of codebase
- introduces minimal changes
- reuses existing code and patterns
- follows Next.js best practices
```

### QCODE

When I type "qcode", this means:
```
Implement your plan following all best practices.
Run `npm run lint` to ensure code quality.
Run `npm run build` to ensure no build errors.
Test the implementation in the browser.
```

### QCHECK

When I type "qcheck", this means:
```
You are a SKEPTICAL senior software engineer.
Review the code changes for:
1. Adherence to CLAUDE.md best practices
2. Next.js best practices and patterns
3. TypeScript type safety
4. Component reusability and maintainability
5. Performance considerations
```

### QUX

When I type "qux", this means:
```
Imagine you are a human UX tester of the feature you implemented.
Output a comprehensive list of scenarios you would test, sorted by highest priority.
Include mobile responsiveness, accessibility, and edge cases.
```

### QGIT

When I type "qgit", this means:
```
Add all changes to staging, create a commit, and push to remote.

Follow Conventional Commits format:
- feat: new feature
- fix: bug fix
- docs: documentation changes
- style: formatting changes
- refactor: code restructuring
- test: test additions/changes
- chore: maintenance tasks

Example: feat: add AI content moderation pipeline
```

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