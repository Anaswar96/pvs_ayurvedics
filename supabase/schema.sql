-- ==============================================================================
-- PVS AYURVEDICS - SUPABASE DATABASE SCHEMA MIGRATION
-- Production-Ready Schema with UUIDs, RLS Policies, Indexes & Triggers
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. SITE SETTINGS TABLE (Editable Business Details, Contact, Social, SEO)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_name TEXT NOT NULL DEFAULT 'PVS Ayurvedics',
  tagline TEXT NOT NULL DEFAULT 'Pure. Natural. Everyday Wellness.',
  malayalam_headline TEXT DEFAULT 'ആരോഗ്യത്തിന് ആയുർവേദത്തിന്റെ കരുതൽ',
  malayalam_tagline TEXT DEFAULT 'ആരോഗ്യത്തിന് ആയുർവേദത്തിന്റെ കരുതൽ - Traditional care for a healthier tomorrow',
  phone TEXT NOT NULL DEFAULT '+91 9061-853-542',
  whatsapp_number TEXT NOT NULL DEFAULT '+919061853542',
  whatsapp_sticky_enabled BOOLEAN DEFAULT true,
  whatsapp_default_message TEXT DEFAULT 'Hello PVS Ayurvedics, I would like to inquire about your Ayurvedic treatments and products.',
  whatsapp_button_label TEXT DEFAULT 'Chat with Us',
  email TEXT NOT NULL DEFAULT 'info@pvsayurvedics.com',
  address TEXT NOT NULL DEFAULT 'Manjeri, Malappuram, Kerala, India',
  city TEXT NOT NULL DEFAULT 'Manjeri',
  state TEXT NOT NULL DEFAULT 'Kerala',
  pincode TEXT DEFAULT '676121',
  working_hours TEXT DEFAULT 'Mon - Sat: 9:00 AM - 7:00 PM',
  logo_url TEXT DEFAULT '/images/logo.png',
  favicon_url TEXT DEFAULT '/favicon.ico',
  google_map_embed_url TEXT DEFAULT 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3913.758416801905!2d76.11586527583685!3d11.119760752150117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba64a938b8160ef%3A0x2db42831f457ff0e!2sManjeri%2C%20Kerala!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
  google_map_directions_url TEXT DEFAULT 'https://maps.google.com/?q=Manjeri,+Malappuram,+Kerala',
  facebook_url TEXT DEFAULT 'https://facebook.com',
  instagram_url TEXT DEFAULT 'https://instagram.com',
  youtube_url TEXT DEFAULT 'https://youtube.com',
  meta_title TEXT DEFAULT 'PVS Ayurvedics | Traditional Care & Natural Ayurvedic Products Manjeri Kerala',
  meta_description TEXT DEFAULT 'Experience authentic Ayurvedic wellness, personalized consultations, and natural herbal remedies at PVS Ayurvedics in Manjeri, Malappuram, Kerala.',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 2. WEBSITE SECTIONS (Hero, About, Story, CTA, Layout Order & Visibility)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.website_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key TEXT UNIQUE NOT NULL,
  section_name TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  content TEXT,
  cta_text TEXT,
  cta_url TEXT,
  secondary_cta_text TEXT,
  secondary_cta_url TEXT,
  image_url TEXT,
  mobile_image_url TEXT,
  is_visible BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  meta_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 3. TRUST POINTS TABLE (Natural Ingredients, Trusted Care, Safe & Gentle, etc.)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trust_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  icon_name TEXT NOT NULL DEFAULT 'Leaf',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 4. CATEGORIES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 5. PRODUCTS TABLE (Pure Ayurvedic Products for Everyday Wellness)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  sku TEXT,
  short_description TEXT NOT NULL,
  full_description TEXT,
  price NUMERIC(10,2),
  mrp NUMERIC(10,2),
  main_image TEXT NOT NULL,
  gallery_images TEXT[] DEFAULT '{}',
  ingredients TEXT[] DEFAULT '{}',
  usage_instructions TEXT,
  benefits TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  in_stock BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 6. SERVICES TABLE (Holistic Care for Your Well-being)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT,
  icon_name TEXT NOT NULL DEFAULT 'Stethoscope',
  image_url TEXT,
  benefits TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 7. BANNERS TABLE (Promotional & Hero Banners)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  cta_text TEXT,
  cta_url TEXT,
  desktop_image TEXT NOT NULL,
  mobile_image TEXT,
  placement TEXT DEFAULT 'home_sidebar',
  features TEXT[] DEFAULT '{}',
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 8. ANNOUNCEMENTS TABLE (Top Notification Bar)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  link_url TEXT,
  bg_color TEXT DEFAULT '#0d3b27',
  text_color TEXT DEFAULT '#ffffff',
  priority INTEGER DEFAULT 1,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 9. TESTIMONIALS TABLE (What Our Customers Say)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_name TEXT NOT NULL,
  author_image TEXT,
  location TEXT DEFAULT 'Manjeri, Malappuram',
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  quote TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 10. ENQUIRIES TABLE (Consultation & Product Enquiries)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  product_interest TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'In Progress', 'Completed', 'Cancelled')),
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 11. NAVIGATION ITEMS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.navigation_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label TEXT NOT NULL,
  path TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_external BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 12. NEWSLETTER SUBSCRIBERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 13. MEDIA ASSETS TABLE (Cloudinary uploads tracker)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cloudinary_id TEXT NOT NULL,
  secure_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  format TEXT,
  folder TEXT DEFAULT 'pvs-ayurvedics',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 14. ADMIN PROFILES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- INDEXES FOR FAST QUERYING
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_published_featured ON public.products(is_published, is_featured);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON public.enquiries(created_at DESC);

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trust_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policies for published / active content
CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public can view active website sections" ON public.website_sections FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can view active trust points" ON public.trust_points FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view published products" ON public.products FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published services" ON public.services FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view active banners" ON public.banners FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active announcements" ON public.announcements FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view published testimonials" ON public.testimonials FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view active navigation items" ON public.navigation_items FOR SELECT USING (is_active = true);

-- 2. Public Insert Policies for Form Submissions
CREATE POLICY "Public can insert enquiries" ON public.enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert newsletter subscriptions" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);

-- 3. Authenticated Admin Full CRUD Policies
CREATE POLICY "Admins have full access to site_settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to website_sections" ON public.website_sections FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to trust_points" ON public.trust_points FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to categories" ON public.categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to products" ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to services" ON public.services FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to banners" ON public.banners FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to announcements" ON public.announcements FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to testimonials" ON public.testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to enquiries" ON public.enquiries FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to navigation_items" ON public.navigation_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to newsletter_subscribers" ON public.newsletter_subscribers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to media_assets" ON public.media_assets FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to admin_profiles" ON public.admin_profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- Migrations for existing databases
-- ------------------------------------------------------------------------------
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS whatsapp_sticky_enabled BOOLEAN DEFAULT true;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS whatsapp_default_message TEXT DEFAULT 'Hello PVS Ayurvedics, I would like to inquire about your Ayurvedic treatments and products.';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS whatsapp_button_label TEXT DEFAULT 'Chat with Us';
