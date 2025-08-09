
-- Create content_types table for defining dynamic content structures
CREATE TABLE public.content_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  singular_name TEXT NOT NULL,
  api_id TEXT NOT NULL UNIQUE,
  fields JSONB NOT NULL DEFAULT '[]'::jsonb,
  permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create content_entries table for storing actual content data
CREATE TABLE public.content_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type_id UUID NOT NULL REFERENCES public.content_types(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Add RLS policies for content_types
ALTER TABLE public.content_types ENABLE ROW LEVEL SECURITY;

-- Admin users can manage all content types
CREATE POLICY "Admin users can manage content types"
  ON public.content_types
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- API users can view all content types
CREATE POLICY "API users can view content types"
  ON public.content_types
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.api_users
      WHERE api_users.email = (
        SELECT users.email FROM auth.users WHERE users.id = auth.uid()
      )
      AND api_users.full_privileges = true
    )
  );

-- Add RLS policies for content_entries
ALTER TABLE public.content_entries ENABLE ROW LEVEL SECURITY;

-- Admin users can manage all content entries
CREATE POLICY "Admin users can manage content entries"
  ON public.content_entries
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- API users can manage content entries
CREATE POLICY "API users can manage content entries"
  ON public.content_entries
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.api_users
      WHERE api_users.email = (
        SELECT users.email FROM auth.users WHERE users.id = auth.uid()
      )
      AND api_users.full_privileges = true
    )
  );

-- Users can view published content entries
CREATE POLICY "Users can view published content entries"
  ON public.content_entries
  FOR SELECT
  USING (status = 'published' OR created_by = auth.uid());

-- Create indexes for better performance
CREATE INDEX idx_content_entries_content_type_id ON public.content_entries(content_type_id);
CREATE INDEX idx_content_entries_status ON public.content_entries(status);
CREATE INDEX idx_content_entries_created_by ON public.content_entries(created_by);
CREATE INDEX idx_content_types_api_id ON public.content_types(api_id);
