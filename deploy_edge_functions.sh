#!/bin/bash

# EXPENSESINK - Deploy All Edge Functions
# Run this from the project root directory

echo "🚀 DEPLOYING ALL EXPENSESINK EDGE FUNCTIONS..."

# Set project reference
export SUPABASE_PROJECT_REF="atfqxpjbhhpnsazuilee"

# Login to Supabase (run this once)
echo "📋 Make sure you're logged in to Supabase CLI..."
echo "If not logged in, run: supabase auth login"

# Link project
echo "🔗 Linking to Supabase project..."
cd supabase
supabase link --project-ref $SUPABASE_PROJECT_REF

# Deploy all functions
echo "📦 Deploying expenses-list..."
supabase functions deploy expenses-list

echo "📦 Deploying expenses-create..."
supabase functions deploy expenses-create

echo "📦 Deploying expenses-get..."
supabase functions deploy expenses-get

echo "📦 Deploying health-check..."
supabase functions deploy health-check

echo "📦 Deploying onboarding-simple..."
supabase functions deploy onboarding-simple

echo "📦 Deploying dashboard-api..."
supabase functions deploy dashboard-api

echo ""
echo "✅ ALL EDGE FUNCTIONS DEPLOYED!"
echo ""
echo "🧪 Test URLs:"
echo "Health Check: https://atfqxpjbhhpnsazuilee.supabase.co/functions/v1/health-check"
echo "Expenses List: https://atfqxpjbhhpnsazuilee.supabase.co/functions/v1/expenses-list"
echo "Dashboard API: https://atfqxpjbhhpnsazuilee.supabase.co/functions/v1/dashboard-api"
echo ""
echo "🔑 Don't forget to set your Authorization header:"
echo "Authorization: Bearer YOUR_SUPABASE_ANON_KEY"
echo ""
echo "🎉 Ready to test the hybrid API service!"
