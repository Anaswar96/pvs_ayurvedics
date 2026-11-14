export interface SiteSettings {
  id: string;
  business_name: string;
  tagline: string;
  malayalam_headline: string;
  malayalam_tagline: string;
  phone: string;
  whatsapp_number: string;
  whatsapp_sticky_enabled?: boolean;
  whatsapp_default_message?: string;
  whatsapp_button_label?: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  working_hours: string;
  logo_url: string;
  favicon_url: string;
  google_map_embed_url: string;
  google_map_directions_url: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  meta_title: string;
  meta_description: string;
  created_at?: string;
  updated_at?: string;
}

export interface WebsiteSection {
  id: string;
  section_key: string;
  section_name: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  cta_text: string | null;
  cta_url: string | null;
  secondary_cta_text: string | null;
  secondary_cta_url: string | null;
  image_url: string | null;
  mobile_image_url: string | null;
  is_visible: boolean;
  sort_order: number;
  meta_data?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export interface TrustPoint {
  id: string;
  title: string;
  subtitle?: string | null;
  icon_name: string;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  category?: Category | null;
  sku: string | null;
  short_description: string;
  full_description: string | null;
  price: number | null;
  mrp: number | null;
  main_image: string;
  gallery_images: string[];
  ingredients: string[];
  usage_instructions: string | null;
  benefits: string[];
  is_featured: boolean;
  is_published: boolean;
  in_stock: boolean;
  sort_order: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string | null;
  icon_name: string;
  image_url: string | null;
  benefits: string[];
  sort_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  cta_text: string | null;
  cta_url: string | null;
  desktop_image: string;
  mobile_image: string | null;
  placement: string;
  features: string[];
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Announcement {
  id: string;
  text: string;
  link_url: string | null;
  bg_color: string;
  text_color: string;
  priority: number;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Testimonial {
  id: string;
  author_name: string;
  author_image: string | null;
  location: string;
  rating: number;
  quote: string;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Enquiry {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  product_interest: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  message: string;
  status: "New" | "Contacted" | "In Progress" | "Completed" | "Cancelled";
  internal_notes: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  sort_order: number;
  is_active: boolean;
  is_external?: boolean;
}

export interface MediaAsset {
  id: string;
  cloudinary_id: string;
  secure_url: string;
  file_name: string;
  file_size?: number;
  format?: string;
  folder?: string;
  created_at?: string;
}

export interface AdminStats {
  totalProducts: number;
  totalCategories: number;
  totalServices: number;
  totalTestimonials: number;
  totalBanners: number;
  totalEnquiries: number;
  newEnquiriesCount: number;
  publishedProductsCount: number;
}
