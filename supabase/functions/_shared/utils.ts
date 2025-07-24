/**
 * EXPENSESINK Shared Utilities
 * ============================
 * Common functions used across Edge Functions
 */

import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { ApiError, ApiResponse, ResponseMetadata, ValidationError, ValidationResult } from './types.ts'

// CORS Headers
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

/**
 * Create authenticated Supabase client
 */
export function createSupabaseClient(): SupabaseClient {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }
  
  return createClient(supabaseUrl, supabaseKey)
}

/**
 * Handle CORS preflight requests
 */
export function handleCors(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  return null
}

/**
 * Create standardized API response
 */
export function createApiResponse<T>(
  data?: T,
  error?: ApiError,
  status: number = 200
): Response {
  const metadata: ResponseMetadata = {
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  }
  
  const response: ApiResponse<T> = {
    data,
    error,
    metadata,
  }
  
  return new Response(
    JSON.stringify(response),
    {
      status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    }
  )
}

/**
 * Create error response
 */
export function errorResponse(
  message: string,
  code: string = 'INTERNAL_ERROR',
  status: number = 500,
  details?: Record<string, any>
): Response {
  const error: ApiError = {
    code,
    message,
    details,
  }
  
  return createApiResponse(undefined, error, status)
}

/**
 * Parse and validate JSON body
 */
export async function parseJsonBody<T>(req: Request): Promise<T | null> {
  try {
    const body = await req.json()
    return body as T
  } catch (error) {
    return null
  }
}

/**
 * Get URL parameters
 */
export function getUrlParams(req: Request): URLSearchParams {
  const url = new URL(req.url)
  return url.searchParams
}

/**
 * Parse pagination parameters
 */
export function getPaginationParams(params: URLSearchParams): {
  limit: number
  offset: number
  page: number
} {
  const page = Math.max(1, parseInt(params.get('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(params.get('limit') || '20')))
  const offset = (page - 1) * limit
  
  return { limit, offset, page }
}

/**
 * Parse date range parameters
 */
export function getDateRangeParams(params: URLSearchParams): {
  start_date: Date | null
  end_date: Date | null
} {
  const start = params.get('start_date')
  const end = params.get('end_date')
  
  return {
    start_date: start ? new Date(start) : null,
    end_date: end ? new Date(end) : null,
  }
}

/**
 * Validate required fields
 */
export function validateRequired(
  data: Record<string, any>,
  fields: string[]
): ValidationResult {
  const errors: ValidationError[] = []
  
  for (const field of fields) {
    if (!data[field]) {
      errors.push({
        field,
        message: `${field} is required`,
        code: 'REQUIRED_FIELD',
      })
    }
  }
  
  return {
    is_valid: errors.length === 0,
    errors,
  }
}

/**
 * Validate amount
 */
export function validateAmount(amount: any): ValidationResult {
  const errors: ValidationError[] = []
  
  if (amount === undefined || amount === null) {
    errors.push({
      field: 'amount',
      message: 'Amount is required',
      code: 'REQUIRED_FIELD',
    })
  } else if (typeof amount !== 'number' || isNaN(amount)) {
    errors.push({
      field: 'amount',
      message: 'Amount must be a valid number',
      code: 'INVALID_TYPE',
    })
  } else if (amount <= 0) {
    errors.push({
      field: 'amount',
      message: 'Amount must be greater than 0',
      code: 'INVALID_VALUE',
    })
  } else if (amount > 1000000) {
    errors.push({
      field: 'amount',
      message: 'Amount exceeds maximum allowed value',
      code: 'INVALID_VALUE',
    })
  }
  
  return {
    is_valid: errors.length === 0,
    errors,
  }
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

/**
 * Get week date range
 */
export function getWeekDateRange(date: Date = new Date()): {
  start: Date
  end: Date
} {
  const day = date.getDay()
  const diff = date.getDate() - day
  
  const start = new Date(date)
  start.setDate(diff)
  start.setHours(0, 0, 0, 0)
  
  const end = new Date(date)
  end.setDate(diff + 6)
  end.setHours(23, 59, 59, 999)
  
  return { start, end }
}

/**
 * Log error with context
 */
export function logError(context: string, error: any): void {
  console.error(`[${context}] Error:`, {
    message: error.message || error,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  })
}
