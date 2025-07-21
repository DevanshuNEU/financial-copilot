// Database Configuration - Switch between local and Supabase here
import type { DatabaseConfig } from '../types/services'

export const databaseConfig: DatabaseConfig = {
  // 🔧 FLASK API MODE - Uses Flask backend (which connects to Supabase PostgreSQL)
  mode: 'supabase', // 'local' = localStorage, 'supabase' = Flask API + Supabase PostgreSQL
  
  // Supabase configuration (for auth only when using Flask API mode)
  supabase: {
    url: process.env.REACT_APP_SUPABASE_URL || '',
    anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY || ''
  }
}

// Helper functions
export const isLocalMode = () => databaseConfig.mode === 'local'
export const isSupabaseMode = () => databaseConfig.mode === 'supabase'

// Development helpers
export const switchToLocal = () => {
  databaseConfig.mode = 'local'
  console.log('🔄 Switched to LOCAL storage mode')
}

export const switchToSupabase = () => {
  databaseConfig.mode = 'supabase'
  console.log('🔄 Switched to SUPABASE mode')
}

// Log current mode on startup
console.log(`🗄️ Database mode: ${databaseConfig.mode.toUpperCase()}`)
