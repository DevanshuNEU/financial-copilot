// Main Financial Service - Automatically switches between Local and Supabase
import type { IFinancialService } from '../types/services'
import { databaseConfig } from '../config/database'
import { LocalFinancialService } from './financialService.local'
import { SupabaseFinancialService } from './financialService.supabase'

// Create service instances
const localService = new LocalFinancialService()
const supabaseService = new SupabaseFinancialService()

// Service factory - returns the appropriate service based on config
function createFinancialService(): IFinancialService {
  if (databaseConfig.mode === 'local') {
    console.log('🗄️ Using LOCAL financial service')
    return localService
  } else {
    console.log('🗄️ Using SUPABASE financial service')
    return supabaseService
  }
}

// Export the active service
export const financialService = createFinancialService()

// Export individual services for direct access if needed
export { localService, supabaseService }

// Export service types for TypeScript
export type { IFinancialService } from '../types/services'
export type { OnboardingData, PersonalizedSafeToSpend } from '../types/services'
