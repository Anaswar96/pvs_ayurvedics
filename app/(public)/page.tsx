import React from "react";
import HeroSection from "@/components/public/HeroSection";
import AboutSection from "@/components/public/AboutSection";
import ProductsSection from "@/components/public/ProductsSection";
import ServicesSection from "@/components/public/ServicesSection";
import KeralaHeritage from "@/components/public/KeralaHeritage";
import TestimonialsSection from "@/components/public/TestimonialsSection";
import CtaBanner from "@/components/public/CtaBanner";
import EnquirySection from "@/components/public/EnquirySection";
import LocationSection from "@/components/public/LocationSection";
import {
  getSiteSettings,
  getWebsiteSections,
  getTrustPoints,
  getCategories,
  getProducts,
  getServices,
  getBanners,
  getTestimonials,
} from "@/lib/supabase/queries";

export const revalidate = 60; // ISR revalidation every 60 seconds

export default async function HomePage() {
  const [
    settings,
    sections,
    trustPoints,
    categories,
    products,
    services,
    banners,
    testimonials,
  ] = await Promise.all([
    getSiteSettings(),
    getWebsiteSections(),
    getTrustPoints(),
    getCategories(),
    getProducts({ featuredOnly: false }),
    getServices(),
    getBanners(),
    getTestimonials(),
  ]);

  // Find individual section configurations by key
  const heroSection = sections.find((s) => s.section_key === "hero");
  const aboutSection = sections.find((s) => s.section_key === "our_story");
  const productsSection = sections.find((s) => s.section_key === "products");
  const servicesSection = sections.find((s) => s.section_key === "services");
  const keralaStorySection = sections.find((s) => s.section_key === "kerala_story");
  const ctaJourneySection = sections.find((s) => s.section_key === "cta_journey");
  const locationSection = sections.find((s) => s.section_key === "location");

  return (
    <div className="space-y-0">
      {/* 1. Hero Section (Malayalam + English + Trust Badges) */}
      <HeroSection
        section={heroSection}
        trustPoints={trustPoints}
        settings={settings}
      />

      {/* 2. Our Story / About Section */}
      <AboutSection section={aboutSection} />

      {/* 3. Products Section (Category Tabs + 10 Products + Right Promo Card) */}
      <ProductsSection
        section={productsSection}
        products={products}
        categories={categories}
        banners={banners}
        whatsappNumber={settings.whatsapp_number}
      />

      {/* 4. Services Section (Holistic Care for Your Well-being) */}
      <ServicesSection
        section={servicesSection}
        services={services}
      />

      {/* 5. Middle Trio Row: Kerala Heritage + Testimonials + Wellness Journey CTA */}
      <section className="py-14 lg:py-20 bg-ayur-cream border-t border-emerald-900/5">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {/* Card 1: Wellness Rooted in Kerala */}
            <KeralaHeritage section={keralaStorySection} />

            {/* Card 2: What Our Customers Say Carousel */}
            <TestimonialsSection testimonials={testimonials} />

            {/* Card 3: Your Wellness Journey Starts Here CTA */}
            <CtaBanner section={ctaJourneySection} settings={settings} />
          </div>
        </div>
      </section>

      {/* 6. Bottom 2-Column Section: Send Us an Enquiry + Visit Our Location */}
      <section className="py-14 lg:py-20 bg-white border-t border-emerald-900/5">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left Col: Send Us an Enquiry Form */}
            <div className="lg:col-span-7">
              <EnquirySection products={products} services={services} />
            </div>

            {/* Right Col: Visit Our Location & Map */}
            <div className="lg:col-span-5">
              <LocationSection settings={settings} section={locationSection} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
