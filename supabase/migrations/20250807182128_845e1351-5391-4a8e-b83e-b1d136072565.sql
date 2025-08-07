
-- حذف الجداول الموجودة إن وجدت لإعادة إنشائها
DROP TABLE IF EXISTS public.admin_sessions;
DROP TABLE IF EXISTS public.admin_users;

-- إنشاء جدول المديرين من جديد
CREATE TABLE public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    full_name TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- إنشاء جدول جلسات المديرين
CREATE TABLE public.admin_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    FOREIGN KEY (admin_id) REFERENCES public.admin_users(id) ON DELETE CASCADE
);

-- تفعيل Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- حذف السياسات الموجودة إن وجدت
DROP POLICY IF EXISTS "Admin users can view all admin records" ON public.admin_users;
DROP POLICY IF EXISTS "Admin sessions are viewable by session owner" ON public.admin_sessions;

-- إنشاء سياسات الأمان الجديدة
CREATE POLICY "Admin users can view all admin records" 
ON public.admin_users 
FOR ALL 
TO authenticated, anon 
USING (true)
WITH CHECK (true);

CREATE POLICY "Admin sessions are viewable by session owner" 
ON public.admin_sessions 
FOR ALL 
TO authenticated, anon 
USING (true)
WITH CHECK (true);

-- إدراج البيانات التجريبية
INSERT INTO public.admin_users (email, password_hash, role, full_name, is_active) VALUES
('admin@gpodo.com', 'admin123', 'super_admin', 'المدير العام', true),
('khedrodo@gmail.com', 'Omarlo', 'admin', 'خضر عمر', true);

-- إنشاء الفهارس
CREATE INDEX idx_admin_users_email ON public.admin_users(email);
CREATE INDEX idx_admin_sessions_token ON public.admin_sessions(token);
CREATE INDEX idx_admin_sessions_expires_at ON public.admin_sessions(expires_at);

-- منح الصلاحيات اللازمة
GRANT ALL ON public.admin_users TO authenticated, anon;
GRANT ALL ON public.admin_sessions TO authenticated, anon;
