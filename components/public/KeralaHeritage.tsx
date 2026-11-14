import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { WebsiteSection } from "@/lib/types";

interface KeralaHeritageProps {
  section?: WebsiteSection;
}

export default function KeralaHeritage({ section }: KeralaHeritageProps) {
  if (section && !section.is_visible) return null;

  const title = section?.title || "Wellness Rooted in Kerala";
  const content =
    section?.content ||
    "A calm, welcoming environment where traditional Ayurvedic principles meet modern care.";
  const ctaText = section?.cta_text || "Watch Our Story";
  const ctaUrl = section?.cta_url || "/about#heritage";
  const imageSrc = section?.image_url || "/images/kerala-heritage.svg";

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-lg border border-emerald-900/10 bg-[#0d3b27] text-white min-h-[340px] flex flex-col justify-end p-6 sm:p-8 group">
      {/* Background visual with subtle zoom on hover */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt="Ayurvedic Wellness Rooted in Kerala"
          fill
          className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#092b1d] via-[#092b1d]/70 to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 space-y-3">
        <h3 className="text-xl sm:text-2xl font-bold font-serif-ayur text-white">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-emerald-100/90 max-w-sm leading-relaxed">
          {content}
        </p>

        <div className="pt-2">
          <Link
            href={ctaUrl}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold hover:bg-white hover:text-[#0d3b27] transition-all duration-300 border border-white/30"
          >
            <div className="w-5 h-5 rounded-full bg-white text-[#0d3b27] flex items-center justify-center">
              <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
            </div>
            <span>{ctaText}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
