/**
 * Authentication Helpers for EXPENSESINK Edge Functions
 * Validates user authentication and returns user info
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export interface AuthUser {
  id: string
  email?: string
}

/**
 * Verify user authentication from request
 * @returns AuthUser object or throws error
 */
export async function authenticateUser(req: Request): Promise<AuthUser> {
  // Get authorization header
  const authHeader = req.headers.get('Authorization')
  
  if (!authHeader) {
    throw new Error('Missing authorization header')
  }

  // Extract token
  const token = authHeader.replace('Bearer ', '').trim()
  
  if (!token) {
    throw new Error('Invalid authorization token')
  }

  // Create Supabase client with user token
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
  
  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: authHeader } }
  })

  // Verify user
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    throw new Error('Invalid or expired token')
  }

  return {
    id: user.id,
    email: user.email
  }
}

/**
 * Create authenticated Supabase client for user
 */
export function createAuthenticatedClient(authHeader: string) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
  
  return createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: authHeader } }
  })
}
