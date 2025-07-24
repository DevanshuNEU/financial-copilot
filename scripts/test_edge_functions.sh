#!/bin/bash

# EXPENSESINK - Test All Edge Functions
# Run this after deploying to verify everything works

echo "🧪 TESTING ALL EXPENSESINK EDGE FUNCTIONS..."

BASE_URL="https://atfqxpjbhhpnsazuilee.supabase.co/functions/v1"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0ZnF4cGpiaGhwbnNhenVpbGVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNDYzODMsImV4cCI6MjA2ODYyMjM4M30.htiwtc55SYoTtpsXDjfJM8P8sd0KtfYvQGOUmC799EQ"

echo ""
echo "1. 🏥 Testing Health Check..."
curl -X GET "$BASE_URL/health-check" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" | jq '.'

echo ""
echo "2. 📊 Testing Dashboard API..."
curl -X GET "$BASE_URL/dashboard-api" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" | jq '.summary'

echo ""
echo "3. 💰 Testing Expenses List..."
curl -X GET "$BASE_URL/expenses-list" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" | jq '.total, .count'

echo ""
echo "4. 🎯 Testing Onboarding Data..."
curl -X GET "$BASE_URL/onboarding-simple" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" | jq '.monthlyIncome'

echo ""
echo "✅ TESTING COMPLETE!"
echo ""
echo "If all tests show data (not errors), your Edge Functions are working! 🎉"
echo ""
echo "Next step: Test your React app at http://localhost:3000"
echo "It should now use Edge Functions instead of Flask API!"
