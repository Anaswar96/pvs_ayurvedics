-- ==============================================================================
-- PVS AYURVEDICS — COMPLETE ALL-IN-ONE SUPABASE MIGRATION SCRIPT
-- ==============================================================================
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/_
-- 2. Go to the "SQL Editor" from the left sidebar
-- 3. Click "New query"
-- 4. Copy and paste the entire contents of this file
-- 5. Click "Run" (or Ctrl+Enter / Cmd+Enter)
-- 
-- This script is completely IDEMPOTENT: You can run it multiple times safely.
-- It will create all tables, indexes, triggers, RLS policies, and seed data.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- EXTENSIONS
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. SITE SETTINGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_name TEXT NOT NULL DEFAULT 'PVS Ayurvedics',
  tagline TEXT NOT NULL DEFAULT 'Pure. Natural. Everyday Wellness.',
  malayalam_headline TEXT DEFAULT 'ആരോഗ്യത്തിന് ആയുർവേദത്തിന്റെ കരുതൽ',
  malayalam_tagline TEXT DEFAULT 'ആരോഗ്യത്തിന് ആയുർവേദത്തിന്റെ കരുതൽ - Traditional care for a healthier tomorrow',
  phone TEXT NOT NULL DEFAULT '+91 9061-853-542',
  whatsapp_number TEXT NOT NULL DEFAULT '+919061853542',
  email TEXT NOT NULL DEFAULT 'info@pvsayurvedics.com',
  address TEXT NOT NULL DEFAULT 'Court Road, Manjeri, Malappuram District, Kerala 676121, India',
  city TEXT NOT NULL DEFAULT 'Manjeri',
  state TEXT NOT NULL DEFAULT 'Kerala',
  pincode TEXT DEFAULT '676121',
  working_hours TEXT DEFAULT 'Mon - Sat: 9:00 AM - 7:00 PM | Sun: 9:30 AM - 1:30 PM',
  logo_url TEXT DEFAULT '/images/logo.png',
  favicon_url TEXT DEFAULT '/favicon.ico',
  google_map_embed_url TEXT DEFAULT 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3913.758416801905!2d76.11586527583685!3d11.119760752150117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba64a938b8160ef%3A0x2db42831f457ff0e!2sManjeri%2C%20Kerala!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
  google_map_directions_url TEXT DEFAULT 'https://maps.google.com/?q=Manjeri,+Malappuram,+Kerala',
  facebook_url TEXT DEFAULT 'https://facebook.com/pvsayurvedics',
  instagram_url TEXT DEFAULT 'https://instagram.com/pvsayurvedics',
  youtube_url TEXT DEFAULT 'https://youtube.com/@pvsayurvedics',
  meta_title TEXT DEFAULT 'PVS Ayurvedics | Traditional Care & Natural Ayurvedic Products Manjeri Kerala',
  meta_description TEXT DEFAULT 'Discover genuine Ayurvedic care, consultation, and authentic herbal formulations crafted with pure botanicals at PVS Ayurvedics, Manjeri, Malappuram, Kerala.',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 2. WEBSITE SECTIONS TABLE
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
-- 3. TRUST POINTS TABLE
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
-- 5. PRODUCTS TABLE
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
-- 6. SERVICES TABLE
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
-- 7. BANNERS TABLE
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
-- 8. ANNOUNCEMENTS TABLE
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
-- 9. TESTIMONIALS TABLE
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
-- 10. ENQUIRIES TABLE
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
-- 13. MEDIA ASSETS TABLE
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
-- AUTOMATIC UPDATED_AT TRIGGER FUNCTION
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers safely
DO $$
BEGIN
  DROP TRIGGER IF EXISTS tr_site_settings_updated_at ON public.site_settings;
  CREATE TRIGGER tr_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

  DROP TRIGGER IF EXISTS tr_website_sections_updated_at ON public.website_sections;
  CREATE TRIGGER tr_website_sections_updated_at BEFORE UPDATE ON public.website_sections FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

  DROP TRIGGER IF EXISTS tr_categories_updated_at ON public.categories;
  CREATE TRIGGER tr_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

  DROP TRIGGER IF EXISTS tr_products_updated_at ON public.products;
  CREATE TRIGGER tr_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

  DROP TRIGGER IF EXISTS tr_services_updated_at ON public.services;
  CREATE TRIGGER tr_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

  DROP TRIGGER IF EXISTS tr_banners_updated_at ON public.banners;
  CREATE TRIGGER tr_banners_updated_at BEFORE UPDATE ON public.banners FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

  DROP TRIGGER IF EXISTS tr_announcements_updated_at ON public.announcements;
  CREATE TRIGGER tr_announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

  DROP TRIGGER IF EXISTS tr_testimonials_updated_at ON public.testimonials;
  CREATE TRIGGER tr_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

  DROP TRIGGER IF EXISTS tr_enquiries_updated_at ON public.enquiries;
  CREATE TRIGGER tr_enquiries_updated_at BEFORE UPDATE ON public.enquiries FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
