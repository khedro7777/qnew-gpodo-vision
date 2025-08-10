
-- Create wallet system tables
CREATE TABLE public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, currency)
);

CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID REFERENCES public.wallets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('recharge', 'debit', 'credit', 'refund')),
  amount DECIMAL(15,2) NOT NULL,
  description TEXT NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('PayPal', 'BTC', 'ETH', 'USDT', 'Admin')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  payment_reference TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create supplier payment settings
CREATE TABLE public.supplier_payment_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  paypal_email TEXT,
  paypal_client_id TEXT,
  paypal_secret_encrypted TEXT, -- Encrypted
  crypto_wallet_btc TEXT,
  crypto_wallet_eth TEXT,
  crypto_wallet_usdt TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create offers system
CREATE TABLE public.group_discount_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  target_region TEXT,
  base_price DECIMAL(15,2) NOT NULL,
  minimum_joiners INTEGER NOT NULL DEFAULT 1,
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'invite_only')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'active', 'completed', 'expired', 'cancelled')),
  kyc_required BOOLEAN DEFAULT false,
  points_required INTEGER DEFAULT 0,
  sales_agreement_template TEXT,
  product_images TEXT[], -- Array of image URLs
  pdf_attachments TEXT[], -- Array of PDF URLs
  did_identifier TEXT,
  current_participants INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create discount tiers
CREATE TABLE public.group_discount_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID REFERENCES public.group_discount_offers(id) ON DELETE CASCADE NOT NULL,
  min_members INTEGER NOT NULL,
  discount_percent DECIMAL(5,2),
  fixed_price DECIMAL(15,2),
  tier_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create offer participants
CREATE TABLE public.group_offer_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID REFERENCES public.group_discount_offers(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  amount_paid DECIMAL(15,2),
  UNIQUE(offer_id, user_id)
);

-- Create invoices
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  offer_id UUID REFERENCES public.group_discount_offers(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_method TEXT CHECK (payment_method IN ('PayPal', 'BTC', 'ETH', 'USDT')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  payment_reference TEXT,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create complaints system
CREATE TABLE public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_number TEXT NOT NULL UNIQUE,
  offer_id UUID REFERENCES public.group_discount_offers(id) ON DELETE SET NULL,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  from_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  supplier_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  attachments TEXT[], -- Array of attachment URLs
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'escalated')),
  supplier_reply TEXT,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add DID identifier to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS did_identifier TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS did_metadata JSONB DEFAULT '{}';

