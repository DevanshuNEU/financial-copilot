/**
 * Logger Utility for EXPENSESINK
 * Only logs in development, silent in production
 */

const isDev = process.env.NODE_ENV === 'development'

export const logger = {
  log: (...args: any[]) => {
    if (isDev) {
      console.log(...args)
    }
  },
  
  info: (...args: any[]) => {
    if (isDev) {
      console.info(...args)
    }
  },
  
  warn: (...args: any[]) => {
    if (isDev) {
      console.warn(...args)
    }
  },
  
  error: (...args: any[]) => {
    // Always log errors, even in production
    console.error(...args)
  },
  
  debug: (...args: any[]) => {
    if (isDev) {
      console.debug(...args)
    }
  }
}

export default logger
