/**
 * Error Handling Utilities for EXPENSESINK Edge Functions
 */

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Standard error response
 */
export function errorResponse(
  error: Error | ApiError,
  context: string
): Response {
  console.error(`❌ Error in ${context}:`, error)

  const statusCode = error instanceof ApiError ? error.statusCode : 500
  const code = error instanceof ApiError ? error.code : 'INTERNAL_ERROR'

  return new Response(
    JSON.stringify({
      error: error.message,
      code,
      context,
      timestamp: new Date().toISOString()
    }),
    {
      status: statusCode,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
}

/**
 * Success response
 */
export function successResponse(
  data: any,
  statusCode: number = 200
): Response {
  return new Response(
    JSON.stringify(data),
    {
      status: statusCode,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
}

/**
 * Authentication error (401)
 */
export function authError(message: string = 'Unauthorized'): Response {
  return new Response(
    JSON.stringify({
      error: message,
      code: 'UNAUTHORIZED',
      timestamp: new Date().toISOString()
    }),
    {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
}

/**
 * Validation error (400)
 */
export function validationError(message: string, details?: any): Response {
  return new Response(
    JSON.stringify({
      error: message,
      code: 'VALIDATION_ERROR',
      details,
      timestamp: new Date().toISOString()
    }),
    {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
}
