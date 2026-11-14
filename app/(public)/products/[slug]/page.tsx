import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getProducts,
  getSiteSettings,
  getServices,
} from "@/lib/supabase/queries";
import { getProductWhatsAppLink } from "@/lib/utils";
import ProductCard from "@/components/public/ProductCard";
import EnquirySection from "@/components/public/EnquirySection";
import {
  MessageCircle,
  ShieldCheck,
  Leaf,
  CheckCircle2,
  Calendar,
  Sparkles,
} from "lucide-react";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | PVS Ayurvedics",
    };
  }

  return {
    title: product.meta_title || `${product.name} | PVS Ayurvedics Manjeri Kerala`,
    description: product.meta_description || product.short_description,
    openGraph: {
      title: product.name,
      description: product.short_description,
      images: [
        {
          url: product.main_image,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [product, settings, allProducts, allServices] = await Promise.all([
    getProductBySlug(slug),
    getSiteSettings(),
    getProducts(),
    getServices(),
  ]);

  if (!product) {
    notFound();
  }

  const whatsappUrl = getProductWhatsAppLink(
    settings.whatsapp_number,
    product.name,
    product.sku
  );

  // Related products in the same category (excluding current)
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.category_id === product.category_id || !product.category_id))
    .slice(0, 4);

  const gallery = product.gallery_images && product.gallery_images.length > 0
    ? product.gallery_images
    : [product.main_image];

  return (
    <div className="py-10 lg:py-16 bg-ayur-cream min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="inline-flex items-center gap-2 text-xs text-stone-500 font-medium mb-8">
          <Link href="/" className="hover:text-[#0d3b27]">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#0d3b27]">Products</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                href={`/products?category=${product.category.slug}`}
                className="hover:text-[#0d3b27]"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-[#0d3b27] font-semibold">{product.name}</span>
        </div>

        {/* Main Product Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-white p-6 sm:p-10 rounded-3xl border border-emerald-900/10 shadow-sm mb-14">
          
          {/* Left: Product Images Gallery */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-stone-50 border border-stone-100 flex items-center justify-center p-6">
              <Image
                src={product.main_image}
                alt={product.name}
                fill
                priority
                className="object-contain p-6 transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* Gallery Thumbnails */}
            {gallery.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {gallery.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-20 h-20 rounded-xl overflow-hidden bg-stone-50 border border-stone-200 flex-shrink-0 cursor-pointer hover:border-emerald-700"
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Category & SKU Badges */}
              <div className="flex items-center gap-3 flex-wrap">
                {product.category && (
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-bold uppercase tracking-wider">
                    {product.category.name}
                  </span>
                )}
                {product.sku && (
                  <span className="text-xs text-stone-400 font-mono">
                    SKU: {product.sku}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Authentic Kerala Formulation
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0d3b27] font-serif-ayur leading-tight">
                {product.name}
              </h1>

              {/* Short Tagline */}
              <p className="text-base text-emerald-900/80 font-medium">
                {product.short_description}
              </p>

              {/* Full Description */}
              {product.full_description && (
                <p className="text-sm text-stone-600 leading-relaxed pt-2">
                  {product.full_description}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-stone-100 space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold shadow-md transition-all duration-200"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>Enquire / Order on WhatsApp</span>
                </a>

                <a
                  href="#book-consultation"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#0d3b27] hover:bg-[#165b33] text-white text-sm font-semibold transition-all duration-200"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Consult Physician</span>
                </a>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-500 pt-2 px-1">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  100% Quality Tested
                </span>
                <span className="flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-emerald-700" />
                  Pure Natural Herbs
                </span>
                <span className="flex items-center gap-1.5 hidden sm:inline-flex">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  Manjeri Clinic Support
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Detailed Information Tabs / Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          
          {/* Key Ingredients */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div className="ayur-card p-6 bg-white space-y-4">
              <div className="flex items-center gap-2 text-[#0d3b27]">
                <Leaf className="w-5 h-5 text-emerald-700" />
                <h3 className="text-lg font-bold font-serif-ayur">Key Ingredients</h3>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-stone-600">
                {product.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0" />
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {product.benefits && product.benefits.length > 0 && (
            <div className="ayur-card p-6 bg-white space-y-4">
              <div className="flex items-center gap-2 text-[#0d3b27]">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <h3 className="text-lg font-bold font-serif-ayur">Key Benefits</h3>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-stone-600">
                {product.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* How to Use / Dosage */}
          {product.usage_instructions && (
            <div className="ayur-card p-6 bg-white space-y-4">
              <div className="flex items-center gap-2 text-[#0d3b27]">
                <Sparkles className="w-5 h-5 text-emerald-700" />
                <h3 className="text-lg font-bold font-serif-ayur">Directions for Use</h3>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {product.usage_instructions}
              </p>
            </div>
          )}

        </div>

        {/* In-page Consultation Booking */}
        <div id="book-consultation" className="mb-16">
          <div className="max-w-3xl mx-auto">
            <EnquirySection
              products={allProducts}
              services={allServices}
              defaultProductInterest={product.name}
              isStandalonePage={true}
            />
          </div>
        </div>

        {/* Related Products Recommendations */}
        {relatedProducts.length > 0 && (
          <div className="pt-10 border-t border-emerald-900/10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold tracking-widest text-emerald-800 uppercase block mb-1">
                  You May Also Need
                </span>
                <h2 className="text-2xl font-bold text-[#0d3b27] font-serif-ayur">
                  Complementary Formulations
                </h2>
              </div>

              <Link
                href="/products"
                className="text-xs font-bold text-[#0d3b27] hover:underline"
              >
                View All &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  whatsappNumber={settings.whatsapp_number}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
