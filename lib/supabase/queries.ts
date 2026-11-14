import { createServerSupabaseClient } from "./server";
import {
  SiteSettings,
  WebsiteSection,
  TrustPoint,
  Category,
  Product,
  Service,
  Banner,
  Announcement,
  Testimonial,
  NavigationItem,
  Enquiry,
  AdminStats,
} from "../types";
import {
  initialSiteSettings,
  initialWebsiteSections,
  initialTrustPoints,
  initialCategories,
  initialProducts,
  initialServices,
  initialBanners,
  initialAnnouncements,
  initialTestimonials,
  initialNavigationItems,
  initialEnquiries,
} from "../initial-data";

import fs from "fs";
import path from "path";

// In-memory runtime cache/store for changes during local development or when DB is disconnected
const localStore = {
  settings: { ...initialSiteSettings },
  sections: [...initialWebsiteSections],
  trustPoints: [...initialTrustPoints],
  categories: [...initialCategories],
  products: [...initialProducts],
  services: [...initialServices],
  banners: [...initialBanners],
  announcements: [...initialAnnouncements],
  testimonials: [...initialTestimonials],
  navigationItems: [...initialNavigationItems],
  enquiries: [...initialEnquiries],
};

const LOCAL_PRODUCTS_FILE = path.join(process.cwd(), "lib", ".local-products.json");

function getPersistedProducts(): Product[] {
  try {
    if (fs.existsSync(LOCAL_PRODUCTS_FILE)) {
      const data = fs.readFileSync(LOCAL_PRODUCTS_FILE, "utf-8");
      const list = JSON.parse(data);
      if (Array.isArray(list)) return list;
    }
  } catch {
    // Ignore file read error
  }
  return [];
}

