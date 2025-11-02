-- Update expense status constraint to match UI
-- Run this in Supabase SQL Editor

ALTER TABLE expenses 
DROP CONSTRAINT IF EXISTS expenses_status_check;

ALTER TABLE expenses
ADD CONSTRAINT expenses_status_check 
CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'cancelled'));
