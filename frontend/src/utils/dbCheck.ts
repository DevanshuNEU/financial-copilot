// Quick Database State Checker
import { supabase } from '../lib/supabase'

export const checkDatabaseState = async () => {
  try {
    console.log('🔍 Checking database state...')
    
    // Check current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    console.log('👤 Current user:', user ? `${user.id} (${user.email})` : 'None')
    
    if (userError) {
      console.error('❌ User check error:', userError)
      return
    }
    
    if (!user) {
      console.log('❌ No user authenticated')
      return
    }
    
    // Check onboarding data table
    const { data: onboardingData, error: onboardingError } = await supabase
      .from('onboarding_data')
      .select('*')
      .eq('user_id', user.id)
      
    console.log('📊 Onboarding data query result:')
    if (onboardingError) {
      console.error('❌ Query error:', onboardingError)
    } else {
      console.log('📦 Data found:', onboardingData)
    }
    
    // Check table structure
    const { data: tableInfo, error: tableError } = await supabase
      .from('onboarding_data')
      .select('*')
      .limit(1)
      
    if (tableError) {
      console.error('❌ Table structure error:', tableError)
    } else {
      console.log('🏗️ Table structure (sample):', tableInfo)
    }
  } catch (error) {
    console.error('❌ Database check failed:', error)
  }
}

// Don't auto-run - we'll call it manually from the debug page
