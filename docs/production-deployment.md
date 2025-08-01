# Production Deployment Guide

This guide covers deploying the Fabl platform to production with proper security, performance, and reliability configurations.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Redis Setup](#redis-setup)
- [Application Deployment](#application-deployment)
- [Security Configuration](#security-configuration)
- [Monitoring](#monitoring)
- [Performance Optimization](#performance-optimization)

## Prerequisites

### Required Services

1. **PostgreSQL Database** (v14+)
   - Managed service recommended (AWS RDS, Google Cloud SQL, Supabase)
   - Connection pooling enabled
   - Backup strategy in place

2. **Redis Instance** (v6+)
   - Required for background job queues
   - Managed service recommended (AWS ElastiCache, Redis Cloud)
   - Persistence enabled

3. **Mux Account**
   - Video streaming and encoding
   - Production API keys
   - Webhook endpoints configured

4. **Clerk Account**
   - User authentication
   - Production instance configured
   - JWT templates set up

5. **Domain & SSL**
   - Primary domain (e.g., fabl.tv)
   - Studio subdomain (e.g., studio.fabl.tv)
   - API subdomain (e.g., api.fabl.tv)
   - Valid SSL certificates

## Environment Variables

### 1. Copy Production Template

```bash
cp .env.production.example .env.production
```

### 2. Configure Required Variables

Update `.env.production` with your actual production values:

#### Database
```env
DATABASE_URL="postgresql://username:password@your-db-host:5432/fabl_prod"
```

#### Authentication
```env
CLERK_SECRET_KEY=sk_live_your_actual_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_actual_key
```

#### Video Infrastructure
```env
MUX_TOKEN_ID=your_production_mux_token_id
MUX_TOKEN_SECRET=your_production_mux_token_secret
```

#### Redis
```env
REDIS_URL=redis://your-redis-host:6379
```

#### URLs
```env
HUB_URL=https://fabl.tv
STUDIO_URL=https://studio.fabl.tv
NEXT_PUBLIC_API_URL=https://api.fabl.tv
```

### 3. App-Specific Configuration

#### API (apps/api)
Create `apps/api/.env.production`:
```env
NODE_ENV=production
PORT=3002
HOST=0.0.0.0
LOG_LEVEL=warn
DATABASE_URL="..."
REDIS_URL="..."
# ... other API vars
```

#### Hub (apps/hub)
Create `apps/hub/.env.production`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_API_URL=https://api.fabl.tv
NEXT_PUBLIC_STUDIO_URL=https://studio.fabl.tv
# ... other Hub vars
```

#### Studio (apps/studio)
Create `apps/studio/.env.production`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_API_URL=https://api.fabl.tv
NEXT_PUBLIC_HUB_URL=https://fabl.tv
# ... other Studio vars
```

## Database Setup

### 1. Create Production Database

```sql
CREATE DATABASE fabl_prod;
CREATE USER fabl_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE fabl_prod TO fabl_user;
```

### 2. Run Migrations

```bash
cd packages/db
npm run db:deploy
```

### 3. Seed Initial Data (if needed)

```bash
npm run db:seed:prod
```

### 4. Configure Connection Pooling

Update database connection string with pooling:
```env
DATABASE_URL="postgresql://username:password@host:5432/fabl_prod?pgbouncer=true&connection_limit=20"
```

## Redis Setup

### 1. Configure Redis Instance

- Enable persistence (AOF + RDB)
- Set memory policy: `allkeys-lru`
- Configure appropriate memory limit
- Enable monitoring

### 2. Test Connection

```bash
redis-cli -u $REDIS_URL ping
```

## Application Deployment

### Option 1: Docker Deployment

#### 1. Build Production Images

```bash
# Build API
docker build -f apps/api/Dockerfile -t fabl-api:prod .

# Build Hub
docker build -f apps/hub/Dockerfile -t fabl-hub:prod .

# Build Studio
docker build -f apps/studio/Dockerfile -t fabl-studio:prod .
```

#### 2. Run with Docker Compose

```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  api:
    image: fabl-api:prod
    ports:
      - "3002:3002"
    env_file:
      - apps/api/.env.production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3002/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  hub:
    image: fabl-hub:prod
    ports:
      - "3000:3000"
    env_file:
      - apps/hub/.env.production
    depends_on:
      - api
    restart: unless-stopped

  studio:
    image: fabl-studio:prod
    ports:
      - "3001:3001"
    env_file:
      - apps/studio/.env.production
    depends_on:
      - api
    restart: unless-stopped
```

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Option 2: Platform Deployment (Vercel/Railway/etc.)

#### Vercel Deployment

1. **Deploy Hub**:
   ```bash
   cd apps/hub
   vercel --prod
   ```

2. **Deploy Studio**:
   ```bash
   cd apps/studio
   vercel --prod
   ```

3. **Deploy API** (Use Railway/Render for Node.js):
   ```bash
   cd apps/api
   # Deploy to your preferred platform
   ```

## Security Configuration

### 1. API Security Headers

```javascript
// apps/api/src/server.ts
await fastify.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "https://clerk.fabl.tv"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.clerk.fabl.tv"],
    },
  },
});
```

### 2. CORS Configuration

```javascript
await fastify.register(cors, {
  origin: [
    process.env.HUB_URL,
    process.env.STUDIO_URL,
  ],
  credentials: true,
});
```

### 3. Rate Limiting

```javascript
await fastify.register(rateLimit, {
  max: 100,
  timeWindow: '15 minutes',
});
```

### 4. Environment Secrets

Never commit actual production secrets. Use platform-specific secret management:

- **Vercel**: Environment Variables in dashboard
- **Railway**: Environment Variables in dashboard  
- **Docker**: Docker secrets or external secret management
- **Kubernetes**: Kubernetes secrets

## Monitoring

### 1. Health Checks

Each app should have health check endpoints:

```typescript
// API health check
fastify.get('/health', async () => {
  return { 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: await checkDatabaseConnection(),
    redis: await checkRedisConnection(),
  };
});
```

### 2. Error Monitoring (Optional)

#### Configure Sentry

```bash
npm install @sentry/node @sentry/nextjs
```

```javascript
// apps/api/src/server.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: 'production',
});
```

### 3. Performance Monitoring (Optional)

#### Configure OpenTelemetry

```javascript
import { NodeSDK } from '@opentelemetry/sdk-node';

const sdk = new NodeSDK({
  serviceName: 'fabl-api',
  // Configure exporters
});

sdk.start();
```

## Performance Optimization

### 1. Database Optimization

- **Connection Pooling**: Use pgbouncer or built-in pooling
- **Indexes**: Ensure proper indexes on frequently queried columns
- **Query Optimization**: Use EXPLAIN ANALYZE for slow queries

### 2. Redis Optimization

- **Memory Management**: Set appropriate `maxmemory` and `maxmemory-policy`
- **Persistence**: Configure AOF for durability
- **Monitoring**: Monitor memory usage and connection counts

### 3. Application Optimization

#### API Optimizations

```javascript
// Enable compression
await fastify.register(compress);

// Add response caching
await fastify.register(cache, {
  privacy: 'private',
  expiresIn: 300, // 5 minutes
});
```

#### Next.js Optimizations

```javascript
// next.config.ts
const nextConfig = {
  // Enable compression
  compress: true,
  
  // Optimize images
  images: {
    domains: ['images.unsplash.com', 'mux.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Enable experimental features
  experimental: {
    optimizeCss: true,
  },
};
```

### 4. CDN Configuration

Configure CDN for static assets:

```javascript
// next.config.ts
const nextConfig = {
  assetPrefix: process.env.CDN_URL || '',
  images: {
    loader: process.env.CDN_URL ? 'custom' : 'default',
    path: process.env.CDN_URL || '',
  },
};
```

## Deployment Checklist

### Pre-Deployment

- [ ] All environment variables configured
- [ ] Database migrations run
- [ ] SSL certificates installed
- [ ] DNS records configured
- [ ] Health checks implemented
- [ ] Error monitoring configured
- [ ] Backup strategy in place

### Post-Deployment

- [ ] All services healthy
- [ ] Authentication working
- [ ] Video upload/playback working
- [ ] Database queries performing well
- [ ] Redis queues processing
- [ ] Error rates within acceptable limits
- [ ] Performance metrics looking good

### Ongoing Maintenance

- [ ] Monitor error rates and performance
- [ ] Regular database backups
- [ ] Security updates applied
- [ ] Capacity planning based on usage
- [ ] Log analysis for issues

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Check connection string format
   - Verify firewall rules
   - Test connection pooling settings

2. **Authentication Issues**
   - Verify Clerk production keys
   - Check CORS configuration
   - Validate JWT token format

3. **Video Upload Issues**
   - Verify Mux production credentials
   - Check file size limits
   - Monitor upload queues

4. **Performance Issues**
   - Check database query performance
   - Monitor Redis memory usage
   - Analyze CDN cache hit rates

### Support

For deployment issues:
1. Check application logs
2. Verify environment variables
3. Test individual service health
4. Check external service status
5. Review monitoring dashboards