// Simple Debug Page - Direct database testing without complex routing
import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const SimpleDebugPage: React.FC = () => {
  const [debugLog, setDebugLog] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setDebugLog(prev => [...prev, `[${timestamp}] ${message}`])
  }

  const testAuth = async () => {
    setLoading(true)
    addLog('🔍 Testing authentication...')
    
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        addLog(`❌ Auth error: ${error.message}`)
      } else if (user) {
        addLog(`✅ User authenticated: ${user.id} (${user.email})`)
      } else {
        addLog('❌ No user found')
      }
    } catch (error) {
      addLog(`❌ Auth exception: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const testDatabase = async () => {
    setLoading(true)
    addLog('🔍 Testing database connection...')
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        addLog('❌ No user - cannot test database')
        setLoading(false)
        return
      }

      addLog(`👤 Testing with user: ${user.id}`)

      // Test table access
      const { data, error } = await supabase
        .from('onboarding_data')
        .select('*')
        .eq('user_id', user.id)
        .limit(1)

      if (error) {
        addLog(`❌ Database error: ${error.message}`)
        addLog(`❌ Error details: ${JSON.stringify(error)}`)
      } else {
        addLog(`✅ Database accessible`)
        addLog(`📊 Data found: ${data?.length || 0} records`)
        if (data && data.length > 0) {
          addLog(`📦 Sample data: ${JSON.stringify(data[0], null, 2)}`)
        }
      }
    } catch (error) {
      addLog(`❌ Database exception: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const testSave = async () => {
    setLoading(true)
    addLog('💾 Testing data save...')
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        addLog('❌ No user - cannot save')
        setLoading(false)
        return
      }

      const testData = {
        user_id: user.id,
        monthly_budget: 1200,
        currency: 'USD',
        has_meal_plan: true,
        fixed_costs: [
          { name: 'Rent', amount: 400, category: 'housing' }
        ],
        spending_categories: {
          'Entertainment': 150
        },
        is_complete: true,
        completed_at: new Date().toISOString()
      }

      addLog('📦 Saving test data...')
      
      const { data, error } = await supabase
        .from('onboarding_data')
        .upsert(testData)
        .select()
        .single()

      if (error) {
        addLog(`❌ Save error: ${error.message}`)
        addLog(`❌ Error details: ${JSON.stringify(error)}`)
      } else {
        addLog(`✅ Data saved successfully`)
        addLog(`📦 Saved data: ${JSON.stringify(data, null, 2)}`)
      }
    } catch (error) {
      addLog(`❌ Save exception: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const clearLog = () => {
    setDebugLog([])
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🔧 Simple Debug Interface</CardTitle>
            <p className="text-sm text-gray-600">
              Direct testing without complex routing
            </p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={testAuth}
            disabled={loading}
            className="h-20"
          >
            {loading ? 'Testing...' : '🔍 Test Auth'}
          </Button>
          
          <Button
            onClick={testDatabase}
            disabled={loading}
            className="h-20"
          >
            {loading ? 'Testing...' : '📊 Test Database'}
          </Button>
          
          <Button
            onClick={testSave}
            disabled={loading}
            className="h-20"
          >
            {loading ? 'Testing...' : '💾 Test Save'}
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>📝 Debug Log</CardTitle>
            <Button onClick={clearLog} variant="outline" size="sm">
              Clear
            </Button>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
              {debugLog.length > 0 ? (
                debugLog.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-gray-500">Click a test button to start debugging...</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SimpleDebugPage