-- Create wallet management functions
CREATE OR REPLACE FUNCTION public.update_wallet_balance(
  p_user_id UUID,
  p_amount DECIMAL,
  p_type TEXT,
  p_description TEXT,
  p_payment_method TEXT DEFAULT NULL,
  p_payment_reference TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_wallet_id UUID;
  v_transaction_id UUID;
BEGIN
  -- Get or create wallet
  INSERT INTO public.wallets (user_id, balance, currency)
  VALUES (p_user_id, 0, 'USD')
  ON CONFLICT (user_id, currency) DO NOTHING;
  
  SELECT id INTO v_wallet_id 
  FROM public.wallets 
  WHERE user_id = p_user_id AND currency = 'USD';
  
  -- Create transaction
  INSERT INTO public.transactions (
    wallet_id, user_id, type, amount, description, 
    payment_method, payment_reference, status
  )
  VALUES (
    v_wallet_id, p_user_id, p_type, p_amount, p_description,
    p_payment_method, p_payment_reference, 'completed'
  )
  RETURNING id INTO v_transaction_id;
  
  -- Update wallet balance
  UPDATE public.wallets 
  SET balance = balance + p_amount, updated_at = now()
  WHERE id = v_wallet_id;
  
  RETURN v_transaction_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.spend_wallet_balance(
  p_user_id UUID,
  p_amount DECIMAL,
  p_description TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_wallet_id UUID;
  v_current_balance DECIMAL;
BEGIN
  -- Get wallet and current balance
  SELECT id, balance INTO v_wallet_id, v_current_balance
  FROM public.wallets 
  WHERE user_id = p_user_id AND currency = 'USD';
  
  IF v_wallet_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Check if sufficient balance
  IF v_current_balance < p_amount THEN
    RETURN FALSE;
  END IF;
  
  -- Create debit transaction
  INSERT INTO public.transactions (
    wallet_id, user_id, type, amount, description, status
  )
  VALUES (
    v_wallet_id, p_user_id, 'debit', -p_amount, p_description, 'completed'
  );
  
  -- Update wallet balance
  UPDATE public.wallets 
  SET balance = balance - p_amount, updated_at = now()
  WHERE id = v_wallet_id;
  
  RETURN TRUE;
END;
$$;

-- Create invoice number generator function
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_number TEXT;
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count FROM public.invoices;
  v_number := 'INV-' || TO_CHAR(now(), 'YYYY') || '-' || LPAD((v_count + 1)::TEXT, 6, '0');
  RETURN v_number;
END;
$$;

-- Create complaint number generator function
CREATE OR REPLACE FUNCTION public.generate_complaint_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_number TEXT;
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count FROM public.complaints;
  v_number := 'COMP-' || TO_CHAR(now(), 'YYYY') || '-' || LPAD((v_count + 1)::TEXT, 6, '0');
  RETURN v_number;
END;
$$;

-- Create triggers for automatic number generation
CREATE OR REPLACE FUNCTION public.set_invoice_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.invoice_number IS NULL THEN
    NEW.invoice_number := generate_invoice_number();
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_complaint_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.complaint_number IS NULL THEN
    NEW.complaint_number := generate_complaint_number();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_invoice_number
  BEFORE INSERT ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION set_invoice_number();

CREATE TRIGGER trigger_set_complaint_number
  BEFORE INSERT ON public.complaints
  FOR EACH ROW EXECUTE FUNCTION set_complaint_number();

-- Enable RLS on all tables
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_payment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_discount_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_discount_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_offer_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- RLS Policies for wallets
CREATE POLICY "Users can view own wallet" ON public.wallets
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (user_id = auth.uid());

-- RLS Policies for supplier settings
CREATE POLICY "Suppliers can manage own settings" ON public.supplier_payment_settings
  FOR ALL USING (supplier_id = auth.uid());

-- RLS Policies for offers
CREATE POLICY "Public offers viewable by all" ON public.group_discount_offers
  FOR SELECT USING (visibility = 'public' OR supplier_id = auth.uid());

CREATE POLICY "Suppliers can manage own offers" ON public.group_discount_offers
  FOR ALL USING (supplier_id = auth.uid());

-- RLS Policies for offer tiers
CREATE POLICY "Anyone can view offer tiers" ON public.group_discount_tiers
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.group_discount_offers 
    WHERE id = offer_id AND (visibility = 'public' OR supplier_id = auth.uid())
  ));

CREATE POLICY "Suppliers can manage own offer tiers" ON public.group_discount_tiers
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.group_discount_offers 
    WHERE id = offer_id AND supplier_id = auth.uid()
  ));

-- RLS Policies for offer members
CREATE POLICY "Users can view offer memberships" ON public.group_offer_members
  FOR SELECT USING (
    user_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.group_discount_offers WHERE id = offer_id AND supplier_id = auth.uid())
  );

CREATE POLICY "Users can join offers" ON public.group_offer_members
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for invoices
CREATE POLICY "Invoice parties can view invoices" ON public.invoices
  FOR SELECT USING (supplier_id = auth.uid() OR buyer_id = auth.uid());

CREATE POLICY "Suppliers can create invoices" ON public.invoices
  FOR INSERT WITH CHECK (supplier_id = auth.uid());

CREATE POLICY "Suppliers can update own invoices" ON public.invoices
  FOR UPDATE USING (supplier_id = auth.uid());

-- RLS Policies for complaints
CREATE POLICY "Complaint parties can view complaints" ON public.complaints
  FOR SELECT USING (
    from_user_id = auth.uid() OR 
    supplier_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin' AND is_approved = true)
  );

CREATE POLICY "Users can create complaints" ON public.complaints
  FOR INSERT WITH CHECK (from_user_id = auth.uid());

CREATE POLICY "Suppliers can reply to complaints" ON public.complaints
  FOR UPDATE USING (supplier_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_wallets_user_id ON public.wallets(user_id);
CREATE INDEX idx_transactions_wallet_id ON public.transactions(wallet_id);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_offers_supplier_id ON public.group_discount_offers(supplier_id);
CREATE INDEX idx_offers_status ON public.group_discount_offers(status);
CREATE INDEX idx_offers_deadline ON public.group_discount_offers(deadline);
CREATE INDEX idx_invoices_supplier_id ON public.invoices(supplier_id);
CREATE INDEX idx_invoices_buyer_id ON public.invoices(buyer_id);
CREATE INDEX idx_complaints_supplier_id ON public.complaints(supplier_id);
CREATE INDEX idx_complaints_from_user_id ON public.complaints(from_user_id);
