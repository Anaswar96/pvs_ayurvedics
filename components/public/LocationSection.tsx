import React from "react";
import Image from "next/image";
import { MapPin, Phone, Clock, ArrowRight, ExternalLink } from "lucide-react";
import { SiteSettings, WebsiteSection } from "@/lib/types";

interface LocationSectionProps {
  settings: SiteSettings;
  section?: WebsiteSection;
}

export default function LocationSection({ settings, section }: LocationSectionProps) {
  if (section && !section.is_visible) return null;

  const title = section?.title || "Visit Our Location";
  const subtitle = section?.subtitle || "MANJERI, MALAPPURAM, KERALA";
  const mapImage = section?.image_url || "/images/manjeri-map.svg";
  const directionsUrl =
    settings.google_map_directions_url || "https://maps.google.com/?q=Manjeri,+Malappuram,+Kerala";

  return (
    <div className="ayur-card p-6 sm:p-8 bg-white flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-emerald-800 uppercase block mb-1">
              {subtitle}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-serif-ayur text-[#0d3b27]">
              {title}
            </h3>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-xs font-serif italic text-emerald-800 font-bold">Good Health,</p>
            <p className="text-[11px] text-stone-500 font-serif italic">Happier Tomorrows</p>
          </div>
        </div>

        {/* Map Preview Graphic */}
        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-emerald-900/10 mb-5 bg-emerald-50 group">
          <Image
            src={mapImage}
            alt="PVS Ayurvedics Manjeri Location Map"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-emerald-950/10 hover:bg-transparent transition-colors" />

          {/* Quick link overlay */}
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-white/95 text-[#0d3b27] text-xs font-bold shadow-md hover:bg-[#0d3b27] hover:text-white transition-all duration-200 flex items-center gap-1.5"
          >
            <span>Get Directions</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Clinic Location Details */}
        <div className="space-y-3 text-xs text-stone-600">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-[#0d3b27] flex-shrink-0 mt-0.5" />
            <span>{settings.address || "Court Road, Manjeri, Malappuram District, Kerala 676121"}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-[#0d3b27] flex-shrink-0" />
            <span>{settings.phone || "+91 9061-853-542"}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-[#0d3b27] flex-shrink-0" />
            <span>{settings.working_hours || "Mon - Sat: 9:00 AM - 7:00 PM"}</span>
          </div>
        </div>
      </div>

      {/* Bottom CTA Button */}
      <div className="pt-5 mt-4 border-t border-stone-100">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl border border-emerald-800/30 text-[#0d3b27] text-xs font-semibold hover:bg-emerald-50 transition-all duration-200 group"
        >
          <span>Open in Google Maps</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
}
