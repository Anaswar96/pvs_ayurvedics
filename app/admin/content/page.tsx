import React from "react";
import ContentManager from "./ContentManager";
import {
  getAllWebsiteSections,
  getTrustPoints,
  getAllServicesAdmin,
  getAllTestimonialsAdmin,
  getAllBannersAdmin,
  getSiteSettings,
  getAllProductsAdmin,
  getAllCategories,
} from "@/lib/supabase/queries";

export const metadata = {
  title: "Website Content & Sections | Admin | PVS Ayurvedics",
};

export default async function AdminContentPage() {
  const [
    sections,
    trustPoints,
    services,
    testimonials,
    banners,
    settings,
    products,
    categories,
  ] = await Promise.all([
    getAllWebsiteSections(),
    getTrustPoints(),
    getAllServicesAdmin(),
    getAllTestimonialsAdmin(),
    getAllBannersAdmin(),
    getSiteSettings(),
    getAllProductsAdmin(),
    getAllCategories(),
  ]);

  return (
    <ContentManager
      initialSections={sections}
      initialTrustPoints={trustPoints}
      initialServices={services}
      initialTestimonials={testimonials}
      initialBanners={banners}
      initialSettings={settings}
      productsCount={products.length}
      categoriesCount={categories.length}
    />
  );
}
