// Database Configuration - Switch between local and Supabase here
import type { DatabaseConfig } from '../types/services'

export const databaseConfig: DatabaseConfig = {
  // 🔧 CHANGE THIS TO SWITCH BETWEEN LOCAL AND SUPABASE
  mode: 'local', // 'local' or 'supabase'
  
  // Supabase configuration (when mode is 'supabase')
  supabase: {
    url: 'https://xitnatzzojgzmtpagxpe.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpdG5hdHp6b2pnem10cGFneHBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MjU5NjUsImV4cCI6MjA2NzAwMTk2NX0.jVVRwpOv3K734lYFgitCQYEReY__EaGo1A5MMVJA9v8'
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