function persistProducts(list: Product[]) {
  try {
    fs.writeFileSync(LOCAL_PRODUCTS_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch {
    // Ignore file write error
  }
}

export function saveProductToLocalStore(product: Product) {
  const index = localStore.products.findIndex(
    (p) => p.id === product.id || (product.slug && p.slug === product.slug)
  );
  if (index >= 0) {
    localStore.products[index] = { ...localStore.products[index], ...product };
  } else {
    localStore.products.unshift(product);
  }

  // Also persist to disk for durability across restarts and processes
  const persisted = getPersistedProducts();
  const pIdx = persisted.findIndex(
    (p) => p.id === product.id || (product.slug && p.slug === product.slug)
  );
  if (pIdx >= 0) {
    persisted[pIdx] = { ...persisted[pIdx], ...product };
  } else {
    persisted.unshift(product);
  }
  persistProducts(persisted);
}

export function deleteProductFromLocalStore(idOrSlug: string) {
  localStore.products = localStore.products.filter(
    (p) => p.id !== idOrSlug && p.slug !== idOrSlug
  );
  const persisted = getPersistedProducts().filter(
    (p) => p.id !== idOrSlug && p.slug !== idOrSlug
  );
  persistProducts(persisted);
}

function getAllCombinedProducts(dbProducts: Product[]): Product[] {
  const merged = [...dbProducts];
  const diskProducts = getPersistedProducts();
  const localList = [...diskProducts, ...localStore.products];

  for (const lp of localList) {
    const existingIdx = merged.findIndex(
      (p) => p.id === lp.id || (p.slug && p.slug === lp.slug)
    );
    if (existingIdx >= 0) {
      merged[existingIdx] = { ...merged[existingIdx], ...lp };
    } else {
      merged.unshift(lp);
    }
  }
  return merged;
}

const LOCAL_SECTIONS_FILE = path.join(process.cwd(), "lib", ".local-sections.json");
const LOCAL_TRUST_FILE = path.join(process.cwd(), "lib", ".local-trust-points.json");

function getPersistedSections(): WebsiteSection[] {
  try {
    if (fs.existsSync(LOCAL_SECTIONS_FILE)) {
      const data = fs.readFileSync(LOCAL_SECTIONS_FILE, "utf-8");
      const list = JSON.parse(data);
      if (Array.isArray(list)) return list;
    }
  } catch {
    // ignore
  }
  return [];
}

export function saveWebsiteSectionsToLocalStore(sections: WebsiteSection[]) {
  localStore.sections = [...sections];
  try {
    fs.writeFileSync(LOCAL_SECTIONS_FILE, JSON.stringify(sections, null, 2), "utf-8");
  } catch {
    // ignore
  }
}

export function saveTrustPointsToLocalStore(trustPoints: TrustPoint[]) {
  localStore.trustPoints = [...trustPoints];
  try {
    fs.writeFileSync(LOCAL_TRUST_FILE, JSON.stringify(trustPoints, null, 2), "utf-8");
  } catch {
    // ignore
  }
}

const LOCAL_SETTINGS_FILE = path.join(process.cwd(), "lib", ".local-settings.json");

function getPersistedSettings(): Partial<SiteSettings> | null {
  try {
    if (fs.existsSync(LOCAL_SETTINGS_FILE)) {
      const data = fs.readFileSync(LOCAL_SETTINGS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch {
    // ignore
  }
  return null;
}

export function saveSiteSettingsToLocalStore(settings: Partial<SiteSettings>) {
  localStore.settings = { ...localStore.settings, ...settings };
  try {
    fs.writeFileSync(LOCAL_SETTINGS_FILE, JSON.stringify(localStore.settings, null, 2), "utf-8");
  } catch {
    // ignore
  }
}

// ---------------- Persisted Services ----------------
const LOCAL_SERVICES_FILE = path.join(process.cwd(), "lib", ".local-services.json");

function getPersistedServices(): Service[] {
  try {
    if (fs.existsSync(LOCAL_SERVICES_FILE)) {
      const data = fs.readFileSync(LOCAL_SERVICES_FILE, "utf-8");
      const list = JSON.parse(data);
      if (Array.isArray(list)) return list;
    }
  } catch {
    // ignore
  }
  return [];
}

function persistServices(list: Service[]) {
  try {
    fs.writeFileSync(LOCAL_SERVICES_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch {
    // ignore
  }
}

export function saveServiceToLocalStore(service: Service) {
  const index = localStore.services.findIndex(
    (s) => s.id === service.id || (service.slug && s.slug === service.slug)
  );
  if (index >= 0) {
    localStore.services[index] = { ...localStore.services[index], ...service };
  } else {
    localStore.services.push(service);
  }

  const persisted = getPersistedServices();
  const pIdx = persisted.findIndex(
    (s) => s.id === service.id || (service.slug && s.slug === service.slug)
  );
  if (pIdx >= 0) {
    persisted[pIdx] = { ...persisted[pIdx], ...service };
  } else {
    persisted.push(service);
  }
  persistServices(persisted);
}

export function deleteServiceFromLocalStore(idOrSlug: string) {
  localStore.services = localStore.services.filter(
    (s) => s.id !== idOrSlug && s.slug !== idOrSlug
  );
  const persisted = getPersistedServices().filter(
    (s) => s.id !== idOrSlug && s.slug !== idOrSlug
  );
  persistServices(persisted);
}

function getAllCombinedServices(dbServices: Service[]): Service[] {
  const merged = [...dbServices];
  const diskServices = getPersistedServices();
  const localList = diskServices.length > 0 ? diskServices : localStore.services;

  for (const ls of localList) {
    const existingIdx = merged.findIndex((s) => s.id === ls.id || (s.slug && s.slug === ls.slug));
    if (existingIdx >= 0) {
      merged[existingIdx] = { ...merged[existingIdx], ...ls };
    } else {
      merged.push(ls);
    }
  }
  return merged.length > 0 ? merged : localStore.services;
}

// ---------------- Persisted Banners ----------------
const LOCAL_BANNERS_FILE = path.join(process.cwd(), "lib", ".local-banners.json");

function getPersistedBanners(): Banner[] {
  try {
    if (fs.existsSync(LOCAL_BANNERS_FILE)) {
      const data = fs.readFileSync(LOCAL_BANNERS_FILE, "utf-8");
      const list = JSON.parse(data);
      if (Array.isArray(list)) return list;
    }
  } catch {
    // ignore
  }
  return [];
}

function persistBanners(list: Banner[]) {
  try {
    fs.writeFileSync(LOCAL_BANNERS_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch {
    // ignore
  }
}

export function saveBannerToLocalStore(banner: Banner) {
  const index = localStore.banners.findIndex((b) => b.id === banner.id);
  if (index >= 0) {
    localStore.banners[index] = { ...localStore.banners[index], ...banner };
  } else {
    localStore.banners.push(banner);
  }

  const persisted = getPersistedBanners();
  const pIdx = persisted.findIndex((b) => b.id === banner.id);
  if (pIdx >= 0) {
    persisted[pIdx] = { ...persisted[pIdx], ...banner };
  } else {
    persisted.push(banner);
  }
  persistBanners(persisted);
}

export function deleteBannerFromLocalStore(id: string) {
  localStore.banners = localStore.banners.filter((b) => b.id !== id);
  const persisted = getPersistedBanners().filter((b) => b.id !== id);
  persistBanners(persisted);
}

function getAllCombinedBanners(dbBanners: Banner[]): Banner[] {
  const merged = [...dbBanners];
  const diskBanners = getPersistedBanners();
  const localList = diskBanners.length > 0 ? diskBanners : localStore.banners;

  for (const lb of localList) {
    const existingIdx = merged.findIndex((b) => b.id === lb.id);
    if (existingIdx >= 0) {
      merged[existingIdx] = { ...merged[existingIdx], ...lb };
    } else {
      merged.push(lb);
    }
  }
  return merged.length > 0 ? merged : localStore.banners;
}

// ---------------- Persisted Testimonials ----------------
const LOCAL_TESTIMONIALS_FILE = path.join(process.cwd(), "lib", ".local-testimonials.json");

function getPersistedTestimonials(): Testimonial[] {
  try {
    if (fs.existsSync(LOCAL_TESTIMONIALS_FILE)) {
      const data = fs.readFileSync(LOCAL_TESTIMONIALS_FILE, "utf-8");
      const list = JSON.parse(data);
      if (Array.isArray(list)) return list;
    }
  } catch {
    // ignore
  }
  return [];
}

function persistTestimonials(list: Testimonial[]) {
  try {
    fs.writeFileSync(LOCAL_TESTIMONIALS_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch {
    // ignore
  }
}

export function saveTestimonialToLocalStore(testimonial: Testimonial) {
  const index = localStore.testimonials.findIndex((t) => t.id === testimonial.id);
  if (index >= 0) {
    localStore.testimonials[index] = { ...localStore.testimonials[index], ...testimonial };
  } else {
    localStore.testimonials.push(testimonial);
  }

  const persisted = getPersistedTestimonials();
  const pIdx = persisted.findIndex((t) => t.id === testimonial.id);
  if (pIdx >= 0) {
    persisted[pIdx] = { ...persisted[pIdx], ...testimonial };
  } else {
    persisted.push(testimonial);
  }
  persistTestimonials(persisted);
}

export function deleteTestimonialFromLocalStore(id: string) {
  localStore.testimonials = localStore.testimonials.filter((t) => t.id !== id);
  const persisted = getPersistedTestimonials().filter((t) => t.id !== id);
  persistTestimonials(persisted);
}

function getAllCombinedTestimonials(dbTestimonials: Testimonial[]): Testimonial[] {
  const merged = [...dbTestimonials];
  const diskTestimonials = getPersistedTestimonials();
  const localList = diskTestimonials.length > 0 ? diskTestimonials : localStore.testimonials;

  for (const lt of localList) {
    const existingIdx = merged.findIndex((t) => t.id === lt.id);
    if (existingIdx >= 0) {
      merged[existingIdx] = { ...merged[existingIdx], ...lt };
    } else {
      merged.push(lt);
    }
  }
  return merged.length > 0 ? merged : localStore.testimonials;
}

// ---------------- Persisted Categories ----------------
const LOCAL_CATEGORIES_FILE = path.join(process.cwd(), "lib", ".local-categories.json");

function getPersistedCategories(): Category[] {
  try {
    if (fs.existsSync(LOCAL_CATEGORIES_FILE)) {
      const data = fs.readFileSync(LOCAL_CATEGORIES_FILE, "utf-8");
      const list = JSON.parse(data);
      if (Array.isArray(list)) return list;
    }
  } catch {
    // ignore
  }
  return [];
}

function persistCategories(list: Category[]) {
  try {
    fs.writeFileSync(LOCAL_CATEGORIES_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch {
    // ignore
  }
}

export function saveCategoryToLocalStore(category: Category) {
  const index = localStore.categories.findIndex((c) => c.id === category.id || c.slug === category.slug);
  if (index >= 0) {
    localStore.categories[index] = { ...localStore.categories[index], ...category };
  } else {
    localStore.categories.push(category);
  }

  const persisted = getPersistedCategories();
  const pIdx = persisted.findIndex((c) => c.id === category.id || c.slug === category.slug);
  if (pIdx >= 0) {
    persisted[pIdx] = { ...persisted[pIdx], ...category };
  } else {
    persisted.push(category);
  }
  persistCategories(persisted);
}

export function deleteCategoryFromLocalStore(idOrSlug: string) {
  localStore.categories = localStore.categories.filter((c) => c.id !== idOrSlug && c.slug !== idOrSlug);
  const persisted = getPersistedCategories().filter((c) => c.id !== idOrSlug && c.slug !== idOrSlug);
  persistCategories(persisted);
}

function getAllCombinedCategories(dbCategories: Category[]): Category[] {
  const merged = [...dbCategories];
  const diskCategories = getPersistedCategories();
  const localList = diskCategories.length > 0 ? diskCategories : localStore.categories;

  for (const lc of localList) {
    const existingIdx = merged.findIndex((c) => c.id === lc.id || (c.slug && c.slug === lc.slug));
    if (existingIdx >= 0) {
      merged[existingIdx] = { ...merged[existingIdx], ...lc };
    } else {
      merged.push(lc);
    }
  }
  return merged.length > 0 ? merged : localStore.categories;
}

// ---------------- Persisted Announcements ----------------
const LOCAL_ANNOUNCEMENTS_FILE = path.join(process.cwd(), "lib", ".local-announcements.json");

function getPersistedAnnouncements(): Announcement[] {
  try {
    if (fs.existsSync(LOCAL_ANNOUNCEMENTS_FILE)) {
      const data = fs.readFileSync(LOCAL_ANNOUNCEMENTS_FILE, "utf-8");
      const list = JSON.parse(data);
      if (Array.isArray(list)) return list;
    }
  } catch {
    // ignore
  }
  return [];
}

function persistAnnouncements(list: Announcement[]) {
  try {
    fs.writeFileSync(LOCAL_ANNOUNCEMENTS_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch {
    // ignore
  }
}

export function saveAnnouncementToLocalStore(announcement: Announcement) {
  const index = localStore.announcements.findIndex((a) => a.id === announcement.id);
  if (index >= 0) {
    localStore.announcements[index] = { ...localStore.announcements[index], ...announcement };
  } else {
    localStore.announcements.push(announcement);
  }

  const persisted = getPersistedAnnouncements();
  const pIdx = persisted.findIndex((a) => a.id === announcement.id);
  if (pIdx >= 0) {
    persisted[pIdx] = { ...persisted[pIdx], ...announcement };
  } else {
    persisted.push(announcement);
  }
  persistAnnouncements(persisted);
}

export function deleteAnnouncementFromLocalStore(id: string) {
  localStore.announcements = localStore.announcements.filter((a) => a.id !== id);
  const persisted = getPersistedAnnouncements().filter((a) => a.id !== id);
  persistAnnouncements(persisted);
}

function getAllCombinedAnnouncements(dbAnnouncements: Announcement[]): Announcement[] {
  const merged = [...dbAnnouncements];
  const diskAnnouncements = getPersistedAnnouncements();
  const localList = diskAnnouncements.length > 0 ? diskAnnouncements : localStore.announcements;

  for (const la of localList) {
    const existingIdx = merged.findIndex((a) => a.id === la.id);
    if (existingIdx >= 0) {
      merged[existingIdx] = { ...merged[existingIdx], ...la };
    } else {
      merged.push(la);
    }
  }
  return merged.length > 0 ? merged : localStore.announcements;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  let dbSettings: Partial<SiteSettings> = {};
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from("site_settings").select("*").limit(1).single();
    if (!error && data) {
      dbSettings = data as SiteSettings;
    }
  } catch {
    // Fallback gracefully
  }

  const persisted = getPersistedSettings();
  return {
    ...localStore.settings,
    ...dbSettings,
    ...(persisted || {}),
  };
}

export async function getWebsiteSections(): Promise<WebsiteSection[]> {
  let dbSections: WebsiteSection[] = [];
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("website_sections")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!error && data && data.length > 0) {
      dbSections = data as WebsiteSection[];
    }
  } catch {
    // Fallback gracefully
  }

  const persisted = getPersistedSections();
  const merged = [...dbSections];
  const localList = persisted.length > 0 ? persisted : localStore.sections;

  for (const ls of localList) {
    const idx = merged.findIndex((s) => s.section_key === ls.section_key);
    if (idx >= 0) {
      merged[idx] = { ...merged[idx], ...ls };
    } else {
      merged.push(ls);
    }
  }

  return (merged.length > 0 ? merged : localStore.sections)
    .filter((s) => s.is_visible)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export async function getAllWebsiteSections(): Promise<WebsiteSection[]> {
  let dbSections: WebsiteSection[] = [];
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("website_sections")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!error && data && data.length > 0) {
      dbSections = data as WebsiteSection[];
    }
  } catch {
    // Fallback gracefully
  }

  const persisted = getPersistedSections();
  const merged = [...dbSections];
  const localList = persisted.length > 0 ? persisted : localStore.sections;

  for (const ls of localList) {
    const idx = merged.findIndex((s) => s.section_key === ls.section_key);
    if (idx >= 0) {
      merged[idx] = { ...merged[idx], ...ls };
    } else {
      merged.push(ls);
    }
  }

  return (merged.length > 0 ? merged : localStore.sections).sort(
    (a, b) => a.sort_order - b.sort_order
  );
}

export async function getTrustPoints(): Promise<TrustPoint[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("trust_points")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (!error && data && data.length > 0) {
      return data as TrustPoint[];
    }
  } catch {
    // Fallback gracefully
  }
  return localStore.trustPoints.filter((tp) => tp.is_active).sort((a, b) => a.sort_order - b.sort_order);
}

export async function getCategories(): Promise<Category[]> {
  let dbCategories: Category[] = [];
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (!error && data && data.length > 0) {
      dbCategories = data as Category[];
    }
  } catch {
    // Fallback gracefully
  }
  return getAllCombinedCategories(dbCategories).filter((c) => c.is_active).sort((a, b) => a.sort_order - b.sort_order);
}

export async function getAllCategories(): Promise<Category[]> {
  let dbCategories: Category[] = [];
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!error && data && data.length > 0) {
      dbCategories = data as Category[];
    }
  } catch {
    // Fallback gracefully
  }
  return getAllCombinedCategories(dbCategories).sort((a, b) => a.sort_order - b.sort_order);
}

export async function getProducts(options?: {
  categorySlug?: string;
  search?: string;
  featuredOnly?: boolean;
}): Promise<Product[]> {
  let dbProducts: Product[] = [];
  try {
    const supabase = await createServerSupabaseClient();
    let query = supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (options?.featuredOnly) {
      query = query.eq("is_featured", true);
    }

    if (options?.search) {
      query = query.ilike("name", `%${options.search}%`);
    }

    const { data, error } = await query;
    if (!error && data) {
      dbProducts = data as Product[];
    }
  } catch {
    // Fallback gracefully
  }

  // Merge DB products with any locally added/persisted products
  let products = getAllCombinedProducts(dbProducts).filter((p) => p.is_published);

  if (options?.featuredOnly) {
    products = products.filter((p) => p.is_featured);
  }
  if (options?.categorySlug && options.categorySlug !== "all") {
    products = products.filter(
      (p) =>
        p.category?.slug === options.categorySlug ||
        p.category_id === options.categorySlug
    );
  }
  if (options?.search) {
    const s = options.search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        (p.short_description && p.short_description.toLowerCase().includes(s)) ||
        (Array.isArray(p.ingredients) && p.ingredients.some((ing) => ing.toLowerCase().includes(s)))
    );
  }
  return products.sort((a, b) => a.sort_order - b.sort_order);
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  let dbProducts: Product[] = [];
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .order("sort_order", { ascending: true });
    if (!error && data) {
      dbProducts = data as Product[];
    }
  } catch {
    // Fallback gracefully
  }

  const products = getAllCombinedProducts(dbProducts);
  return products.sort((a, b) => a.sort_order - b.sort_order);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("slug", slug)
      .limit(1)
      .single();
    if (!error && data) {
      return data as Product;
    }
  } catch {
    // Fallback gracefully
  }

  const all = getAllCombinedProducts([]);
  return all.find((p) => p.slug === slug) || null;
}

export async function getServices(): Promise<Service[]> {
  let dbServices: Service[] = [];
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    if (!error && data && data.length > 0) {
      dbServices = data as Service[];
    }
  } catch {
    // Fallback gracefully
  }
  return getAllCombinedServices(dbServices).filter((s) => s.is_published).sort((a, b) => a.sort_order - b.sort_order);
}

export async function getAllServicesAdmin(): Promise<Service[]> {
  let dbServices: Service[] = [];
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!error && data && data.length > 0) {
      dbServices = data as Service[];
    }
  } catch {
    // Fallback gracefully
  }
  return getAllCombinedServices(dbServices).sort((a, b) => a.sort_order - b.sort_order);
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("slug", slug)
      .limit(1)
      .single();
    if (!error && data) {
      return data as Service;
    }
  } catch {
    // Fallback gracefully
  }
  const all = getAllCombinedServices([]);
  return all.find((s) => s.slug === slug) || null;
}

