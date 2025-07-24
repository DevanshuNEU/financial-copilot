#!/bin/bash

# EXPENSESINK - Edge Functions Deployment Script
# ==============================================

set -e  # Exit on error

echo "🚀 EXPENSESINK - Deploying Edge Functions"
echo "========================================"

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "   brew install supabase/tap/supabase"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ Not in project root. Please run from financial-copilot directory"
    exit 1
fi

# Function to deploy with retry
deploy_function() {
    local func_name=$1
    local max_attempts=3
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        echo "   Deploying $func_name (attempt $attempt/$max_attempts)..."
        
        if supabase functions deploy $func_name --no-verify-jwt; then
            echo "   ✅ $func_name deployed successfully"
            return 0
        else
            echo "   ⚠️  Failed to deploy $func_name"
            if [ $attempt -lt $max_attempts ]; then
                echo "   Retrying in 5 seconds..."
                sleep 5
            fi
        fi
        
        attempt=$((attempt + 1))
    done
    
    return 1
}

# List of functions to deploy
functions=(
    "health-check"
    "expenses-list"
    "expenses-get"
    "expenses-create"
    "expenses-update"
    "expenses-delete"
    "dashboard-api"
    "analytics-api"
    "weekly-comparison"
    "safe-to-spend-api"
    "budget-api"
    "onboarding-simple"
)

# Deploy each function
echo ""
echo "📦 Deploying ${#functions[@]} Edge Functions..."
echo ""

failed_functions=()

for func in "${functions[@]}"; do
    if ! deploy_function $func; then
        failed_functions+=($func)
    fi
    echo ""
done

# Summary
echo "========================================"
echo "📊 Deployment Summary"
echo "========================================"

if [ ${#failed_functions[@]} -eq 0 ]; then
    echo "✅ All functions deployed successfully!"
    echo ""
    echo "🎉 EXPENSESINK is ready to use!"
    echo ""
    echo "Next steps:"
    echo "1. Start the React app: cd frontend && npm start"
    echo "2. Visit http://localhost:3000"
    echo "3. Check Network tab - should only see supabase.co calls"
else
    echo "❌ Failed to deploy ${#failed_functions[@]} functions:"
    for func in "${failed_functions[@]}"; do
        echo "   - $func"
    done
    echo ""
    echo "Please check the Supabase dashboard or try again."
    exit 1
fi
