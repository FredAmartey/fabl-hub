import { z } from 'zod'

// Video validation schemas
export const videoMetadataSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(5000).optional(),
  tags: z.array(z.string()).max(15).optional(),
  category: z.string().optional(),
  visibility: z.enum(['DRAFT', 'PROCESSING', 'PUBLISHED', 'SCHEDULED', 'UNLISTED', 'PRIVATE']),
  monetizationEnabled: z.boolean().optional(),
  scheduledAt: z.date().optional(),
})

// Comment validation schemas
export const createCommentSchema = z.object({
  videoId: z.string().cuid(),
  content: z.string().min(1).max(500),
  parentId: z.string().cuid().optional(),
})

// Upload validation schemas
export const uploadRequestSchema = z.object({
  fileName: z.string().min(1),
  fileSize: z.number().positive().max(5 * 1024 * 1024 * 1024), // 5GB max
  mimeType: z.string().regex(/^video\/.+/),
})

// Pagination validation
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
})

// Video params validation
export const videoParamsSchema = paginationSchema.extend({
  status: z.string().optional(),
  search: z.string().optional(),
  orderBy: z.enum(['views', 'createdAt', 'likes']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
})

// Analytics period validation
export const analyticsPeriodSchema = z.object({
  period: z.enum(['7d', '28d', '90d', '365d', 'lifetime']),
})

// Transaction filter validation
export const transactionFilterSchema = z.object({
  period: z.enum(['day', 'week', 'month', 'year', 'all']),
  type: z.enum(['AD_REVENUE', 'SUBSCRIPTION', 'TIP', 'MERCHANDISE', 'PREMIUM_CONTENT']).optional(),
  status: z.enum(['PENDING', 'PAID', 'FAILED']).optional(),
})

// Notification validation
export const notificationTypeSchema = z.enum([
  'LIKE',
  'COMMENT',
  'SUBSCRIBE',
  'UPLOAD',
  'MENTION',
  'MILESTONE'
])

// Utility functions
export function validateAndSanitize<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  return schema.parse(data)
}

export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error }
}