export async function getBanners(placement = "home_sidebar"): Promise<Banner[]> {
  let dbBanners: Banner[] = [];
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .eq("is_active", true)
      .eq("placement", placement)
      .order("sort_order", { ascending: true });
    if (!error && data && data.length > 0) {
      dbBanners = data as Banner[];
    }
  } catch {
    // Fallback gracefully
  }
  return getAllCombinedBanners(dbBanners)
    .filter((b) => b.is_active && (!placement || b.placement === placement))
    .sort((a, b) => a.sort_order - b.sort_order);
}

export async function getAllBannersAdmin(): Promise<Banner[]> {
  let dbBanners: Banner[] = [];
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!error && data && data.length > 0) {
      dbBanners = data as Banner[];
    }
  } catch {
    // Fallback gracefully
  }
  return getAllCombinedBanners(dbBanners).sort((a, b) => a.sort_order - b.sort_order);
}

export async function getAnnouncements(): Promise<Announcement[]> {
  let dbAnnouncements: Announcement[] = [];
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("is_active", true)
      .order("priority", { ascending: true });
    if (!error && data && data.length > 0) {
      dbAnnouncements = data as Announcement[];
    }
  } catch {
    // Fallback gracefully
  }
  return getAllCombinedAnnouncements(dbAnnouncements).filter((a) => a.is_active).sort((a, b) => a.priority - b.priority);
}