END $$;

-- ------------------------------------------------------------------------------
-- INDEXES FOR FAST PERFORMANCE
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

-- Drop old policies to allow clean re-runs
DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public can view active website sections" ON public.website_sections;
DROP POLICY IF EXISTS "Public can view active trust points" ON public.trust_points;
DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;
DROP POLICY IF EXISTS "Public can view published products" ON public.products;
DROP POLICY IF EXISTS "Public can view published services" ON public.services;
DROP POLICY IF EXISTS "Public can view active banners" ON public.banners;
DROP POLICY IF EXISTS "Public can view active announcements" ON public.announcements;
DROP POLICY IF EXISTS "Public can view published testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Public can view active navigation items" ON public.navigation_items;
DROP POLICY IF EXISTS "Public can insert enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Public can insert newsletter subscriptions" ON public.newsletter_subscribers;

DROP POLICY IF EXISTS "Admins have full access to site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins have full access to website_sections" ON public.website_sections;
DROP POLICY IF EXISTS "Admins have full access to trust_points" ON public.trust_points;
DROP POLICY IF EXISTS "Admins have full access to categories" ON public.categories;
DROP POLICY IF EXISTS "Admins have full access to products" ON public.products;
DROP POLICY IF EXISTS "Admins have full access to services" ON public.services;
DROP POLICY IF EXISTS "Admins have full access to banners" ON public.banners;
DROP POLICY IF EXISTS "Admins have full access to announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admins have full access to testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins have full access to enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Admins have full access to navigation_items" ON public.navigation_items;
DROP POLICY IF EXISTS "Admins have full access to newsletter_subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins have full access to media_assets" ON public.media_assets;
DROP POLICY IF EXISTS "Admins have full access to admin_profiles" ON public.admin_profiles;

-- 1. Public Read Policies
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

-- 2. Public Insert Policies
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

-- Optional: Storage Bucket Setup
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('pvs-media', 'pvs-media', true)
  ON CONFLICT (id) DO NOTHING;
EXCEPTION WHEN OTHERS THEN
  NULL; -- Gracefully skip if storage schema is managed separately
END $$;


-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- 1. Site Settings
INSERT INTO public.site_settings (
  id,
  business_name,
  tagline,
  malayalam_headline,
  malayalam_tagline,
  phone,
  whatsapp_number,
  email,
  address,
  city,
  state,
  pincode,
  working_hours,
  logo_url,
  favicon_url,
  google_map_embed_url,
  google_map_directions_url,
  facebook_url,
  instagram_url,
  youtube_url,
  meta_title,
  meta_description
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'PVS Ayurvedics',
  'Pure. Natural. Everyday Wellness.',
  'ആരോഗ്യത്തിന് ആയുർവേദത്തിന്റെ കരുതൽ',
  'ആരോഗ്യത്തിന് ആയുർവേദത്തിന്റെ കരുതൽ - Traditional care for a healthier tomorrow',
  '+91 9061-853-542',
  '+919061853542',
  'info@pvsayurvedics.com',
  'Court Road, Manjeri, Malappuram District, Kerala 676121, India',
  'Manjeri',
  'Kerala',
  '676121',
  'Mon - Sat: 9:00 AM - 7:00 PM | Sun: 9:30 AM - 1:30 PM',
  '/images/logo.png',
  '/favicon.ico',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3913.758416801905!2d76.11586527583685!3d11.119760752150117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba64a938b8160ef%3A0x2db42831f457ff0e!2sManjeri%2C%20Kerala!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
  'https://maps.google.com/?q=Manjeri,+Malappuram,+Kerala',
  'https://facebook.com/pvsayurvedics',
  'https://instagram.com/pvsayurvedics',
  'https://youtube.com/@pvsayurvedics',
  'PVS Ayurvedics | Traditional Care & Natural Ayurvedic Products Manjeri Kerala',
  'Discover genuine Ayurvedic care, consultation, and authentic herbal formulations crafted with pure botanicals at PVS Ayurvedics, Manjeri, Malappuram, Kerala.'
)
ON CONFLICT (id) DO UPDATE SET
  business_name = EXCLUDED.business_name,
  phone = EXCLUDED.phone,
  whatsapp_number = EXCLUDED.whatsapp_number,
  address = EXCLUDED.address,
  logo_url = EXCLUDED.logo_url;

