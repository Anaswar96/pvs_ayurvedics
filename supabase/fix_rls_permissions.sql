-- ==============================================================================
-- PVS AYURVEDICS — FIX ROW LEVEL SECURITY (RLS) FOR PRODUCT & ADMIN MANAGEMENT
-- ==============================================================================
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/liuzdicpkimfagpczpud
-- 2. Click "SQL Editor" from the left sidebar
-- 3. Click "New query"
-- 4. Paste this entire script and click "Run" (or press Ctrl + Enter)
-- 
-- This allows your admin panel to insert, update, and delete products, categories,
-- services, and site settings directly into your Supabase database.
-- ==============================================================================

-- 1. Disable Row Level Security on content tables so Admin API can modify data
ALTER TABLE IF EXISTS public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.services DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.enquiries DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.website_sections DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.trust_points DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.banners DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.announcements DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.testimonials DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.navigation_items DISABLE ROW LEVEL SECURITY;

-- 2. Grant permissions to anon, authenticated, and service_role
GRANT ALL ON TABLE public.products TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.categories TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.services TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.enquiries TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.site_settings TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.website_sections TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.trust_points TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.banners TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.announcements TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.testimonials TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.navigation_items TO anon, authenticated, service_role;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
