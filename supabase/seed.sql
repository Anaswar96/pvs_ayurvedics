-- ==============================================================================
-- PVS AYURVEDICS - INITIAL SEED DATA
-- Matches Official UI Reference & Kerala Ayurvedic Brand Direction
-- ==============================================================================

-- 1. Site Settings
INSERT INTO public.site_settings (
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
  'PVS Ayurvedics | Pure Ayurvedic Care & Herbal Products in Manjeri, Kerala',
  'Discover genuine Ayurvedic care, consultation, and authentic herbal formulations crafted with pure botanicals at PVS Ayurvedics, Manjeri, Malappuram, Kerala.'
) ON CONFLICT DO NOTHING;

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
  'https://wa.me/919061853542?text=Hello%20PVS%20Ayurvedics,%20I%20would%20like%20to%20know%20more%20about%20your%20Ayurvedic%20products%20and%20consultation.',
  '/images/hero-ayurvedic.png',
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
  '/images/story-ayurveda.png',
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
  '/images/kerala-heritage.png',
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
  '/images/journey-banner.png',
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
  '/images/manjeri-map.png',
  true,
  8
) ON CONFLICT (section_key) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  content = EXCLUDED.content,
  cta_text = EXCLUDED.cta_text,
  cta_url = EXCLUDED.cta_url;

-- 3. Trust Points (Hero & About values)
INSERT INTO public.trust_points (title, subtitle, icon_name, sort_order) VALUES
('Natural Ingredients', 'Pure herbs & botanical extracts', 'Leaf', 1),
('Trusted Ayurvedic Care', 'Centuries of herbal wisdom', 'ShieldCheck', 2),
('Safe & Gentle', 'Carefully balanced formulations', 'HeartHandshake', 3),
('Manjeri, Malappuram', 'Accessible Kerala clinic', 'MapPin', 4),
('Quality Focused', 'Strict Ayurvedic standards', 'Award', 5),
('People Centred', 'Personalized healing plans', 'Users', 6),
('Community Care', 'Holistic family wellness', 'Trees', 7);

-- 4. Categories
INSERT INTO public.categories (name, slug, description, sort_order) VALUES
('Hair Care', 'hair-care', 'Herbal hair oils, tonics, and natural scalp rejuvenators', 1),
('Immunity & Vitality', 'immunity-care', 'Formulations to enhance natural body resistance and Ojas', 2),
('Digestive Health', 'digestive-support', 'Gut health, digestion, metabolism, and appetite balance', 3),
('Skin & Beauty', 'skin-care', 'Pure herbal creams and radiant skin oils', 4),
('Respiratory Health', 'respiratory-care', 'Soothing chest formulations and breath ease syrups', 5),
('Pain Relief & Joint Care', 'pain-relief', 'Traditional thailams and oils for muscle and joint aches', 6),
('Women''s Health', 'womens-wellness', 'Hormonal balance and vital rejuvenation for women', 7),
('Kids Care', 'kids-care', 'Gentle and nourishing wellness for growing children', 8)
ON CONFLICT (slug) DO NOTHING;

-- 5. Products (10 Authentic Ayurvedic Products from UI mockup)
DO $$
DECLARE
  cat_hair UUID;
  cat_imm UUID;
  cat_dig UUID;
  cat_skin UUID;
  cat_resp UUID;
  cat_pain UUID;
  cat_detox UUID;
  cat_women UUID;
  cat_joint UUID;
  cat_kids UUID;
BEGIN
  SELECT id INTO cat_hair FROM public.categories WHERE slug = 'hair-care' LIMIT 1;
  SELECT id INTO cat_imm FROM public.categories WHERE slug = 'immunity-care' LIMIT 1;
  SELECT id INTO cat_dig FROM public.categories WHERE slug = 'digestive-support' LIMIT 1;
  SELECT id INTO cat_skin FROM public.categories WHERE slug = 'skin-care' LIMIT 1;
  SELECT id INTO cat_resp FROM public.categories WHERE slug = 'respiratory-care' LIMIT 1;
  SELECT id INTO cat_pain FROM public.categories WHERE slug = 'pain-relief' LIMIT 1;
  SELECT id INTO cat_detox FROM public.categories WHERE slug = 'digestive-support' LIMIT 1;
  SELECT id INTO cat_women FROM public.categories WHERE slug = 'womens-wellness' LIMIT 1;
  SELECT id INTO cat_joint FROM public.categories WHERE slug = 'pain-relief' LIMIT 1;
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
    '/images/products/herbal-hair-oil.png',
    ARRAY['/images/products/herbal-hair-oil.png', '/images/products/herbal-hair-oil-2.png'],
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
    '/images/products/immunity-care.png',
    ARRAY['/images/products/immunity-care.png'],
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
    '/images/products/digestive-support.png',
    ARRAY['/images/products/digestive-support.png'],
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
    '/images/products/skin-care-cream.png',
    ARRAY['/images/products/skin-care-cream.png'],
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
    '/images/products/respiratory-care.png',
    ARRAY['/images/products/respiratory-care.png'],
    ARRAY['Vasa (Adhatoda Vasica)', 'Kantakari (Solanum Xanthocarpum)', 'Tulsi', 'Yashtimadhu', 'Kantakari', 'Natural Honey'],
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
    '/images/products/pain-relief-oil.png',
    ARRAY['/images/products/pain-relief-oil.png'],
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
    cat_detox,
    'PVS-DTX-007',
    'Natural cleansing support',
    'An invigorating herbal infusion of Moringa, Green Tea extract, Fennel, Cardamom, and Coriander seeds designed to flush out metabolic waste (Ama), revitalize liver function, and boost metabolic energy.',
    290.00,
    350.00,
    '/images/products/detox-drink.png',
    ARRAY['/images/products/detox-drink.png'],
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
    '/images/products/womens-wellness.png',
    ARRAY['/images/products/womens-wellness.png'],
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
    cat_joint,
    'PVS-JNT-009',
    'Supports active lifestyle',
    'Formulated with high-potency Boswellia (Shallaki), Guggulu, Rasna, and Hadjod (Cissus Quadrangularis) to rebuild synovial comfort, strengthen cartilage, and support effortless movement at any age.',
    480.00,
    560.00,
    '/images/products/joint-care.png',
    ARRAY['/images/products/joint-care.png'],
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
    '/images/products/kids-care.png',
    ARRAY['/images/products/kids-care.png'],
    ARRAY['Shankhpushpi (Convolvulus Pluricaulis)', 'Brahmi (Bacopa Monnieri)', 'Vacha (Acorus Calamus)', 'Jyotishmati', 'Pure Forest Honey', 'Yashtimadhu'],
    'Children aged 3-12: 5 ml once or twice daily after food or with warm milk.',
    ARRAY['Enhances memory, alertness, and attention span', 'Supports calm restful sleep and digestion', 'Gentle 100% natural pediatric formulation', 'Pleasant taste children enjoy'],
    true, true, true, 10,
    'Kids Care | Gentle Ayurvedic Pediatric Health - PVS Ayurvedics',
    'Support cognitive vitality, learning, and strong immunity for children naturally.'
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    short_description = EXCLUDED.short_description,
    full_description = EXCLUDED.full_description,
    price = EXCLUDED.price,
    ingredients = EXCLUDED.ingredients,
    benefits = EXCLUDED.benefits;
