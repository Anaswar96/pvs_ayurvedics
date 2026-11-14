"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import ProductCard from "./ProductCard";
import { Product, Category, Banner, WebsiteSection } from "@/lib/types";

interface ProductsSectionProps {
  section?: WebsiteSection;
  products: Product[];
  categories: Category[];
  banners?: Banner[];
  whatsappNumber?: string;
}

function useBreakpointItems() {
  const [itemsVisible, setItemsVisible] = useState(1);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w >= 1280) setItemsVisible(4);
      else if (w >= 1024) setItemsVisible(3);
      else if (w >= 640) setItemsVisible(2);
      else setItemsVisible(1);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  return itemsVisible;
}

export default function ProductsSection({
  section,
  products,
  categories,
  banners,
  whatsappNumber,
}: ProductsSectionProps) {
  if (section && !section.is_visible) return null;

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemsVisible = useBreakpointItems();

  // Touch drag
  const touchStartX = useRef<number | null>(null);

  const title = section?.title || "Pure Ayurvedic Products for Everyday Wellness";
  const subtitle = section?.subtitle || "OUR PRODUCTS";

  const promoBanner = banners?.find((b) => b.placement === "home_sidebar") || {
    id: "promo",
    title: "Natural Solutions for a Healthier You",
    subtitle: "Authentic herbal formulations crafted with pure botanicals.",
    cta_text: "Explore Products",
    cta_url: "/products",
    desktop_image: "/images/banners/promo-banner.svg",
    mobile_image: null,
    placement: "home_sidebar",
    features: ["Herbal Formulations", "Quality Ingredients", "Daily Wellness Support"],
    start_date: null,
    end_date: null,
    is_active: true,
    sort_order: 1,
  };

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter(
          (p) =>
            p.category?.slug === activeCategory ||
            p.category_id === activeCategory ||
            categories.find((c) => c.slug === activeCategory)?.id === p.category_id
        );

  const totalItems = filteredProducts.length;
  const maxIndex = Math.max(0, totalItems - itemsVisible);

  // Reset on category change
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  // Clamp when itemsVisible changes (e.g. resize)
  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  }, [maxIndex]);

  const goTo = useCallback(
    (i: number) => setCurrentIndex(Math.min(Math.max(i, 0), maxIndex)),
    [maxIndex]
  );

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? goNext() : goPrev();
    }
    touchStartX.current = null;
  };

  // Card width percentage = 100 / itemsVisible
  const cardWidthPct = 100 / itemsVisible;
  // Translate = currentIndex * cardWidthPct %
  const translatePct = currentIndex * cardWidthPct;

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  // How many dots to show (cap at 8 for readability)
  const dotsCount = Math.min(totalItems, 8);

  return (
    <section id="products" className="py-14 lg:py-20 bg-ayur-cream relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 lg:mb-10 gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold tracking-widest text-emerald-800 uppercase">
              {subtitle}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0d3b27] font-serif-ayur leading-tight">
              {title}
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-[#0d3b27] hover:text-[#165b33] transition-colors group flex-shrink-0"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* ── Category Tabs ── */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                activeCategory === "all"
                  ? "bg-[#0d3b27] text-white shadow-sm"
                  : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
              }`}
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                  activeCategory === cat.slug
                    ? "bg-[#0d3b27] text-white shadow-sm"
                    : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* ── Main Row: Slider + Promo Banner ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* ── Products Slider ── */}
          <div className="lg:col-span-8 xl:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-stone-200">
                <p className="text-stone-500 text-sm">No products in this category yet.</p>
              </div>
            ) : (
              <div>
                {/* Slider Viewport */}
                <div
                  className="overflow-hidden"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  {/* Track */}
                  <div
                    className="flex transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
                    style={{ transform: `translateX(-${translatePct}%)` }}
                  >
                    {filteredProducts.map((prod) => (
                      <div
                        key={prod.id}
                        className="flex-none px-2"
                        style={{ width: `${cardWidthPct}%` }}
                      >
                        <ProductCard product={prod} whatsappNumber={whatsappNumber} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Controls Row ── */}
                <div className="flex items-center justify-between mt-5 gap-3">

                  {/* Prev/Next Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={goPrev}
                      disabled={!canGoPrev}
                      aria-label="Previous products"
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold
                        transition-all duration-200 select-none
                        ${canGoPrev
                          ? "border-[#0d3b27] text-[#0d3b27] hover:bg-[#0d3b27] hover:text-white active:scale-95"
                          : "border-stone-200 text-stone-300 cursor-not-allowed opacity-50"}
                      `}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                      type="button"
                      onClick={goNext}
                      disabled={!canGoNext}
                      aria-label="Next products"
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold
                        transition-all duration-200 select-none
                        ${canGoNext
                          ? "border-[#0d3b27] text-[#0d3b27] hover:bg-[#0d3b27] hover:text-white active:scale-95"
                          : "border-stone-200 text-stone-300 cursor-not-allowed opacity-50"}
                      `}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Dot indicators */}
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: dotsCount }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => goTo(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        className={`
                          rounded-full transition-all duration-300 border-0
                          ${i === currentIndex
                            ? "w-6 h-2 bg-[#0d3b27]"
                            : "w-2 h-2 bg-stone-300 hover:bg-[#0d3b27]/40"}
                        `}
                      />
                    ))}
                    {totalItems > 8 && (
                      <span className="text-[10px] text-stone-400 ml-0.5">+{totalItems - 8}</span>
                    )}
                  </div>

                  {/* Counter */}
                  <span className="text-xs text-stone-500 font-medium hidden sm:block">
                    {currentIndex + 1}–{Math.min(currentIndex + itemsVisible, totalItems)}{" "}
                    <span className="text-stone-400">of {totalItems}</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ── Right Promo Banner (desktop only) ── */}
          <div className="hidden lg:block lg:col-span-4 xl:col-span-3">
            <div className="bg-[#0f3d24] text-white rounded-3xl p-6 lg:p-7 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[480px]">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

              <div className="space-y-6 relative z-10">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-emerald-300 uppercase block mb-1">
                    Featured Formulation
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif-ayur text-white leading-snug">
                    {promoBanner.title}
                  </h3>
                </div>

                <div className="space-y-3 pt-2">
                  {promoBanner.features?.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-emerald-100 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Link
                    href={promoBanner.cta_url || "/products"}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#0d3b27] text-xs font-bold hover:bg-emerald-50 transition-all duration-200 group"
                  >
                    <span>{promoBanner.cta_text || "Explore Products"}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              <div className="relative w-full aspect-[4/3] mt-6 rounded-2xl overflow-hidden bg-emerald-950/40 border border-emerald-800/30">
                <Image
                  src={promoBanner.desktop_image || "/images/banners/promo-banner.svg"}
                  alt={promoBanner.title}
                  fill
                  className="object-contain p-2"
                />
              </div>
            </div>
          </div>

        </div>

        {/* ── Mobile: View All button ── */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#0d3b27] text-white text-sm font-bold hover:bg-[#165b33] transition-all duration-200 shadow-md shadow-emerald-950/20 group"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  );
}
