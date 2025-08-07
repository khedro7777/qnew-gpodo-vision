
-- Create countries table
CREATE TABLE public.countries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    flag_emoji TEXT,
    currency_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create industry sectors table  
CREATE TABLE public.industry_sectors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create groups table with enum types
CREATE TYPE gateway_type AS ENUM ('purchasing', 'marketing', 'suppliers', 'freelancers', 'formation', 'legal');
CREATE TYPE group_status AS ENUM ('pending', 'active', 'suspended', 'completed');

CREATE TABLE public.groups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    gateway_type gateway_type NOT NULL,
    creator_id UUID REFERENCES auth.users(id) NOT NULL,
    country_id UUID REFERENCES public.countries(id),
    industry_sector_id UUID REFERENCES public.industry_sectors(id),
    max_members INTEGER DEFAULT 50,
    current_members INTEGER DEFAULT 1,
    is_public BOOLEAN DEFAULT true NOT NULL,
    status group_status DEFAULT 'pending' NOT NULL,
    group_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create admin_users table
CREATE TABLE public.admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin' NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create admin_sessions table
CREATE TABLE public.admin_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID REFERENCES public.admin_users(id),
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert sample countries
INSERT INTO public.countries (name, code, flag_emoji, currency_code) VALUES
('Saudi Arabia', 'SA', '🇸🇦', 'SAR'),
('United Arab Emirates', 'AE', '🇦🇪', 'AED'),
('Egypt', 'EG', '🇪🇬', 'EGP'),
('Jordan', 'JO', '🇯🇴', 'JOD'),
('Kuwait', 'KW', '🇰🇼', 'KWD'),
('Qatar', 'QA', '🇶🇦', 'QAR'),
('Bahrain', 'BH', '🇧🇭', 'BHD'),
('Oman', 'OM', '🇴🇲', 'OMR'),
('Lebanon', 'LB', '🇱🇧', 'LBP'),
('Morocco', 'MA', '🇲🇦', 'MAD');

-- Insert sample industry sectors
INSERT INTO public.industry_sectors (name, description, icon) VALUES
('Technology', 'Information Technology and Software', '💻'),
('Healthcare', 'Medical and Healthcare Services', '🏥'),
('Finance', 'Banking and Financial Services', '💰'),
('Manufacturing', 'Industrial Manufacturing', '🏭'),
('Retail', 'Retail and E-commerce', '🛍️'),
('Education', 'Educational Services', '🎓'),
('Construction', 'Construction and Real Estate', '🏗️'),
('Transportation', 'Logistics and Transportation', '🚛'),
('Energy', 'Energy and Utilities', '⚡'),
('Agriculture', 'Agriculture and Food Production', '🌾');

-- Insert sample admin user (email: admin@gpodo.com, password: admin123)
INSERT INTO public.admin_users (email, password_hash, role) VALUES
('admin@gpodo.com', 'admin123', 'admin'),
('khedrodo@gmail.com', 'Omarlo', 'admin');

-- Enable RLS on all tables
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Countries are viewable by everyone" ON public.countries FOR SELECT USING (true);
CREATE POLICY "Industry sectors are viewable by everyone" ON public.industry_sectors FOR SELECT USING (true);
CREATE POLICY "Public groups are viewable by everyone" ON public.groups FOR SELECT USING (is_public = true OR creator_id = auth.uid());
CREATE POLICY "Admin users can view all admin records" ON public.admin_users FOR ALL USING (true);
CREATE POLICY "Admin sessions are viewable by session owner" ON public.admin_sessions FOR ALL USING (true);

-- Create trigger for group numbering
CREATE SEQUENCE purchasing_group_seq START 1001;
CREATE SEQUENCE investment_group_seq START 2001;
CREATE SEQUENCE marketing_group_seq START 3001;
CREATE SEQUENCE formation_group_seq START 4001;

-- Create function to generate group number
CREATE OR REPLACE FUNCTION generate_group_number(gateway_type text)
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

-- Create trigger function
CREATE OR REPLACE FUNCTION set_group_number()
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

-- Create trigger
CREATE TRIGGER trigger_set_group_number
    BEFORE INSERT ON public.groups
    FOR EACH ROW
    EXECUTE FUNCTION set_group_number();