export async function getAllAnnouncementsAdmin(): Promise<Announcement[]> {
  let dbAnnouncements: Announcement[] = [];
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("priority", { ascending: true });
    if (!error && data && data.length > 0) {
      dbAnnouncements = data as Announcement[];
    }
  } catch {
    // Fallback gracefully
  }
  return getAllCombinedAnnouncements(dbAnnouncements).sort((a, b) => a.priority - b.priority);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  let dbTestimonials: Testimonial[] = [];
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    if (!error && data && data.length > 0) {
      dbTestimonials = data as Testimonial[];
    }
  } catch {
    // Fallback gracefully
  }
  return getAllCombinedTestimonials(dbTestimonials).filter((t) => t.is_published).sort((a, b) => a.sort_order - b.sort_order);
}

export async function getAllTestimonialsAdmin(): Promise<Testimonial[]> {
  let dbTestimonials: Testimonial[] = [];
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!error && data && data.length > 0) {
      dbTestimonials = data as Testimonial[];
    }
  } catch {
    // Fallback gracefully
  }
  return getAllCombinedTestimonials(dbTestimonials).sort((a, b) => a.sort_order - b.sort_order);
}

export async function getNavigationItems(): Promise<NavigationItem[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("navigation_items")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (!error && data && data.length > 0) {
      return data as NavigationItem[];
    }
  } catch {
    // Fallback gracefully
  }
  return localStore.navigationItems.filter((n) => n.is_active).sort((a, b) => a.sort_order - b.sort_order);
}

