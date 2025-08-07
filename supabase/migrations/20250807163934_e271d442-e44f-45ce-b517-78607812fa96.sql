
-- Insert admin user data into the existing admin_users table
INSERT INTO public.admin_users (email, role, password_hash, is_active)
VALUES ('khedrodo@gmail.com', 'super_admin', 'Omarlo', true)
ON CONFLICT (email) DO NOTHING;

-- Add more admin users if needed
-- INSERT INTO public.admin_users (email, role, password_hash, is_active)
-- VALUES ('admin2@gpodo.com', 'admin', 'password123', true);
