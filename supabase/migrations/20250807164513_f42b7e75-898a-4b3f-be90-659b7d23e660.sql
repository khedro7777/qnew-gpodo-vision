
-- Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Create admin_sessions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.admin_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES public.admin_users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Enable RLS on admin_sessions
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin_users
CREATE POLICY IF NOT EXISTS "Admin users can view all admin records" 
  ON public.admin_users 
  FOR ALL 
  USING (true);

-- Create RLS policies for admin_sessions
CREATE POLICY IF NOT EXISTS "Admin sessions are viewable by session owner" 
  ON public.admin_sessions 
  FOR ALL 
  USING (true);

-- Insert the admin user
INSERT INTO public.admin_users (email, role, password_hash, is_active)
VALUES ('khedrodo@gmail.com', 'super_admin', 'Omarlo', true)
ON CONFLICT (email) DO NOTHING;
