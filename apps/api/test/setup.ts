import { PrismaClient } from '@fabl/db'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'
import { Redis } from 'ioredis'

// Mock Prisma
jest.mock('@fabl/db', () => ({
  __esModule: true,
  PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
}))

export const mockPrisma = mockDeep<PrismaClient>()

// Mock Redis
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn(),
    setex: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
    pipeline: jest.fn().mockReturnValue({
      get: jest.fn(),
      exec: jest.fn().mockResolvedValue([])
    }),
    connect: jest.fn(),
    disconnect: jest.fn(),
    on: jest.fn()
  }))
})

// Mock Clerk authentication
jest.mock('@clerk/fastify', () => ({
  clerkPlugin: jest.fn(),
  getAuth: jest.fn().mockReturnValue({
    userId: 'test-user-id',
    sessionId: 'test-session-id',
    orgId: null,
    orgRole: null,
    orgSlug: null
  })
}))

// Mock environment variables
process.env.NODE_ENV = 'test'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
process.env.CLERK_SECRET_KEY = 'test-clerk-secret'
process.env.REDIS_URL = 'redis://localhost:6379'

beforeEach(() => {
  mockReset(mockPrisma)
})

// Test data factories
export const createMockVideo = (overrides: any = {}) => ({
  id: 'video-1',
  title: 'Test Video',
  description: 'Test Description',
  creatorId: 'user-1',
  status: 'PUBLISHED',
  isApproved: true,
  views: 100,
  duration: 300,
  thumbnailUrl: 'https://example.com/thumb.jpg',
  muxPlaybackId: 'mux-123',
  videoUrl: 'https://example.com/video.mp4',
  createdAt: new Date('2024-01-01'),
  publishedAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides
})

export const createMockUser = (overrides: any = {}) => ({
  id: 'user-1',
  name: 'Test User',
  username: 'testuser',
  email: 'test@example.com',
  avatarUrl: 'https://example.com/avatar.jpg',
  subscriberCount: 50,
  isVerified: false,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides
})

export const createMockComment = (overrides: any = {}) => ({
  id: 'comment-1',
  content: 'Test comment',
  videoId: 'video-1',
  userId: 'user-1',
  parentId: null,
  likes: 5,
  isHearted: false,
  isPinned: false,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides
})

// Helper to create mock Fastify instance
export const createMockFastify = () => ({
  db: mockPrisma,
  log: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  },
  cache: {
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
    flush: jest.fn(),
    getRedis: jest.fn().mockReturnValue({
      get: jest.fn(),
      setex: jest.fn(),
      del: jest.fn(),
      keys: jest.fn()
    })
  },
  requireAuth: jest.fn().mockReturnValue('test-user-id')
})