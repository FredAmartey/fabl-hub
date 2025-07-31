import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { Prisma } from '@fabl/db'

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { log } = request

  // Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return reply.status(409).send({
          error: 'Conflict',
          message: 'A record with this data already exists',
          statusCode: 409
        })
      case 'P2025':
        return reply.status(404).send({
          error: 'Not Found',
          message: 'The requested record was not found',
          statusCode: 404
        })
      default:
        log.error({ error }, 'Prisma error')
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Database operation failed',
          statusCode: 500
        })
    }
  }

  // Handle validation errors
  if (error.validation) {
    return reply.status(400).send({
      error: 'Validation Error',
      message: 'Invalid request data',
      details: error.validation,
      statusCode: 400
    })
  }

  // Handle known HTTP errors
  if (error.statusCode) {
    return reply.status(error.statusCode).send({
      error: error.name || 'HTTP Error',
      message: error.message,
      statusCode: error.statusCode
    })
  }

  // Log unknown errors
  log.error({ error }, 'Unhandled error')

  // Default error response
  return reply.status(500).send({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
    statusCode: 500
  })
}