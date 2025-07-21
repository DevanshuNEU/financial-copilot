// Main Financial Service - Automatically switches between Local and Flask API
import type { IFinancialService } from '../types/services'
import { databaseConfig } from '../config/database'
import { LocalFinancialService } from './financialService.local'
import { ApiFinancialService } from './financialService.api'

// Create service instances
const localService = new LocalFinancialService()
const apiService = new ApiFinancialService()

// Service factory - returns the appropriate service based on config
function createFinancialService(): IFinancialService {
  if (databaseConfig.mode === 'local') {
    console.log('🗄️ Using LOCAL financial service')
    return localService
  } else {
    console.log('🚀 Using FLASK API financial service')
    return apiService
  }
}

// Export the active service
export const financialService = createFinancialService()

// Export individual services for direct access if needed
export { localService, apiService }

// Export service types for TypeScript
export type { IFinancialService } from '../types/services'
export type { OnboardingData, PersonalizedSafeToSpend } from '../types/services'
