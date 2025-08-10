
-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user roles enum and table
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM (
        'supplier', 'buyer', 'freelancer', 'group_member', 
        'investor', 'judge', 'admin', 'ai_agent'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role_type NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create group discount offers table
CREATE TABLE IF NOT EXISTS public.group_discount_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    target_region TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    minimum_joiners INTEGER NOT NULL DEFAULT 1,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    visibility TEXT CHECK (visibility IN ('public', 'invite_only')) DEFAULT 'public',
    status TEXT CHECK (status IN ('draft', 'pending', 'active', 'completed', 'expired', 'cancelled')) DEFAULT 'draft',
    kyc_required BOOLEAN DEFAULT false,
    points_required INTEGER DEFAULT 0,
    sales_agreement_template TEXT,
    product_images TEXT[],
    pdf_attachments TEXT[],
    did_identifier TEXT,
    current_participants INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create group discount tiers table
CREATE TABLE IF NOT EXISTS public.group_discount_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    offer_id UUID REFERENCES public.group_discount_offers(id) ON DELETE CASCADE,
    min_members INTEGER NOT NULL,
    discount_percent DECIMAL(5,2),
    fixed_price DECIMAL(10,2),
    tier_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create supplier payment settings table
CREATE TABLE IF NOT EXISTS public.supplier_payment_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    paypal_email TEXT,
    paypal_client_id TEXT,
    crypto_wallet_btc TEXT,
    crypto_wallet_eth TEXT,
    crypto_wallet_usdt TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    offer_id UUID REFERENCES public.group_discount_offers(id) ON DELETE SET NULL,
    invoice_number TEXT UNIQUE,
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    payment_method TEXT CHECK (payment_method IN ('PayPal', 'BTC', 'ETH', 'USDT')),
    status TEXT CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')) DEFAULT 'pending',
    payment_reference TEXT,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create complaints table
CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_number TEXT UNIQUE,
    offer_id UUID REFERENCES public.group_discount_offers(id) ON DELETE SET NULL,
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
    from_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    supplier_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    attachments TEXT[],
    status TEXT CHECK (status IN ('open', 'in_progress', 'resolved', 'escalated')) DEFAULT 'open',
    supplier_reply TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_discount_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_discount_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_payment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own roles" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for group_discount_offers
CREATE POLICY "Suppliers can manage own offers" ON public.group_discount_offers FOR ALL USING (auth.uid() = supplier_id);
CREATE POLICY "Public can view active offers" ON public.group_discount_offers FOR SELECT USING (status = 'active' AND visibility = 'public');

-- Create RLS policies for group_discount_tiers
CREATE POLICY "Suppliers can manage own offer tiers" ON public.group_discount_tiers FOR ALL USING (
    EXISTS (SELECT 1 FROM public.group_discount_offers WHERE id = offer_id AND supplier_id = auth.uid())
);

-- Create RLS policies for supplier_payment_settings
CREATE POLICY "Suppliers can manage own payment settings" ON public.supplier_payment_settings FOR ALL USING (auth.uid() = supplier_id);

-- Create RLS policies for invoices
CREATE POLICY "Suppliers can manage own invoices" ON public.invoices FOR ALL USING (auth.uid() = supplier_id);
CREATE POLICY "Buyers can view their invoices" ON private.invoices FOR SELECT USING (auth.uid() = buyer_id);

-- Create RLS policies for complaints
CREATE POLICY "Suppliers can view own complaints" ON public.complaints FOR SELECT USING (auth.uid() = supplier_id);
CREATE POLICY "Suppliers can update own complaints" ON public.complaints FOR UPDATE USING (auth.uid() = supplier_id);
CREATE POLICY "Users can view their submitted complaints" ON public.complaints FOR SELECT USING (auth.uid() = from_user_id);

-- Create triggers for automatic invoice and complaint numbering
CREATE OR REPLACE FUNCTION set_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invoice_number IS NULL THEN
        NEW.invoice_number := 'INV-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('invoice_number_seq')::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_complaint_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.complaint_number IS NULL THEN
        NEW.complaint_number := 'COMP-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('complaint_number_seq')::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequences for numbering
CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 1;
CREATE SEQUENCE IF NOT EXISTS complaint_number_seq START 1;

-- Create triggers
DROP TRIGGER IF EXISTS set_invoice_number_trigger ON public.invoices;
CREATE TRIGGER set_invoice_number_trigger
    BEFORE INSERT ON public.invoices
    FOR EACH ROW EXECUTE FUNCTION set_invoice_number();

DROP TRIGGER IF EXISTS set_complaint_number_trigger ON public.complaints;
CREATE TRIGGER set_complaint_number_trigger
    BEFORE INSERT ON public.complaints
    FOR EACH ROW EXECUTE FUNCTION set_complaint_number();
