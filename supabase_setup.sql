-- ============================================
-- SUPABASE SETUP SCRIPT FOR FOOD ANALYZER APP
-- ============================================
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================

-- Step 1: Create tables (if they don't exist)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text UNIQUE NOT NULL,
  name text,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS food (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id uuid REFERENCES meals(id) ON DELETE CASCADE NOT NULL,
  food_name text,
  weight numeric,
  calorie numeric,
  protein numeric,
  carbs numeric,
  fats numeric,
  fiber numeric,
  sugars numeric,
  sodium numeric,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  age text,
  weight text,
  height text,
  gender text,
  created_at timestamp with time zone DEFAULT now()
);

-- Step 2: Enable RLS and create policies
-- Users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all operations" ON users;
CREATE POLICY "Allow all operations" ON users FOR ALL USING (true) WITH CHECK (true);

-- Meals table
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all operations" ON meals;
CREATE POLICY "Allow all operations" ON meals FOR ALL USING (true) WITH CHECK (true);

-- Food table
ALTER TABLE food ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all operations" ON food;
CREATE POLICY "Allow all operations" ON food FOR ALL USING (true) WITH CHECK (true);

-- User_details table
ALTER TABLE user_details ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all operations" ON user_details;
CREATE POLICY "Allow all operations" ON user_details FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- SETUP COMPLETE!
-- ============================================

