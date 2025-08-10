
-- Create enum for user roles
CREATE TYPE public.user_role_type AS ENUM (
  'supplier',
  'buyer', 
  'freelancer',
  'group_member',
  'investor',
  'judge',
  'admin',
  'ai_agent'
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role_type NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can request roles" 
  ON public.user_roles 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles" 
  ON public.user_roles 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'admin' 
    AND ur.is_approved = true 
    AND ur.is_active = true
  ));

-- Create function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(user_id UUID, role_name user_role_type)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_roles.user_id = has_role.user_id 
    AND user_roles.role = role_name 
    AND is_approved = true 
    AND is_active = true
  );
$$;

-- Create function to get user primary role
CREATE OR REPLACE FUNCTION public.get_user_primary_role(user_id UUID)
RETURNS user_role_type
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT role 
  FROM public.user_roles 
  WHERE user_roles.user_id = get_user_primary_role.user_id 
  AND is_approved = true 
  AND is_active = true
  ORDER BY 
    CASE role
      WHEN 'admin' THEN 1
      WHEN 'ai_agent' THEN 2
      WHEN 'judge' THEN 3
      WHEN 'supplier' THEN 4
      WHEN 'buyer' THEN 5
      WHEN 'freelancer' THEN 6
      WHEN 'investor' THEN 7
      WHEN 'group_member' THEN 8
    END
  LIMIT 1;
$$;

-- Update profiles table to include default role assignment
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  
  -- Assign default buyer role (auto-approved)
  INSERT INTO public.user_roles (user_id, role, is_approved, approved_at)
  VALUES (NEW.id, 'buyer', true, now());
  
  RETURN NEW;
END;
$$;
