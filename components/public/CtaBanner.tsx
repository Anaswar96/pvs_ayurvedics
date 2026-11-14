import React from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { WebsiteSection, SiteSettings } from "@/lib/types";
import { getWhatsAppLink } from "@/lib/utils";

interface CtaBannerProps {
  section?: WebsiteSection;
  settings: SiteSettings;
}

export default function CtaBanner({ section, settings }: CtaBannerProps) {
  if (section && !section.is_visible) return null;

  const title = section?.title || "Your Wellness Journey Starts Here.";
  const description =
    section?.content || "Have a question or need guidance? Our team is here to help.";
  const ctaText = section?.cta_text || "Book a Consultation";
  const ctaUrl = section?.cta_url || "/enquiry";
  const whatsappUrl =
    section?.secondary_cta_url ||
    getWhatsAppLink(
      settings.whatsapp_number,
      "Hello PVS Ayurvedics, I would like to book an Ayurvedic consultation."
    );

  return (
    <div className="bg-[#0f3d24] text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between h-full min-h-[340px] shadow-lg">
      {/* Botanical Background Accent */}
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

      <div className="space-y-4 relative z-10">
        <span className="text-[10px] font-bold tracking-widest text-emerald-300 uppercase block">
          Get Started
        </span>
        <h3 className="text-xl sm:text-2xl font-bold font-serif-ayur text-white leading-tight">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-sm">
          {description}
        </p>
      </div>

      {/* Buttons */}
      <div className="space-y-3 pt-6 relative z-10">
        <Link
          href={ctaUrl}
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-white text-[#0d3b27] text-xs font-bold hover:bg-emerald-50 transition-all duration-200 shadow-sm group"
        >
          <span>{ctaText}</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full border border-emerald-400/40 text-emerald-100 hover:bg-emerald-900/40 text-xs font-semibold transition-all duration-200"
        >
          <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
          <span>Chat on WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
