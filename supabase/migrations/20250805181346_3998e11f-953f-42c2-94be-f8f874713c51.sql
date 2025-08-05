
-- First, let's check if the kyc_status type already exists, if not create it
DO $$ BEGIN
    CREATE TYPE kyc_status AS ENUM ('pending', 'submitted', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create document_type enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE document_type AS ENUM ('id_card', 'passport', 'company_registration', 'business_license');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create KYC documents table
CREATE TABLE IF NOT EXISTS public.kyc_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  document_type document_type NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  status kyc_status NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewer_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create MCP test results table for freelancers
CREATE TABLE IF NOT EXISTS public.mcp_test_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  test_score INTEGER NOT NULL CHECK (test_score >= 0 AND test_score <= 100),
  test_data JSONB NOT NULL,
  status kyc_status NOT NULL DEFAULT 'pending',
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewer_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add KYC status to profiles table only if columns don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='kyc_status') THEN
        ALTER TABLE public.profiles ADD COLUMN kyc_status kyc_status NOT NULL DEFAULT 'pending';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='kyc_completed_at') THEN
        ALTER TABLE public.profiles ADD COLUMN kyc_completed_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Enable RLS on new tables
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcp_test_results ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own KYC documents" ON public.kyc_documents;
DROP POLICY IF EXISTS "Users can insert their own KYC documents" ON public.kyc_documents;
DROP POLICY IF EXISTS "Users can update their own pending KYC documents" ON public.kyc_documents;
DROP POLICY IF EXISTS "Users can view their own MCP test results" ON public.mcp_test_results;
DROP POLICY IF EXISTS "Users can insert their own MCP test results" ON public.mcp_test_results;

-- RLS policies for kyc_documents
CREATE POLICY "Users can view their own KYC documents" 
  ON public.kyc_documents 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own KYC documents" 
  ON public.kyc_documents 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending KYC documents" 
  ON public.kyc_documents 
  FOR UPDATE 
  USING (auth.uid() = user_id AND status = 'pending');

-- RLS policies for mcp_test_results
CREATE POLICY "Users can view their own MCP test results" 
  ON public.mcp_test_results 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own MCP test results" 
  ON public.mcp_test_results 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create storage bucket for KYC documents if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('kyc-documents', 'kyc-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Users can upload their own KYC documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own KYC documents" ON storage.objects;

-- Storage policies for KYC documents
CREATE POLICY "Users can upload their own KYC documents" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'kyc-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own KYC documents" 
  ON storage.objects 
  FOR SELECT 
  USING (
    bucket_id = 'kyc-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Update handle_new_user function to set initial KYC status
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, kyc_status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'pending'::kyc_status
  );
  RETURN NEW;
END;
$$;
