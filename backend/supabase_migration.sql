-- Create EXPENSESINK database schema for Supabase migration
-- Phase 1 Day 3: Database setup with tables and data import

-- Create custom types for enums (if not already exists)
DO $$ BEGIN
    CREATE TYPE expense_category AS ENUM (
        'meals', 'travel', 'office', 'software', 'marketing', 'utilities', 'other'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE expense_status AS ENUM (
        'pending', 'approved', 'rejected'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    amount DECIMAL(10,2) NOT NULL,
    category expense_category NOT NULL,
    description TEXT,
    vendor VARCHAR(255),
    status expense_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
    id SERIAL PRIMARY KEY,
    category expense_category NOT NULL UNIQUE,
    monthly_limit DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON expenses(created_at);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_amount ON expenses(amount);
CREATE INDEX IF NOT EXISTS idx_budgets_category ON budgets(category);

-- Import the exported expenses data
INSERT INTO expenses (id, amount, category, description, vendor, status, created_at) VALUES
(2, 120.0, 'software', 'Monthly subscription', 'Adobe', 'pending', '2025-06-23 21:38:03.837520'),
(3, 89.99, 'office', 'Office supplies', 'Staples', 'pending', '2025-06-23 21:38:03.837521'),
(4, 250.0, 'travel', 'Flight booking', 'United Airlines', 'pending', '2025-06-23 21:38:03.837522'),
(5, 25.5, 'meals', 'Test lunch from API', 'Test Restaurant', 'pending', '2025-06-24 05:02:16.927975'),
(6, 100.0, 'travel', 'Ramen', 'Waku Waku', 'approved', '2025-06-24 05:07:55.044236'),
(7, 25.5, 'meals', 'Lunch today', 'Campus Cafe', 'pending', '2025-06-24 10:58:20.737948'),
(8, 15.0, 'travel', 'Bus ride', 'Metro', 'pending', '2025-06-24 10:58:26.653602'),
(9, 8.5, 'marketing', 'Coffee with friends', 'Starbucks', 'pending', '2025-06-24 10:58:31.631019'),
(10, 56.0, 'travel', 'austin', '', 'pending', '2025-07-04 04:20:25.693477')
ON CONFLICT (id) DO NOTHING;

-- Reset the sequence to prevent ID conflicts
SELECT setval('expenses_id_seq', (SELECT MAX(id) FROM expenses));
