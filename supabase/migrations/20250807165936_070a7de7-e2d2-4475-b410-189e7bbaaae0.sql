
-- Create custom types first
DO $$ 
BEGIN
    -- Create user_role enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('user', 'supplier', 'freelancer', 'admin', 'api');
    END IF;
    
    -- Create kyc_status enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'kyc_status') THEN
        CREATE TYPE kyc_status AS ENUM ('pending', 'submitted', 'approved', 'rejected');
    END IF;
    
    -- Create group_status enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'group_status') THEN
        CREATE TYPE group_status AS ENUM ('pending', 'active', 'closed', 'archived');
    END IF;
    
    -- Create gateway_type enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gateway_type') THEN
        CREATE TYPE gateway_type AS ENUM ('purchasing', 'marketing', 'suppliers', 'freelancers', 'formation', 'legal');
    END IF;
    
    -- Create document_type enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'document_type') THEN
        CREATE TYPE document_type AS ENUM ('passport', 'national_id', 'license', 'certificate', 'other');
    END IF;
END $$;

-- Create sequences for group numbering
CREATE SEQUENCE IF NOT EXISTS purchasing_group_seq START 1000;
CREATE SEQUENCE IF NOT EXISTS marketing_group_seq START 1000;
CREATE SEQUENCE IF NOT EXISTS investment_group_seq START 1000;
CREATE SEQUENCE IF NOT EXISTS formation_group_seq START 1000;

-- Create comprehensive profiles table (replacing the existing one)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    company_name TEXT,
    role user_role NOT NULL DEFAULT 'user',
    country_code TEXT,
    industry_sector TEXT,
    phone TEXT,
    avatar_url TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    kyc_status kyc_status NOT NULL DEFAULT 'pending',
    kyc_completed_at TIMESTAMP WITH TIME ZONE,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update existing groups table with proper relationships
ALTER TABLE public.groups 
    ADD COLUMN IF NOT EXISTS group_number TEXT,
    ADD CONSTRAINT fk_groups_country FOREIGN KEY (country_id) REFERENCES countries(id),
    ADD CONSTRAINT fk_groups_industry FOREIGN KEY (industry_sector_id) REFERENCES industry_sectors(id),
    ADD CONSTRAINT fk_groups_creator FOREIGN KEY (creator_id) REFERENCES profiles(id);

-- Create comprehensive group_members table with proper relationships
ALTER TABLE public.group_members 
    ADD CONSTRAINT fk_group_members_user FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_group_members_group FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE;

-- Create votes table
CREATE TABLE IF NOT EXISTS public.votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL DEFAULT 'simple',
    status TEXT NOT NULL DEFAULT 'draft',
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    threshold INTEGER DEFAULT 50,
    created_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vote_options table
CREATE TABLE IF NOT EXISTS public.vote_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vote_id UUID NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    vote_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_votes table
CREATE TABLE IF NOT EXISTS public.user_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vote_id UUID NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    option_id UUID NOT NULL REFERENCES vote_options(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(vote_id, user_id)
);

-- Create contracts table
CREATE TABLE IF NOT EXISTS public.contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    parties JSONB NOT NULL DEFAULT '[]',
    created_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create arbitration_cases table
CREATE TABLE IF NOT EXISTS public.arbitration_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_number TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'contract',
    complainant_id UUID NOT NULL REFERENCES profiles(id),
    respondent_id UUID NOT NULL REFERENCES profiles(id),
    group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'filed',
    priority TEXT NOT NULL DEFAULT 'medium',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update existing tasks table with proper relationships
ALTER TABLE public.tasks 
    ADD CONSTRAINT fk_tasks_creator FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_tasks_assignee FOREIGN KEY (assigned_to) REFERENCES profiles(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_tasks_group FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL;

-- Update existing notifications table with proper relationships
ALTER TABLE public.notifications 
    ADD CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Update existing messages table with proper relationships
ALTER TABLE public.messages 
    ADD CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_messages_receiver FOREIGN KEY (receiver_id) REFERENCES profiles(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_messages_group FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL;

-- Update existing kyc_documents table with proper relationships
ALTER TABLE public.kyc_documents 
    ADD CONSTRAINT fk_kyc_documents_user FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Update existing mcp_test_results table with proper relationships
ALTER TABLE public.mcp_test_results 
    ADD CONSTRAINT fk_mcp_test_results_user FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Create wallet_transactions table
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    type TEXT NOT NULL, -- 'credit', 'debit'
    description TEXT,
    payment_method TEXT, -- 'paypal', 'credit_card', etc.
    transaction_reference TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_balances table
CREATE TABLE IF NOT EXISTS public.user_balances (
    user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create group_invitations table
CREATE TABLE IF NOT EXISTS public.group_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    invited_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    invited_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days'),
    UNIQUE(group_id, invited_user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vote_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arbitration_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_invitations ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies
-- Profiles policies
CREATE POLICY IF NOT EXISTS "Users can view and update their own profile"
    ON public.profiles FOR ALL
    USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "API users have full access to profiles"
    ON public.profiles FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.api_users 
        WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
        AND full_privileges = true
    ));

-- Votes policies
CREATE POLICY IF NOT EXISTS "Group members can view votes"
    ON public.votes FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.group_members 
        WHERE group_id = votes.group_id AND user_id = auth.uid()
    ));

