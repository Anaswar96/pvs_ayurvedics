"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Leaf, ShieldCheck, HeartHandshake, MapPin } from "lucide-react";
import { WebsiteSection, TrustPoint } from "@/lib/types";

interface HeroSectionProps {
  section?: WebsiteSection;
  trustPoints: TrustPoint[];
}

interface BannerSlide {
  id: string;
  image_url: string;
  link?: string;
}

export default function HeroSection({ section, trustPoints }: HeroSectionProps) {
  if (section && !section.is_visible) return null;

  // Extract up to 3 hero banner slides from section meta_data or fallback image_url
  const rawBanners = (section?.meta_data?.hero_banners as BannerSlide[] | undefined);
  
  let banners: BannerSlide[] = [];
  if (Array.isArray(rawBanners) && rawBanners.length > 0) {
    banners = rawBanners.filter((b) => b && b.image_url && b.image_url.trim() !== "");
  }

  // Fallback to section.image_url or default banner if empty
  if (banners.length === 0) {
    banners = [
      {
        id: "banner-1",
        image_url: section?.image_url || "https://res.cloudinary.com/cj5pfdzi/image/upload/v1789024868/pvs-ayurvedics/hero/if4tk6fzoyyybuzccooh.webp",
        link: "/products",
      },
    ];
  }

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Auto-slide transition every 5 seconds
  useEffect(() => {
    if (banners.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length, isHovered]);

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  // Touch Swipe for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) {
      handleNext(); // swipe left -> next slide
    } else if (diff < -50) {
      handlePrev(); // swipe right -> prev slide
    }
    setTouchStart(null);
  };

  // Icon mapping for trust points
  const getIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case "shieldcheck":
      case "shield":
        return <ShieldCheck className="w-5 h-5 text-emerald-700" />;
      case "hearthandshake":
      case "heart":
        return <HeartHandshake className="w-5 h-5 text-emerald-700" />;
      case "mappin":
      case "map":
        return <MapPin className="w-5 h-5 text-emerald-700" />;
      case "leaf":
      default:
        return <Leaf className="w-5 h-5 text-emerald-700" />;
    }
  };

  const topTrustPoints = trustPoints.slice(0, 4);

  return (
    <section className="relative w-full overflow-hidden bg-ayur-cream flex flex-col">
      {/* 1. Full Screen Width Landscape Banner Slider */}
      <div
        className="relative w-full aspect-[21/9] min-h-[340px] sm:min-h-[420px] md:min-h-[500px] lg:min-h-[580px] xl:min-h-[640px] overflow-hidden bg-stone-100 select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {banners.map((banner, index) => {
          const isActive = index === currentSlide;
          const content = (
            <div className="relative w-full h-full">
              <Image
                src={banner.image_url}
                alt={`PVS Ayurvedics Hero Banner ${index + 1}`}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover object-center transition-transform duration-1000 ease-out"
              />
            </div>
          );

          return (
            <div
              key={banner.id || index}
              className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${
                isActive
                  ? "opacity-100 scale-100 z-10 pointer-events-auto"
                  : "opacity-0 scale-[1.02] z-0 pointer-events-none"
              }`}
            >
              {banner.link ? (
                <Link
                  href={banner.link}
                  className="block w-full h-full cursor-pointer focus:outline-none"
                  tabIndex={isActive ? 0 : -1}
                >
                  {content}
                </Link>
              ) : (
                content
              )}
            </div>
          );
        })}

        {/* Previous Slide Arrow */}
        {banners.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handlePrev();
            }}
            aria-label="Previous Slide"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3.5 rounded-full bg-black/25 hover:bg-black/60 text-white backdrop-blur-md transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 focus:outline-none"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </button>
        )}

        {/* Next Slide Arrow */}
        {banners.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleNext();
            }}
            aria-label="Next Slide"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3.5 rounded-full bg-black/25 hover:bg-black/60 text-white backdrop-blur-md transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 focus:outline-none"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </button>
        )}

        {/* Bottom Pagination Dots Indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10 shadow-lg">
            {banners.map((_, dotIndex) => (
              <button
                key={dotIndex}
                type="button"
                onClick={() => setCurrentSlide(dotIndex)}
                aria-label={`Go to slide ${dotIndex + 1}`}
                className={`transition-all duration-500 rounded-full focus:outline-none ${
                  dotIndex === currentSlide
                    ? "w-8 h-2.5 bg-white shadow-sm"
                    : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 2. 4 Trust Badges Strip (Neatly positioned directly below the full landscape banners) */}
      {topTrustPoints.length > 0 && (
        <div className="w-full bg-[#fcfbf7] border-b border-emerald-950/5">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              {topTrustPoints.map((tp) => (
                <div
                  key={tp.id}
                  className="flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl bg-white/90 border border-emerald-900/5 hover:border-emerald-700/20 hover:bg-white transition-all duration-300 shadow-2xs"
                >
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 flex-shrink-0">
                    {getIcon(tp.icon_name)}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#0d3b27] leading-tight">
                      {tp.title}
                    </h4>
                    {tp.subtitle && (
                      <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                        {tp.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