END $$;

-- 6. Services (Holistic Care for Your Well-being)
INSERT INTO public.services (title, slug, short_description, full_description, icon_name, image_url, benefits, sort_order) VALUES
(
  'Ayurvedic Consultation',
  'ayurvedic-consultation',
  'Personalized guidance for your health concerns',
  'One-on-one comprehensive pulse diagnosis (Nadi Pariksha), constitution assessment (Prakriti analysis), and targeted lifestyle and herbal prescriptions by experienced Ayurvedic physicians.',
  'Stethoscope',
  '/images/services/consultation.png',
  ARRAY['In-depth Nadi Pariksha (Pulse Assessment)', 'Personalized herbal medication regimen', 'Customized diet and daily routine (Dinacharya) guidelines', 'Online and in-clinic consultation options'],
  1
),
(
  'Wellness Programs',
  'wellness-programs',
  'Lifestyle guidance for a healthier you',
  'Curated wellness packages targeting chronic stress, metabolic balance, detoxification, immune rejuvenation, and postpartum recovery rooted in authentic Kerala Ayurveda.',
  'Sparkles',
  '/images/services/wellness.png',
  ARRAY['Panchakarma detox plans', 'Stress relief and rejuvenation therapies', 'Metabolic and weight management protocols', 'Post-illness restorative care'],
  2
),
(
  'Herbal Products',
  'herbal-products',
  'Natural products for everyday wellness',
  'Authentic, lab-tested herbal formulations prepared from ethically harvested wildcrafted herbs without synthetic colors or chemicals.',
  'Package',
  '/images/services/herbal-products.png',
  ARRAY['Traditional Kerala thailams and kashayams', 'Immunity and respiratory elixirs', 'Nourishing herbal hair and skin cosmetics', 'Certified pure ingredients'],
  3
),
(
  'Follow-up Support',
  'follow-up-support',
  'Continuous care and guidance',
  'Dedicated medical follow-up, dosage adjustments, health tracking, and wellness check-ins to support your lifelong healing journey.',
  'Users',
  '/images/services/follow-up.png',
  ARRAY['Direct WhatsApp physician support', 'Periodic recovery review milestones', 'Dietary refinement as health improves', 'Friendly patient care team in Manjeri'],
  4
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description;

-- 7. Promotional Banners
INSERT INTO public.banners (
  title, subtitle, cta_text, cta_url, desktop_image, mobile_image, placement, features, sort_order
) VALUES
(
  'Natural Solutions for a Healthier You',
  'Authentic herbal formulations crafted with pure botanicals and decades of Ayurvedic wisdom in Manjeri, Kerala.',
  'Explore Products',
  '/products',
  '/images/banners/promo-banner.png',
  '/images/banners/promo-banner-mobile.png',
  'home_sidebar',
  ARRAY['Herbal Formulations', 'Quality Ingredients', 'Daily Wellness Support'],
  1
);

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
);

-- 9. Testimonials (What Our Customers Say)
INSERT INTO public.testimonials (
  author_name, author_image, location, rating, quote, is_featured, sort_order
) VALUES
(
  'Anjali',
  '/images/testimonials/anjali.png',
  'Manjeri, Malappuram',
  5,
  'The products are really good and the team is very supportive. Natural care that we can trust.',
  true,
  1
),
(
  'Muhammed Rashid',
  '/images/testimonials/rashid.png',
  'Manjeri, Malappuram',
  5,
  'The herbal hair oil and pain relief oil are authentic Kerala preparations. Exceptional quality and visible results.',
  true,
  2
),
(
  'Dr. Priya Menon',
  '/images/testimonials/priya.png',
  'Kozhikode, Kerala',
  5,
  'Detailed doctor consultation and genuine Ayurvedic advice. Very happy with the compassionate guidance and natural care.',
  true,
  3
);

-- 10. Navigation Items
INSERT INTO public.navigation_items (label, path, sort_order, is_active) VALUES
('Home', '/', 1, true),
('About Us', '/about', 2, true),
('Products', '/products', 3, true),
('Services', '/services', 4, true),
('Our Approach', '/about#approach', 5, true),
('Contact', '/contact', 6, true);