export async function getEnquiries(options?: {
  status?: string;
  search?: string;
}): Promise<Enquiry[]> {
  try {
    const supabase = await createServerSupabaseClient();
    let query = supabase.from("enquiries").select("*").order("created_at", { ascending: false });

    if (options?.status && options.status !== "All") {
      query = query.eq("status", options.status);
    }
    if (options?.search) {
      query = query.or(
        `full_name.ilike.%${options.search}%,phone.ilike.%${options.search}%,email.ilike.%${options.search}%,product_interest.ilike.%${options.search}%`
      );
    }

    const { data, error } = await query;
    if (!error && data) {
      return data as Enquiry[];
    }
  } catch {
    // Fallback gracefully
  }

  let list = [...localStore.enquiries];
  if (options?.status && options.status !== "All") {
    list = list.filter((e) => e.status === options.status);
  }
  if (options?.search) {
    const s = options.search.toLowerCase();
    list = list.filter(
      (e) =>
        e.full_name.toLowerCase().includes(s) ||
        e.phone.toLowerCase().includes(s) ||
        (e.email && e.email.toLowerCase().includes(s)) ||
        (e.product_interest && e.product_interest.toLowerCase().includes(s))
    );
  }
  return list.sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
}

export async function getAdminStats(): Promise<AdminStats> {
  const [products, categories, services, testimonials, banners, enquiries] = await Promise.all([
    getAllProductsAdmin(),
    getAllCategories(),
    getAllServicesAdmin(),
    getAllTestimonialsAdmin(),
    getAllBannersAdmin(),
    getEnquiries(),
  ]);

  return {
    totalProducts: products.length,
    totalCategories: categories.length,
    totalServices: services.length,
    totalTestimonials: testimonials.length,
    totalBanners: banners.length,
    totalEnquiries: enquiries.length,
    newEnquiriesCount: enquiries.filter((e) => e.status === "New").length,
    publishedProductsCount: products.filter((p) => p.is_published).length,
  };
}
