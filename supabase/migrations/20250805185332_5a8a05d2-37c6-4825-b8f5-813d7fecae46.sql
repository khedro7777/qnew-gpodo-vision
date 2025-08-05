
-- Create API role enum if it doesn't exist
DO $$ BEGIN
    ALTER TYPE user_role ADD VALUE 'api' AFTER 'admin';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create a special API users table for bypassing KYC
CREATE TABLE IF NOT EXISTS public.api_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_privileges BOOLEAN NOT NULL DEFAULT true,
  bypass_kyc BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on api_users table
ALTER TABLE public.api_users ENABLE ROW LEVEL SECURITY;

-- Allow API users to view their own records
CREATE POLICY "API users can view their own records" 
  ON public.api_users 
  FOR SELECT 
  USING (true); -- Allow all authenticated users to check if they're API users

-- Insert the specific API user
INSERT INTO public.api_users (email, full_privileges, bypass_kyc)
VALUES ('newkhedro@gmail.com', true, true)
ON CONFLICT (email) DO UPDATE SET
  full_privileges = EXCLUDED.full_privileges,
  bypass_kyc = EXCLUDED.bypass_kyc,
  updated_at = now();

-- Create function to check if user is API user
CREATE OR REPLACE FUNCTION public.is_api_user(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.api_users 
    WHERE email = user_email 
    AND full_privileges = true 
    AND bypass_kyc = true
  );
$$;

-- Update handle_new_user function to set API role for special users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    role,
    kyc_status,
    is_verified
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    CASE 
      WHEN public.is_api_user(NEW.email) THEN 'api'::user_role
      ELSE 'user'::user_role
    END,
    CASE 
      WHEN public.is_api_user(NEW.email) THEN 'approved'::kyc_status
      ELSE 'pending'::kyc_status
    END,
    CASE 
      WHEN public.is_api_user(NEW.email) THEN true
      ELSE false
    END
  );
  RETURN NEW;
END;
$$;

-- Create policy to allow API users full access to all tables
CREATE POLICY "API users have full access to profiles" 
  ON public.profiles 
  FOR ALL 
  USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 
      FROM public.api_users 
      WHERE email = (
        SELECT email 
        FROM auth.users 
        WHERE id = auth.uid()
      ) 
      AND full_privileges = true
    )
  );

-- Grant API users access to groups
DROP POLICY IF EXISTS "API users can access all groups" ON public.groups;
CREATE POLICY "API users can access all groups" 
  ON public.groups 
  FOR ALL 
  USING (
    (is_public = true) OR 
    (creator_id = auth.uid()) OR
    EXISTS (
      SELECT 1 
      FROM public.api_users 
      WHERE email = (
        SELECT email 
        FROM auth.users 
        WHERE id = auth.uid()
      ) 
      AND full_privileges = true
    )
  );

-- Grant API users access to group members
DROP POLICY IF EXISTS "API users can manage all group memberships" ON public.group_members;
CREATE POLICY "API users can manage all group memberships" 
  ON public.group_members 
  FOR ALL 
  USING (
    (user_id = auth.uid()) OR 
    (EXISTS (SELECT 1 FROM groups WHERE groups.id = group_members.group_id AND groups.creator_id = auth.uid())) OR
    EXISTS (
      SELECT 1 
      FROM public.api_users 
      WHERE email = (
        SELECT email 
        FROM auth.users 
        WHERE id = auth.uid()
      ) 
      AND full_privileges = true
    )
  );