-- 2. Website Sections
INSERT INTO public.website_sections (
  section_key,
  section_name,
  title,
  subtitle,
  content,
  cta_text,
  cta_url,
  secondary_cta_text,
  secondary_cta_url,
  image_url,
  mobile_image_url,
  is_visible,
  sort_order
) VALUES
(
  'hero',
  'Hero Section',
  'ആരോഗ്യത്തിന് ആയുർവേദത്തിന്റെ കരുതൽ',
  'TRADITIONAL CARE • MODERN WELLBEING',
  'Pure. Natural. Everyday Wellness. Bringing the wisdom of Ayurveda to your everyday life.',
  'Explore Our Products',
  '/products',
  'Chat on WhatsApp',
  'https://wa.me/919061853542?text=Hello%20PVS%20Ayurvedics,%20I%20would%20like%20to%20know%20more%20about%20your%20Ayurvedic%20products.',
  '/images/hero-ayurvedic.svg',
  '/images/hero-ayurvedic.svg',
  true,
  1
),
(
  'our_story',
  'Our Story / About Section',
  'Rooted in Tradition, Caring for Generations',
  'OUR STORY',
  'At PVS Ayurvedics, we bring the wisdom of Ayurveda closer to your everyday life. Our focus is on natural care, thoughtful consultation, and wellness for the entire family.',
  'Learn More',
  '/about',
  NULL,
  NULL,
  '/images/story-ayurveda.svg',
  NULL,
  true,
  2
),
(
  'products',
  'Products Showcase Section',
  'Pure Ayurvedic Products for Everyday Wellness',
  'OUR PRODUCTS',
  'Formulated with time-tested Ayurvedic herbs to support vitality, harmony, and sustainable wellbeing.',
  'View All Products',
  '/products',
  NULL,
  NULL,
  NULL,
  NULL,
  true,
  3
),
(
  'services',
  'Services Section',
  'Holistic Care for Your Well-being',
  'OUR SERVICES',
  'Personalized Ayurvedic treatments and therapies designed for deep healing and lifestyle rejuvenation.',
  'View All Services',
  '/services',
  NULL,
  NULL,
  NULL,
  NULL,
  true,
  4
),
(
  'kerala_story',
  'Kerala Heritage Section',
  'Wellness Rooted in Kerala',
  'OUR HERITAGE',
  'A calm, welcoming environment where traditional Ayurvedic principles meet modern care.',
  'Watch Our Story',
  '/about#heritage',
  NULL,
  NULL,
  '/images/kerala-heritage.svg',
  NULL,
  true,
  5
),
(
  'cta_journey',
  'Wellness Journey CTA Banner',
  'Your Wellness Journey Starts Here.',
  NULL,
  'Have a question or need guidance? Our team is here to help.',
  'Book a Consultation',
  '/enquiry',
  'Chat on WhatsApp',
  'https://wa.me/919061853542?text=Hello%20PVS%20Ayurvedics,%20I%20want%20to%20book%20an%20Ayurvedic%20consultation.',
  '/images/journey-banner.svg',
  NULL,
  true,
  6
),
(
  'enquiry',
  'Consultation & Enquiry Section',
  'Send Us an Enquiry',
  'CONSULTATION',
  'We will get back to you soon. Your details will be used only to respond to your enquiry.',
  'Submit Enquiry',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true,
  7
),
(
  'location',
  'Location & Contact Section',
  'Visit Our Location',
  'MANJERI, MALAPPURAM, KERALA',
  'Our clinic is easily accessible in the heart of Manjeri, Malappuram.',
  'Get Directions',
  'https://maps.google.com/?q=Manjeri,+Malappuram,+Kerala',
  NULL,
  NULL,
  '/images/manjeri-map.svg',
  NULL,
  true,
  8
)
ON CONFLICT (section_key) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  content = EXCLUDED.content,
  cta_text = EXCLUDED.cta_text,
  cta_url = EXCLUDED.cta_url,
  image_url = EXCLUDED.image_url;

