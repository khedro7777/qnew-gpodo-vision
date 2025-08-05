
-- Create enum types for better data integrity
CREATE TYPE public.user_role AS ENUM ('user', 'supplier', 'freelancer', 'admin');
CREATE TYPE public.gateway_type AS ENUM ('purchasing', 'marketing', 'suppliers', 'freelancers', 'formation', 'legal');
CREATE TYPE public.group_status AS ENUM ('active', 'pending', 'closed', 'archived');

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  company_name TEXT,
  role public.user_role NOT NULL DEFAULT 'user',
  country_code TEXT,
  industry_sector TEXT,
  phone TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create countries table for location data
CREATE TABLE public.countries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  flag_emoji TEXT,
  currency_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create industry sectors table
CREATE TABLE public.industry_sectors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create groups table for B2B collaboration
CREATE TABLE public.groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  gateway_type public.gateway_type NOT NULL,
  industry_sector_id UUID REFERENCES public.industry_sectors(id),
  country_id UUID REFERENCES public.countries(id),
  creator_id UUID NOT NULL REFERENCES auth.users(id),
  status public.group_status NOT NULL DEFAULT 'pending',
  max_members INTEGER DEFAULT 50,
  current_members INTEGER DEFAULT 1,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create group members table for tracking memberships
CREATE TABLE public.group_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for countries (public read)
CREATE POLICY "Countries are viewable by everyone" ON public.countries
  FOR SELECT USING (true);

-- Create RLS policies for industry sectors (public read)
CREATE POLICY "Industry sectors are viewable by everyone" ON public.industry_sectors
  FOR SELECT USING (true);

-- Create RLS policies for groups
CREATE POLICY "Public groups are viewable by everyone" ON public.groups
  FOR SELECT USING (is_public = true OR creator_id = auth.uid());

CREATE POLICY "Users can create groups" ON public.groups
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Group creators can update their groups" ON public.groups
  FOR UPDATE USING (auth.uid() = creator_id);

-- Create RLS policies for group members
CREATE POLICY "Group members can view memberships" ON public.group_members
  FOR SELECT USING (
    user_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.groups WHERE id = group_id AND creator_id = auth.uid())
  );

CREATE POLICY "Users can join groups" ON public.group_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave groups" ON public.group_members
  FOR DELETE USING (user_id = auth.uid());

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

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample countries
INSERT INTO public.countries (code, name, flag_emoji, currency_code) VALUES
('US', 'United States', '🇺🇸', 'USD'),
('UK', 'United Kingdom', '🇬🇧', 'GBP'),
('CA', 'Canada', '🇨🇦', 'CAD'),
('AU', 'Australia', '🇦🇺', 'AUD'),
('DE', 'Germany', '🇩🇪', 'EUR'),
('FR', 'France', '🇫🇷', 'EUR'),
('SA', 'Saudi Arabia', '🇸🇦', 'SAR'),
('AE', 'United Arab Emirates', '🇦🇪', 'AED');

-- Insert sample industry sectors
INSERT INTO public.industry_sectors (name, description, icon) VALUES
('Technology', 'Software, hardware, and IT services', '💻'),
('Healthcare', 'Medical services, pharmaceuticals, and health tech', '🏥'),
('Finance', 'Banking, insurance, and financial services', '💰'),
('Manufacturing', 'Industrial production and manufacturing', '🏭'),
('Retail', 'E-commerce, retail stores, and consumer goods', '🛍️'),
('Education', 'Educational institutions and learning platforms', '🎓'),
('Construction', 'Building, infrastructure, and real estate', '🏗️'),
('Energy', 'Oil, gas, renewable energy, and utilities', '⚡');
