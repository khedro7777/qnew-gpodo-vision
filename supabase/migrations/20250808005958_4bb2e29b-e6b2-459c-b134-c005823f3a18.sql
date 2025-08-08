
-- Update admin_users table to ensure it has all required columns
ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Update admin_users table with proper data for existing records
UPDATE admin_users 
SET full_name = CASE 
    WHEN email = 'admin@gpodo.com' THEN 'System Administrator'
    WHEN email = 'khedrodo@gmail.com' THEN 'Khedr Omar'
    ELSE email
END
WHERE full_name IS NULL;

-- Create profiles table if not exists (for regular users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    company_name TEXT,
    country_code TEXT,
    industry_sector TEXT,
    phone TEXT,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'user',
    kyc_status kyc_status NOT NULL DEFAULT 'pending',
    is_verified BOOLEAN NOT NULL DEFAULT false,
    kyc_completed_at TIMESTAMPTZ,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on profiles if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create or replace RLS policies for profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration if not exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
