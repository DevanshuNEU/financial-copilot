// Super Simple Test - No auth required
import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const SuperSimpleTest: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const log = (message: string) => {
    const time = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${time}] ${message}`])
  }

  const testBasicConnection = async () => {
    setLoading(true)
    log('🔍 Testing basic Supabase connection...')
    
    try {
      // Test 1: Basic connection with timeout
      const connectionPromise = supabase.from('onboarding_data').select('count').limit(0)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 5000)
      )
      
      await Promise.race([connectionPromise, timeoutPromise])
      log('✅ Basic connection works')
      
      // Test 2: Auth status
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) {
        log(`❌ Auth error: ${error.message}`)
      } else if (user) {
        log(`✅ User logged in: ${user.email}`)
      } else {
        log('❌ No user logged in')
      }
      
    } catch (error) {
      log(`❌ Connection failed: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const quickLogin = async () => {
    setLoading(true)
    log('🔑 Attempting quick login...')
    
    try {
      // Try to sign in with test credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@test.com', // Replace with your test email
        password: 'test123' // Replace with your test password
      })
      
      if (error) {
        log(`❌ Login failed: ${error.message}`)
      } else {
        log(`✅ Login successful: ${data.user?.email}`)
      }
    } catch (error) {
      log(`❌ Login error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const testWithAuth = async () => {
    setLoading(true)
    log('📊 Testing database with current auth...')
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        log('❌ No user - cannot test database')
        setLoading(false)
        return
      }

      log(`👤 Testing with user: ${user.email}`)

      // Test database access
      const { data, error } = await Promise.race([
        supabase.from('onboarding_data').select('*').eq('user_id', user.id),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Database timeout')), 10000))
      ]) as any

      if (error) {
        log(`❌ Database error: ${error.message}`)
      } else {
        log(`✅ Database works - found ${data.length} records`)
        if (data.length > 0) {
          log(`📦 Sample: ${JSON.stringify(data[0], null, 2)}`)
        }
      }
    } catch (error) {
      log(`❌ Database test failed: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>⚡ Super Simple Test</CardTitle>
            <p className="text-sm text-gray-600">Quick and dirty debugging</p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={testBasicConnection}
            disabled={loading}
            className="h-16"
          >
            {loading ? 'Testing...' : '🔍 Test Connection'}
          </Button>
          
          <Button
            onClick={quickLogin}
            disabled={loading}
            className="h-16"
          >
            {loading ? 'Logging in...' : '🔑 Quick Login'}
          </Button>
          
          <Button
            onClick={testWithAuth}
            disabled={loading}
            className="h-16"
          >
            {loading ? 'Testing...' : '📊 Test Database'}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>📝 Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-80 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-gray-500">Click a button to start testing...</div>
              ) : (
                logs.map((log, i) => <div key={i}>{log}</div>)
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🚨 Emergency Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => window.location.href = '/auth'}
              variant="outline"
              className="w-full"
            >
              Go to Auth Page
            </Button>
            
            <Button
              onClick={() => window.location.href = '/dashboard'}
              variant="outline"
              className="w-full"
            >
              Force Dashboard
            </Button>
            
            <Button
              onClick={() => setLogs([])}
              variant="outline"
              className="w-full"
            >
              Clear Log
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SuperSimpleTest
