// Data Flow Debug Page - Test all persistence and user flow logic
import React, { useState, useEffect } from 'react'
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext'
import { supabaseOnboardingService, OnboardingData } from '../services/supabaseOnboarding'
import { checkDatabaseState } from '../utils/dbCheck'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const DataFlowDebugPage: React.FC = () => {
  const { user } = useSupabaseAuth()
  const [debugLog, setDebugLog] = useState<string[]>([])
  const [currentData, setCurrentData] = useState<OnboardingData | null>(null)
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setDebugLog(prev => [...prev, `[${timestamp}] ${message}`])
  }

  // Test sample data
  const sampleOnboardingData: OnboardingData = {
    monthlyBudget: 1200,
    currency: 'USD',
    hasMealPlan: true,
    fixedCosts: [
      { name: 'Rent', amount: 400, category: 'housing' },
      { name: 'Meal Plan', amount: 200, category: 'food' }
    ],
    spendingCategories: {
      'Entertainment': 150,
      'Transportation': 100,
      'Shopping': 150,
      'Personal': 100
    }
  }

  // Load current state
  useEffect(() => {
    const loadCurrentState = async () => {
      if (!user) {
        addLog('❌ No user authenticated')
        return
      }

      addLog(`🔍 Loading data for user: ${user.id}`)
      
      try {
        // Check onboarding completion
        const isComplete = await supabaseOnboardingService.hasCompletedOnboarding()
        setOnboardingComplete(isComplete)
        addLog(`📋 Onboarding complete: ${isComplete}`)

        // Load current data
        const data = await supabaseOnboardingService.loadOnboardingData()
        setCurrentData(data)
        addLog(`📊 Current data: ${data ? 'Found' : 'None'}`)
        
        if (data) {
          addLog(`💰 Budget: ${data.currency} ${data.monthlyBudget}`)
          addLog(`🏠 Fixed costs: ${data.fixedCosts.length} items`)
          addLog(`💳 Spending categories: ${Object.keys(data.spendingCategories).length} categories`)
        }
      } catch (error) {
        addLog(`❌ Error loading data: ${error}`)
      }
    }

    loadCurrentState()
  }, [user])

  const testDatabaseConnection = async () => {
    addLog('🔍 Testing database connection...')
    await checkDatabaseState()
    addLog('✅ Database check completed (see console for details)')
  }

  const testSaveData = async () => {
    if (!user) {
      addLog('❌ No user authenticated')
      return
    }

    setLoading(true)
    addLog('🧪 Testing data save...')

    try {
      const savedData = await supabaseOnboardingService.saveOnboardingData(sampleOnboardingData)
      addLog('✅ Data saved successfully')
      addLog(`📦 Saved data ID: ${savedData.id}`)
      
      // Reload to verify
      const reloadedData = await supabaseOnboardingService.loadOnboardingData()
      if (reloadedData) {
        setCurrentData(reloadedData)
        addLog('✅ Data reload successful')
        addLog(`💰 Reloaded budget: ${reloadedData.currency} ${reloadedData.monthlyBudget}`)
      } else {
        addLog('❌ Data reload failed')
      }

      // Check completion status
      const isComplete = await supabaseOnboardingService.hasCompletedOnboarding()
      setOnboardingComplete(isComplete)
      addLog(`📋 Onboarding now complete: ${isComplete}`)
      
    } catch (error) {
      addLog(`❌ Save test failed: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const testClearData = async () => {
    if (!user) {
      addLog('❌ No user authenticated')
      return
    }

    setLoading(true)
    addLog('🗑️ Testing data clear...')

    try {
      await supabaseOnboardingService.clearOnboardingData()
      addLog('✅ Data cleared successfully')
      
      // Reload to verify
      const reloadedData = await supabaseOnboardingService.loadOnboardingData()
      setCurrentData(reloadedData)
      addLog(`📊 Data after clear: ${reloadedData ? 'Still exists' : 'Cleared'}`)

      // Check completion status
      const isComplete = await supabaseOnboardingService.hasCompletedOnboarding()
      setOnboardingComplete(isComplete)
      addLog(`📋 Onboarding complete after clear: ${isComplete}`)
      
    } catch (error) {
      addLog(`❌ Clear test failed: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const clearLog = () => {
    setDebugLog([])
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Debug - Not Authenticated</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Please log in to test data flow</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle>🔧 Data Flow Debug Interface</CardTitle>
            <p className="text-sm text-gray-600">
              Test onboarding data persistence and user flow logic
            </p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current State */}
          <Card>
            <CardHeader>
              <CardTitle>📊 Current State</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <strong>User ID:</strong> {user.id}
              </div>
              <div>
                <strong>Email:</strong> {user.email}
              </div>
              <div>
                <strong>Onboarding Complete:</strong>{' '}
                <span className={onboardingComplete ? 'text-green-600' : 'text-red-600'}>
                  {onboardingComplete === null ? 'Loading...' : onboardingComplete ? 'Yes' : 'No'}
                </span>
              </div>
              
              {currentData ? (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Current Data Found:</h4>
                  <div className="text-sm space-y-1">
                    <div>Budget: {currentData.currency} {currentData.monthlyBudget}</div>
                    <div>Meal Plan: {currentData.hasMealPlan ? 'Yes' : 'No'}</div>
                    <div>Fixed Costs: {currentData.fixedCosts.length} items</div>
                    <div>Categories: {Object.keys(currentData.spendingCategories).length} items</div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-4 bg-red-50 rounded-lg">
                  <h4 className="font-semibold text-red-800">No Data Found</h4>
                  <p className="text-sm text-red-600">User has no saved onboarding data</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Test Controls */}
          <Card>
            <CardHeader>
              <CardTitle>🧪 Test Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={testDatabaseConnection}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                🔍 Test Database Connection
              </Button>
              
              <Button
                onClick={testSaveData}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Testing...' : '💾 Test Save Sample Data'}
              </Button>
              
              <Button
                onClick={testClearData}
                disabled={loading}
                variant="destructive"
                className="w-full"
              >
                {loading ? 'Clearing...' : '🗑️ Test Clear Data'}
              </Button>
              
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full"
              >
                🔄 Reload Page
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Debug Log */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>📝 Debug Log</CardTitle>
            <Button onClick={clearLog} variant="outline" size="sm">
              Clear Log
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
                <div className="text-gray-500">Debug log will appear here...</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sample Data Preview */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Sample Test Data</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
              {JSON.stringify(sampleOnboardingData, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DataFlowDebugPage
