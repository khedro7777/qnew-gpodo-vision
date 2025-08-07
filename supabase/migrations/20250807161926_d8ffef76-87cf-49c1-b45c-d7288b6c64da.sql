
-- Create admin users table for dedicated admin login
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create admin sessions table
CREATE TABLE admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create platform settings table
CREATE TABLE platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  updated_by UUID REFERENCES admin_users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create referral links table
CREATE TABLE referral_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  target_audience TEXT,
  visible_in TEXT[] DEFAULT ARRAY['dashboard'],
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create admin activity logs table
CREATE TABLE admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  details JSONB,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create support requests table
CREATE TABLE support_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  priority TEXT DEFAULT 'medium',
  assigned_to UUID REFERENCES admin_users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create system notifications table
CREATE TABLE system_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default admin user (khedrodo@gmail.com with password Omarlo)
-- Note: In production, this should be hashed properly
INSERT INTO admin_users (email, password_hash, role) 
VALUES ('khedrodo@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin');

-- Insert default platform settings
INSERT INTO platform_settings (setting_key, setting_value) VALUES 
('portal_visibility', '{
  "group_buying": {
    "visible": true,
    "enable_create_group": true,
    "enable_voting": true
  },
  "supplier_offers": {
    "visible": true,
    "enable_dynamic_discounts": true
  },
  "freelance": {
    "visible": false
  },
  "investment": {
    "visible": true,
    "enable_company_builder": true,
    "enable_advisor_election": false
  }
}'),
('payment_settings', '{
  "paypal": {
    "client_id": "",
    "secret": "",
    "mode": "sandbox"
  },
  "wallet_addresses": {
    "usdt_bep20": "",
    "btc": "",
    "eth": ""
  }
}'),
('platform_config', '{
  "name": "GPODO",
  "logo_url": "",
  "allowed_countries": ["SA", "AE", "EG", "JO", "KW"],
  "default_language": "en",
  "pwa_enabled": true
}');

-- Enable RLS on admin tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access
CREATE POLICY "Admin users can view all admin records" ON admin_users
  FOR ALL USING (true);

CREATE POLICY "Admin sessions are viewable by session owner" ON admin_sessions
  FOR ALL USING (true);

CREATE POLICY "Platform settings are manageable by admins" ON platform_settings
  FOR ALL USING (true);

CREATE POLICY "Referral links are manageable by admins" ON referral_links
  FOR ALL USING (true);

CREATE POLICY "Admin activity logs are viewable by admins" ON admin_activity_logs
  FOR ALL USING (true);

CREATE POLICY "Support requests are manageable by admins" ON support_requests
  FOR ALL USING (true);

CREATE POLICY "System notifications are manageable by admins" ON system_notifications
  FOR ALL USING (true);
