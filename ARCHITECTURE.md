# Fabl Architecture

This repository contains two **completely separate** Next.js applications that work together to provide a complete video platform experience.

## 1. Fabl Hub (fabl.tv)
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

## 2. Fabl Studio (studio.fabl.tv)
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

## Running the Applications

### Run Main App Only
```bash
npm run dev
```
Visit: http://localhost:3000

### Run Studio Only
```bash
npm run dev:studio
```
Visit: http://localhost:3001

### Run Both Applications
```bash
npm run dev:all
```
- Main app: http://localhost:3000
- Studio: http://localhost:3001

## Architecture Benefits

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

## Directory Structure

```
fabl-monorepo/
├── apps/
│   ├── hub/               # Main viewing app
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── ...config files
│   └── studio/            # Creator dashboard app
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── ...config files
├── package.json           # Root monorepo scripts
└── ARCHITECTURE.md        # This file
```

## Authentication Flow

### User Journey
1. **Unauthenticated State**: 
   - Hub app shows "Sign In" button in header
   - No access to Upload, Notifications, or Profile features
   - Can browse and watch public videos

2. **Authenticated State**:
   - Hub app shows Upload button, Notifications bell, and Profile dropdown
   - "Upload" button redirects to Studio app with authentication preserved
   - Single sign-on (SSO) between Hub and Studio apps

### Cross-App Authentication
- Both apps share authentication state
- When user clicks "Upload" on Hub:
  - If authenticated: Redirect to `studio.fabl.tv` with auth token
  - If not authenticated: Show sign-in modal, then redirect after login
- Studio validates authentication on load
- Sessions persist across both applications

## Environment Configuration

### Hub App (`/apps/hub/.env.local`)
```env
NEXT_PUBLIC_STUDIO_URL=http://localhost:3001  # Development
# NEXT_PUBLIC_STUDIO_URL=https://studio.fabl.tv  # Production
```

### Studio App (`/apps/studio/.env.local`)
```env
NEXT_PUBLIC_HUB_URL=http://localhost:3000  # Development
# NEXT_PUBLIC_HUB_URL=https://fabl.tv  # Production
```

## Navigation Flow

### Upload Flow
1. User clicks "Upload" button in Hub header
2. System checks authentication status
3. If authenticated: Opens Studio in new tab at upload page
4. If not authenticated: Shows sign-in modal → authenticates → redirects to Studio

### Header Components
- **Signed Out**: Logo | Search | Sign In button
- **Signed In**: Logo | Search | Upload button | Notifications | Profile

## Future Considerations

- Deploy main app to `fabl.tv`
- Deploy studio to `studio.fabl.tv`
- Implement shared authentication service
- Consider using Turborepo for better monorepo management
- Implement shared component library if needed
- Add OAuth providers (Google, GitHub, etc.)
- Implement JWT-based authentication with refresh tokens
- Add CORS configuration for cross-origin requests