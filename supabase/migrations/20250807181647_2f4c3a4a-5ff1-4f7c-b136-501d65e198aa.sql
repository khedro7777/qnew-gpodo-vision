
-- إنشاء جدول المديرين
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- إنشاء جدول جلسات المديرين
CREATE TABLE IF NOT EXISTS public.admin_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES public.admin_users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- تفعيل Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات الأمان
CREATE POLICY "Admin users can view all admin records" ON public.admin_users
    FOR ALL USING (true);

CREATE POLICY "Admin sessions are viewable by session owner" ON public.admin_sessions
    FOR ALL USING (true);

-- إدراج البيانات التجريبية للمديرين
INSERT INTO public.admin_users (email, password_hash, role, is_active) VALUES
    ('admin@gpodo.com', 'admin123', 'super_admin', true),
    ('khedrodo@gmail.com', 'Omarlo', 'admin', true)
ON CONFLICT (email) DO NOTHING;

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON public.admin_sessions(token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON public.admin_sessions(expires_at);