CREATE POLICY IF NOT EXISTS "Group members can create votes"
    ON public.votes FOR INSERT
    WITH CHECK (created_by = auth.uid() AND EXISTS (
        SELECT 1 FROM public.group_members 
        WHERE group_id = votes.group_id AND user_id = auth.uid()
    ));

-- Vote options policies
CREATE POLICY IF NOT EXISTS "Group members can view vote options"
    ON public.vote_options FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.votes v
        JOIN public.group_members gm ON v.group_id = gm.group_id
        WHERE v.id = vote_options.vote_id AND gm.user_id = auth.uid()
    ));

-- User votes policies
CREATE POLICY IF NOT EXISTS "Users can view their own votes"
    ON public.user_votes FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can cast votes"
    ON public.user_votes FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Contracts policies
CREATE POLICY IF NOT EXISTS "Group members can view contracts"
    ON public.contracts FOR SELECT
    USING (group_id IS NULL OR EXISTS (
        SELECT 1 FROM public.group_members 
        WHERE group_id = contracts.group_id AND user_id = auth.uid()
    ));

-- Arbitration cases policies
CREATE POLICY IF NOT EXISTS "Involved parties can view arbitration cases"
    ON public.arbitration_cases FOR SELECT
    USING (complainant_id = auth.uid() OR respondent_id = auth.uid());

-- Wallet transactions policies
CREATE POLICY IF NOT EXISTS "Users can view their own transactions"
    ON public.wallet_transactions FOR ALL
    USING (user_id = auth.uid());

-- User balances policies
CREATE POLICY IF NOT EXISTS "Users can view their own balance"
    ON public.user_balances FOR ALL
    USING (user_id = auth.uid());

-- Group invitations policies
CREATE POLICY IF NOT EXISTS "Users can view invitations sent to them"
    ON public.group_invitations FOR SELECT
    USING (invited_user_id = auth.uid() OR invited_by = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_groups_country ON public.groups(country_id);
CREATE INDEX IF NOT EXISTS idx_groups_industry ON public.groups(industry_sector_id);
CREATE INDEX IF NOT EXISTS idx_groups_creator ON public.groups(creator_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user ON public.group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group ON public.group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_votes_group ON public.votes(group_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON public.tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_creator ON public.tasks(created_by);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);

-- Update the handle_new_user function to work with the new profiles structure
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert essential data
-- Insert countries if not exists
INSERT INTO public.countries (name, code, flag_emoji, currency_code) VALUES
    ('السعودية', 'SA', '🇸🇦', 'SAR'),
    ('الإمارات', 'AE', '🇦🇪', 'AED'),
    ('مصر', 'EG', '🇪🇬', 'EGP'),
    ('الكويت', 'KW', '🇰🇼', 'KWD'),
    ('قطر', 'QA', '🇶🇦', 'QAR'),
    ('البحرين', 'BH', '🇧🇭', 'BHD'),
    ('عُمان', 'OM', '🇴🇲', 'OMR'),
    ('الأردن', 'JO', '🇯🇴', 'JOD'),
    ('لبنان', 'LB', '🇱🇧', 'LBP'),
    ('المغرب', 'MA', '🇲🇦', 'MAD')
ON CONFLICT (code) DO NOTHING;

-- Insert industry sectors if not exists
INSERT INTO public.industry_sectors (name, icon, description) VALUES
    ('التجارة الإلكترونية', '🛒', 'منصات البيع والتسوق الإلكتروني'),
    ('التكنولوجيا', '💻', 'تطوير البرمجيات والتطبيقات'),
    ('الصحة', '🏥', 'الخدمات الطبية والصحية'),
    ('التعليم', '🎓', 'التعليم والتدريب'),
    ('الضيافة والسياحة', '🏨', 'الفنادق والمطاعم والسياحة'),
    ('التصنيع', '🏭', 'الصناعات التحويلية'),
    ('العقارات', '🏢', 'الاستثمار والتطوير العقاري'),
    ('النقل واللوجستيات', '🚚', 'خدمات النقل والتوصيل'),
    ('المالية والاستثمار', '💰', 'الخدمات المالية والاستثمار'),
    ('الطاقة والمرافق', '⚡', 'الطاقة والمرافق العامة')
ON CONFLICT (name) DO NOTHING;

-- Create function to generate group numbers
CREATE OR REPLACE FUNCTION public.generate_group_number(gateway_type text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    prefix CHAR(1);
    next_num INTEGER;
BEGIN
    CASE gateway_type
        WHEN 'purchasing' THEN
            prefix := 'P';
            next_num := nextval('purchasing_group_seq');
        WHEN 'investment' THEN
            prefix := 'I';
            next_num := nextval('investment_group_seq');
        WHEN 'marketing' THEN
            prefix := 'M';
            next_num := nextval('marketing_group_seq');
        WHEN 'formation' THEN
            prefix := 'F';
            next_num := nextval('formation_group_seq');
        ELSE
            prefix := 'G';
            next_num := 1000 + floor(random() * 9000);
    END CASE;
    
    RETURN prefix || ' ' || next_num::TEXT;
END;
$$;

-- Create trigger to set group number
CREATE OR REPLACE FUNCTION public.set_group_number()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.group_number IS NULL THEN
        NEW.group_number := generate_group_number(NEW.gateway_type::TEXT);
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_group_number_trigger ON public.groups;
CREATE TRIGGER set_group_number_trigger
    BEFORE INSERT ON public.groups
    FOR EACH ROW EXECUTE PROCEDURE public.set_group_number();
