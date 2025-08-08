
-- Insert admin user for khedrodo@gmail.com
INSERT INTO public.admin_users (
    email, 
    password_hash, 
    role, 
    full_name, 
    is_active
) VALUES (
    'khedrodo@gmail.com',
    'Omarlo',  -- In a real production system, this should be properly hashed
    'admin',
    'Khedr Admin',
    true
) ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    is_active = true,
    updated_at = now();