-- 3. Trust Points
INSERT INTO public.trust_points (title, subtitle, icon_name, sort_order, is_active) VALUES
('Natural Ingredients', 'Pure herbs & botanical extracts', 'Leaf', 1, true),
('Trusted Ayurvedic Care', 'Centuries of herbal wisdom', 'ShieldCheck', 2, true),
('Safe & Gentle', 'Carefully balanced formulations', 'HeartHandshake', 3, true),
('Manjeri, Malappuram', 'Accessible Kerala clinic', 'MapPin', 4, true),
('Quality Focused', 'Strict Ayurvedic standards', 'Award', 5, true),
('People Centred', 'Personalized healing plans', 'Users', 6, true),
('Community Care', 'Holistic family wellness', 'Trees', 7, true)
ON CONFLICT DO NOTHING;

-- 4. Categories
INSERT INTO public.categories (name, slug, description, image_url, sort_order, is_active) VALUES
('Hair Care', 'hair-care', 'Herbal hair oils, tonics, and natural scalp rejuvenators', '/images/categories/hair.svg', 1, true),
('Immunity & Vitality', 'immunity-care', 'Formulations to enhance natural body resistance and Ojas', '/images/categories/immunity.svg', 2, true),
('Digestive Health', 'digestive-support', 'Gut health, digestion, metabolism, and appetite balance', '/images/categories/digestive.svg', 3, true),
('Skin & Beauty', 'skin-care', 'Pure herbal creams and radiant skin oils', '/images/categories/skin.svg', 4, true),
('Respiratory Health', 'respiratory-care', 'Soothing chest formulations and breath ease syrups', '/images/categories/respiratory.svg', 5, true),
('Pain Relief & Joint Care', 'pain-relief', 'Traditional thailams and oils for muscle and joint aches', '/images/categories/pain.svg', 6, true),
('Women''s Health', 'womens-wellness', 'Hormonal balance and vital rejuvenation for women', '/images/categories/women.svg', 7, true),
('Kids Care', 'kids-care', 'Gentle and nourishing wellness for growing children', '/images/categories/kids.svg', 8, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url;

-- 5. Products (10 Authentic Kerala Ayurvedic Products)
DO $$
DECLARE
  cat_hair UUID;
  cat_imm UUID;
  cat_dig UUID;
  cat_skin UUID;
  cat_resp UUID;
  cat_pain UUID;
  cat_women UUID;
  cat_kids UUID;
BEGIN
  SELECT id INTO cat_hair FROM public.categories WHERE slug = 'hair-care' LIMIT 1;
  SELECT id INTO cat_imm FROM public.categories WHERE slug = 'immunity-care' LIMIT 1;
  SELECT id INTO cat_dig FROM public.categories WHERE slug = 'digestive-support' LIMIT 1;
  SELECT id INTO cat_skin FROM public.categories WHERE slug = 'skin-care' LIMIT 1;
  SELECT id INTO cat_resp FROM public.categories WHERE slug = 'respiratory-care' LIMIT 1;
  SELECT id INTO cat_pain FROM public.categories WHERE slug = 'pain-relief' LIMIT 1;
  SELECT id INTO cat_women FROM public.categories WHERE slug = 'womens-wellness' LIMIT 1;
  SELECT id INTO cat_kids FROM public.categories WHERE slug = 'kids-care' LIMIT 1;

  INSERT INTO public.products (
    name, slug, category_id, sku, short_description, full_description,
    price, mrp, main_image, gallery_images, ingredients, usage_instructions, benefits,
    is_featured, is_published, in_stock, sort_order, meta_title, meta_description
  ) VALUES
  (
    'Herbal Hair Oil',
    'herbal-hair-oil',
    cat_hair,
    'PVS-OIL-001',
    'Nourishes scalp and promotes healthy hair',
    'PVS Herbal Hair Oil is prepared according to traditional Kerala Ayurvedic thailam preparations. Infused with fresh Bringaraja, Neeli, Amla, and Brahmi simmered slowly in pure cold-pressed coconut oil, it deeply penetrates hair roots to prevent premature greying, relieve scalp stress, and boost thick hair growth.',
    320.00,
    380.00,
    '/images/products/herbal-hair-oil.svg',
    ARRAY['/images/products/herbal-hair-oil.svg'],
    ARRAY['Bhringraj (Eclipta Alba)', 'Neelibringadi Herbs', 'Indian Gooseberry (Amalaki)', 'Brahmi (Bacopa Monnieri)', 'Virgin Coconut Oil', 'Mulethi (Licorice)'],
    'Take a generous amount and gently massage into the scalp using circular motions. Leave on for at least 30-45 minutes before bathing, or leave overnight for deep nourishment.',
    ARRAY['Strengthens hair follicles from the root', 'Reduces hair fall and breakage', 'Soothes itchy and dry scalp', 'Cooling effect that calms the mind and aids peaceful sleep'],
    true, true, true, 1,
    'Herbal Hair Oil | Traditional Ayurvedic Hair Care - PVS Ayurvedics',
    'Experience pure Kerala Ayurvedic Herbal Hair Oil with Bringaraja and Amla to strengthen roots and promote thick hair.'
  ),
  (
    'Immunity Care',
    'immunity-care',
    cat_imm,
    'PVS-IMM-002',
    'Supports natural defence',
    'Formulated with organic Amla, Giloy (Guduchi), Ashwagandha, and Tulsi, PVS Immunity Care strengthens the body''s natural resilience (Vyadhikshamatva). It enhances cellular energy and protects against seasonal allergies and fatigue.',
    450.00,
    520.00,
    '/images/products/immunity-care.svg',
    ARRAY['/images/products/immunity-care.svg'],
    ARRAY['Guduchi (Tinospora Cordifolia)', 'Ashwagandha (Withania Somnifera)', 'Amalaki (Phyllanthus Emblica)', 'Tulsi (Holy Basil)', 'Yashtimadhu', 'Pippali'],
    'Take 1 to 2 capsules or half a teaspoon with warm water or milk twice daily after meals, or as directed by an Ayurvedic physician.',
    ARRAY['Boosts natural immune defense', 'Enhances stamina and vitality', 'Fights seasonal infections and lethargy', 'Rich in natural antioxidants'],
    true, true, true, 2,
    'Immunity Care | Ayurvedic Immune Support - PVS Ayurvedics',
    'Strengthen your natural defense with PVS Immunity Care, enriched with Giloy, Ashwagandha, and Amla.'
  ),
  (
    'Digestive Support',
    'digestive-support',
    cat_dig,
    'PVS-DIG-003',
    'For a healthier gut',
    'A classical Ayurvedic digestive formulation crafted with roasted Jeeraka, Shunthi (Dry Ginger), Triphala, and Hing. It stimulates the digestive fire (Jatharagni), eases bloating, and ensures smooth bowel regularity.',
    280.00,
    340.00,
    '/images/products/digestive-support.svg',
    ARRAY['/images/products/digestive-support.svg'],
    ARRAY['Triphala (Haritaki, Bibhitaki, Amalaki)', 'Shunthi (Zingiber Officinale)', 'Jeeraka (Cuminum Cyminum)', 'Saindhava Lavana', 'Maricha (Black Pepper)'],
    'Mix 1 teaspoon in a glass of lukewarm water and consume 15 minutes before or after meals.',
    ARRAY['Relieves indigestion, acidity, and gas', 'Maintains optimal gut flora', 'Aids nutrient absorption', 'Gentle colon detox and regularity'],
    true, true, true, 3,
    'Digestive Support | Ayurvedic Gut Health - PVS Ayurvedics',
    'Restore gut harmony and ease bloating with PVS Digestive Support formulation.'
  ),
  (
    'Skin Care Cream',
    'skin-care-cream',
    cat_skin,
    'PVS-SKN-004',
    'Natural care for healthy skin',
    'PVS Skin Care Cream blends pure saffron (Kumkuma), Manjistha, Sandalwood (Chandana), and Aloe Vera in a nourishing botanical base. It revitalizes dull skin, reduces blemishes, and restores natural radiance without harsh chemicals.',
    390.00,
    460.00,
    '/images/products/skin-care-cream.svg',
    ARRAY['/images/products/skin-care-cream.svg'],
    ARRAY['Kumkumadi Tailam Extract', 'Pure Red Sandalwood (Rakta Chandana)', 'Manjistha (Rubia Cordifolia)', 'Aloe Vera (Kumari)', 'Almond Oil', 'Kokum Butter'],
    'Apply a small amount evenly on cleansed face and neck every morning and night. Massage softly in upward strokes.',
    ARRAY['Promotes natural skin luminosity', 'Helps fade dark spots and uneven tone', 'Hydrates deeply without clogging pores', '100% free of parabens and synthetic fragrances'],
    true, true, true, 4,
    'Skin Care Cream | Ayurvedic Glow & Radiance - PVS Ayurvedics',
    'Infused with saffron and Manjistha for a nourished, clear, and glowing complexion.'
  ),
  (
    'Respiratory Care',
    'respiratory-care',
    cat_resp,
    'PVS-RSP-005',
    'Supports easier breathing',
    'A soothing blend of Vasa (Adhatoda), Kantakari, Tulsi, and Licorice formulated to clear airway congestion, soothe throat irritation, and promote effortless, clear respiration throughout all seasons.',
    260.00,
    310.00,
    '/images/products/respiratory-care.svg',
    ARRAY['/images/products/respiratory-care.svg'],
    ARRAY['Vasa (Adhatoda Vasica)', 'Kantakari (Solanum Xanthocarpum)', 'Tulsi', 'Yashtimadhu', 'Natural Honey'],
    'Adults: 10-15 ml twice daily after meals with warm water. Children: 5 ml under adult supervision.',
    ARRAY['Soothes bronchial congestion', 'Calms productive and dry cough', 'Relieves throat soreness', 'Protects against environmental dust and pollen'],
    true, true, true, 5,
    'Respiratory Care | Ayurvedic Breath Support - PVS Ayurvedics',
    'Ease respiratory discomfort and support lung wellness with Vasa and Tulsi herbal syrup.'
  ),
  (
    'Pain Relief Oil',
    'pain-relief-oil',
    cat_pain,
    'PVS-OIL-006',
    'Soothing herbal care',
    'A potent Kerala pain-relieving thailam combining Murivenna and Mahanarayana herbal principles. Contains Camphor, Gandhapura, Eucalyptus, and Shallaki for fast relief from stiff joints, muscular cramps, and backaches.',
    340.00,
    399.00,
    '/images/products/pain-relief-oil.svg',
    ARRAY['/images/products/pain-relief-oil.svg'],
    ARRAY['Mahanarayana Tailam Ingredients', 'Shallaki (Boswellia Serrata)', 'Karpooram (Natural Camphor)', 'Gandhapura Oil (Wintergreen)', 'Sesame Oil Base'],
    'Gently apply over the affected painful area and massage lightly for 5-10 minutes. For better results, follow with mild warm fomentation.',
    ARRAY['Fast relief from joint and muscular aches', 'Reduces morning stiffness', 'Improves joint mobility and flexibility', 'Deep penetrating soothing warmth'],
    true, true, true, 6,
    'Pain Relief Oil | Ayurvedic Muscle & Joint Oil - PVS Ayurvedics',
    'Traditional Kerala pain relief oil for back, knee, and muscular ache relief.'
  ),
  (
    'Detox Herbal Drink',
    'detox-herbal-drink',
    cat_dig,
    'PVS-DTX-007',
    'Natural cleansing support',
    'An invigorating herbal infusion of Moringa, Green Tea extract, Fennel, Cardamom, and Coriander seeds designed to flush out metabolic waste (Ama), revitalize liver function, and boost metabolic energy.',
    290.00,
    350.00,
    '/images/products/detox-drink.svg',
    ARRAY['/images/products/detox-drink.svg'],
    ARRAY['Moringa Leaf Extract', 'Dhanyaka (Coriander)', 'Mishreya (Fennel)', 'Elaichi (Cardamom)', 'Punarnava', 'Lemongrass'],
    'Infuse 1 tea bag or 1 scoop in a cup of boiling water for 3 to 5 minutes. Drink fresh in the morning or post lunch.',
    ARRAY['Aids cellular toxin elimination', 'Boosts energy without caffeine spikes', 'Promotes healthy fluid balance', 'Refreshing botanical aroma'],
    true, true, true, 7,
    'Detox Herbal Drink | Natural Cleansing Tea - PVS Ayurvedics',
    'Support liver health and detoxify your body naturally with Ayurvedic herbs.'
  ),
  (
    'Women''s Wellness',
    'womens-wellness',
    cat_women,
    'PVS-WMN-008',
    'Everyday balance and care',
    'Crafted specially for women''s changing hormonal needs, this formulation brings together Shatavari (Asparagus Racemosus), Ashoka bark, Lodhra, and Iron-rich herb extracts to support regular cycles, calmness, and vitality.',
    420.00,
    499.00,
    '/images/products/womens-wellness.svg',
    ARRAY['/images/products/womens-wellness.svg'],
    ARRAY['Shatavari (Asparagus Racemosus)', 'Ashoka (Saraca Asoca)', 'Lodhra (Symplocos Racemosa)', 'Kumari', 'Dhatri Loha'],
    'Take 1 tablet or 10 ml syrup twice daily with lukewarm water or milk after food.',
    ARRAY['Promotes balanced hormonal cycles', 'Relieves fatigue and mood fluctuations', 'Supports reproductive wellness and bone density', 'Nourishes the female system naturally'],
    true, true, true, 8,
    'Women''s Wellness | Ayurvedic Female Vitality - PVS Ayurvedics',
    'Nurture your feminine health with pure Shatavari and Ashoka Ayurvedic formulation.'
  ),
  (
    'Joint Care',
    'joint-care',
    cat_pain,
    'PVS-JNT-009',
    'Supports active lifestyle',
    'Formulated with high-potency Boswellia (Shallaki), Guggulu, Rasna, and Hadjod (Cissus Quadrangularis) to rebuild synovial comfort, strengthen cartilage, and support effortless movement at any age.',
    480.00,
    560.00,
    '/images/products/joint-care.svg',
    ARRAY['/images/products/joint-care.svg'],
    ARRAY['Shallaki (Boswellia Serrata)', 'Yograj Guggulu', 'Rasna (Pluchea Lanceolata)', 'Asthisanharaka (Hadjod)', 'Ashwagandha'],
    'Take 1 tablet twice daily after meals with warm water.',
    ARRAY['Supports joint cartilage integrity', 'Eases walking and knee stiffness', 'Promotes bone and ligament strength', 'Anti-inflammatory Ayurvedic support'],
    true, true, true, 9,
    'Joint Care | Ayurvedic Bone & Cartilage Health - PVS Ayurvedics',
    'Stay active and pain-free with Shallaki and Guggulu joint comfort tablets.'
  ),
  (
    'Kids Care',
    'kids-care',
    cat_kids,
    'PVS-KID-010',
    'Gentle care for growing kids',
    'A safe and gentle pediatric Ayurvedic elixir with Shankhpushpi, Brahmi, Almond extract, and Vacha in natural honey. Supports cognitive focus, healthy appetite, and robust childhood immunity.',
    310.00,
    370.00,
    '/images/products/kids-care.svg',
    ARRAY['/images/products/kids-care.svg'],
    ARRAY['Shankhpushpi (Convolvulus Pluricaulis)', 'Brahmi (Bacopa Monnieri)', 'Vacha (Acorus Calamus)', 'Jyotishmati', 'Pure Forest Honey', 'Yashtimadhu'],
    'Children aged 3-12: 5 ml once or twice daily after food or with warm milk.',
    ARRAY['Enhances memory, alertness, and attention span', 'Supports calm restful sleep and digestion', 'Gentle 100% natural pediatric formulation', 'Pleasant taste children enjoy'],
    true, true, true, 10,
    'Kids Care | Gentle Ayurvedic Pediatric Health - PVS Ayurvedics',
    'Support cognitive vitality, learning, and strong immunity for children naturally.'
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    category_id = EXCLUDED.category_id,
    short_description = EXCLUDED.short_description,
    full_description = EXCLUDED.full_description,
    price = EXCLUDED.price,
    mrp = EXCLUDED.mrp,
    main_image = EXCLUDED.main_image,
    ingredients = EXCLUDED.ingredients,
    benefits = EXCLUDED.benefits;
END $$;

-- 6. Services
INSERT INTO public.services (title, slug, short_description, full_description, icon_name, image_url, benefits, sort_order, is_published) VALUES
(
  'Ayurvedic Consultation',
  'ayurvedic-consultation',
  'Personalized guidance for your health concerns',
  'One-on-one comprehensive pulse diagnosis (Nadi Pariksha), constitution assessment (Prakriti analysis), and targeted lifestyle and herbal prescriptions by experienced Ayurvedic physicians.',
  'Stethoscope',
  '/images/services/consultation.svg',
  ARRAY['In-depth Nadi Pariksha (Pulse Assessment)', 'Personalized herbal medication regimen', 'Customized diet and daily routine (Dinacharya) guidelines', 'Online and in-clinic consultation options'],
  1,
  true
),
(
  'Wellness Programs',
  'wellness-programs',
  'Lifestyle guidance for a healthier you',
  'Curated wellness packages targeting chronic stress, metabolic balance, detoxification, immune rejuvenation, and postpartum recovery rooted in authentic Kerala Ayurveda.',
  'Sparkles',
  '/images/services/wellness.svg',
  ARRAY['Panchakarma detox plans', 'Stress relief and rejuvenation therapies', 'Metabolic and weight management protocols', 'Post-illness restorative care'],
  2,
  true
),
(
  'Herbal Products',
  'herbal-products',
  'Natural products for everyday wellness',
  'Authentic, lab-tested herbal formulations prepared from ethically harvested wildcrafted herbs without synthetic colors or chemicals.',
  'Package',
  '/images/services/herbal-products.svg',
  ARRAY['Traditional Kerala thailams and kashayams', 'Immunity and respiratory elixirs', 'Nourishing herbal hair and skin cosmetics', 'Certified pure ingredients'],
  3,
  true
),
(
  'Follow-up Support',
  'follow-up-support',
  'Continuous care and guidance',
  'Dedicated medical follow-up, dosage adjustments, health tracking, and wellness check-ins to support your lifelong healing journey.',
  'Users',
  '/images/services/follow-up.svg',
  ARRAY['Direct WhatsApp physician support', 'Periodic recovery review milestones', 'Dietary refinement as health improves', 'Friendly patient care team in Manjeri'],
  4,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  image_url = EXCLUDED.image_url,
  benefits = EXCLUDED.benefits;

-- 7. Promotional Banners
INSERT INTO public.banners (
  title, subtitle, cta_text, cta_url, desktop_image, mobile_image, placement, features, sort_order, is_active
) VALUES
(
  'Natural Solutions for a Healthier You',
  'Authentic herbal formulations crafted with pure botanicals and decades of Ayurvedic wisdom in Manjeri, Kerala.',
  'Explore Products',
  '/products',
  '/images/banners/promo-banner.svg',
  '/images/banners/promo-banner.svg',
  'home_sidebar',
  ARRAY['Herbal Formulations', 'Quality Ingredients', 'Daily Wellness Support'],
  1,
  true
)
ON CONFLICT DO NOTHING;

-- 8. Announcements
INSERT INTO public.announcements (
  text, link_url, bg_color, text_color, priority, is_active
) VALUES
(
  '🌿 Natural Care for a Healthier Tomorrow | Consultation available at Manjeri Clinic & via WhatsApp',
  '/enquiry',
  '#0d3b27',
  '#ffffff',
  1,
  true
)
ON CONFLICT DO NOTHING;

-- 9. Testimonials
INSERT INTO public.testimonials (
  author_name, author_image, location, rating, quote, is_featured, sort_order, is_published
) VALUES
(
  'Anjali',
  '/images/testimonials/anjali.svg',
  'Manjeri, Malappuram',
  5,
  'The products are really good and the team is very supportive. Natural care that we can trust.',
  true,
  1,
  true
),
(
  'Muhammed Rashid',
  '/images/testimonials/rashid.svg',
  'Manjeri, Malappuram',
  5,
  'The herbal hair oil and pain relief oil are authentic Kerala preparations. Exceptional quality and visible results.',
  true,
  2,
  true
),
(
  'Dr. Priya Menon',
  '/images/testimonials/priya.svg',
  'Kozhikode, Kerala',
  5,
  'Detailed doctor consultation and genuine Ayurvedic advice. Very happy with the compassionate guidance and natural care.',
  true,
  3,
  true
)
ON CONFLICT DO NOTHING;

-- 10. Navigation Items
INSERT INTO public.navigation_items (label, path, sort_order, is_active, is_external) VALUES
('Home', '/', 1, true, false),
('About Us', '/about', 2, true, false),
('Products', '/products', 3, true, false),
('Services', '/services', 4, true, false),
('Our Approach', '/about#approach', 5, true, false),
('Contact', '/contact', 6, true, false)
ON CONFLICT DO NOTHING;

-- 11. Initial Sample Enquiries (for Admin Dashboard preview)
INSERT INTO public.enquiries (
  full_name, phone, email, product_interest, message, status, internal_notes
) VALUES
(
  'Suresh Kumar',
  '+91 98471 23456',
  'suresh.k@gmail.com',
  'Herbal Hair Oil',
  'I am experiencing severe hair thinning and dandruff. Would like to consult regarding the Herbal Hair Oil treatment.',
  'New',
  'Priority follow-up via WhatsApp.'
),
(
  'Fathima Beevi',
  '+91 97455 89123',
  'fathima.b@yahoo.com',
  'Pain Relief Oil',
  'Enquiring for my mother who has persistent knee joint pain and morning stiffness. Can we visit the Manjeri clinic?',
  'Contacted',
  'Called back, scheduled appointment for Saturday 10:30 AM.'
),
(
  'Rahul Sharma',
  '+91 94470 56789',
  'rahul.s@outlook.com',
  'Immunity Care',
  'Interested in general wellness and immunity booster for family before monsoon season.',
  'Completed',
  'Product dispatched with doctor instructions.'
)
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- MIGRATION COMPLETE!
-- Your Supabase database is now fully configured and seeded for PVS Ayurvedics.
-- ==============================================================================
