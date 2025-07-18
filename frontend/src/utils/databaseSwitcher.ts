// Database Mode Switcher Utility
import { databaseConfig, switchToLocal, switchToSupabase } from '../config/database'

/**
 * Runtime database mode switcher
 * Use this in development to quickly switch between local and Supabase modes
 */
export class DatabaseSwitcher {
  
  /**
   * Switch to local storage mode
   */
  static switchToLocal(): void {
    switchToLocal()
    
    // Reload the page to apply changes
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  /**
   * Switch to Supabase mode
   */
  static switchToSupabase(): void {
    switchToSupabase()
    
    // Reload the page to apply changes
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  /**
   * Get current mode
   */
  static getCurrentMode(): string {
    return databaseConfig.mode
  }

  /**
   * Check if currently in local mode
   */
  static isLocalMode(): boolean {
    return databaseConfig.mode === 'local'
  }

  /**
   * Check if currently in Supabase mode
   */
  static isSupabaseMode(): boolean {
    return databaseConfig.mode === 'supabase'
  }

  /**
   * Add switcher to global window object for easy access in browser console
   */
  static attachToWindow(): void {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.financialCopilotSwitcher = {
        switchToLocal: this.switchToLocal,
        switchToSupabase: this.switchToSupabase,
        getCurrentMode: this.getCurrentMode,
        isLocalMode: this.isLocalMode,
        isSupabaseMode: this.isSupabaseMode,
        help: () => {
          console.log(`
🔧 EXPENSESINK Database Switcher

Current Mode: ${this.getCurrentMode().toUpperCase()}

Available Commands:
- financialCopilotSwitcher.switchToLocal()    // Switch to local storage
- financialCopilotSwitcher.switchToSupabase() // Switch to Supabase
- financialCopilotSwitcher.getCurrentMode()   // Get current mode
- financialCopilotSwitcher.isLocalMode()      // Check if local mode
- financialCopilotSwitcher.isSupabaseMode()   // Check if Supabase mode

Note: Page will reload automatically when switching modes.
          `)
        }
      }
      
      console.log(`
🔧 EXPENSESINK Database Switcher loaded!
Current mode: ${this.getCurrentMode().toUpperCase()}
Type 'financialCopilotSwitcher.help()' for available commands.
      `)
    }
  }
}

// Auto-attach to window in development
if (process.env.NODE_ENV === 'development') {
  DatabaseSwitcher.attachToWindow()
}
