# Fabl Studio

A separate Next.js application for content creators to manage their videos, analytics, and channel settings.

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The studio app runs on http://localhost:3001 (or studio.localhost:3001 if you set up subdomain routing).

## Architecture

This is a completely separate Next.js application from the main Fabl app. It has:

- Its own package.json and dependencies
- Separate routing and pages
- Independent components and styling
- Custom Tailwind configuration
- Dedicated port (3001)

## Features

- **Dashboard**: Overview of channel performance
- **Content Library**: Manage videos
- **Analytics**: Detailed performance metrics
- **Comments**: Moderate and engage with community
- **Subtitles**: Manage video captions
- **Monetization**: Track earnings
- **Settings**: Configure channel preferences

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Radix UI components