"use client";

import React from "react";
import { getWhatsAppLink } from "@/lib/utils";

interface FloatingWhatsAppProps {
  phoneNumber?: string;
  message?: string;
  buttonLabel?: string;
  enabled?: boolean;
}

export default function FloatingWhatsApp({
  phoneNumber = "+919061853542",
  message = "Hello PVS Ayurvedics, I would like to inquire about your Ayurvedic treatments and products.",
  buttonLabel = "Chat with Us",
  enabled = true,
}: FloatingWhatsAppProps) {
  // If explicitly disabled in admin settings, do not render
  if (enabled === false) {
    return null;
  }

  const whatsappUrl = getWhatsAppLink(phoneNumber, message);

  return (
    <aside aria-label="WhatsApp Quick Contact" className="select-none">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        id="whatsapp-sticky-button"
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2.5 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white px-3.5 py-3 sm:px-4 sm:py-3 rounded-full shadow-[0_8px_25px_rgba(37,211,102,0.4)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 group border border-emerald-300/30"
        aria-label={buttonLabel || "Chat on WhatsApp with PVS Ayurvedics"}
      >
        {/* Pulsing halo wave */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" />

        {/* WhatsApp Official Vector Icon */}
        <svg
          className="w-6 h-6 shrink-0 fill-current drop-shadow-sm transition-transform duration-300 group-hover:rotate-12"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.477-.15-.678.15-.201.3-.778.98-.954 1.18-.176.2-.352.226-.653.076-.301-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.784-1.676-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.201-.301.301-.502.1-.201.05-.377-.025-.527-.075-.15-.678-1.633-.929-2.237-.245-.588-.493-.508-.678-.518-.176-.009-.377-.009-.578-.009s-.527.075-.803.376c-.276.3-1.054 1.03-1.054 2.511 0 1.481 1.08 2.912 1.231 3.113.15.201 2.124 3.243 5.145 4.549.719.311 1.28.497 1.718.636.722.23 1.378.197 1.898.12.58-.087 1.78-.728 2.03-1.431.25-.703.25-1.305.176-1.431-.075-.126-.276-.201-.577-.351z" />
          <path d="M12.004 0C5.373 0 0 5.373 0 12c0 2.112.551 4.167 1.597 5.98L.066 23.934l6.108-1.503A11.968 11.968 0 0012.004 24C18.63 24 24 18.627 24 12c0-6.627-5.37-12-11.996-12zm0 21.956c-1.802 0-3.568-.485-5.111-1.402l-.366-.217-3.799.934.953-3.702-.238-.378a9.92 9.92 0 01-1.523-5.191c0-5.495 4.475-9.97 9.974-9.97 5.498 0 9.974 4.475 9.974 9.97 0 5.496-4.476 9.97-10.074 9.97z" />
        </svg>

        {/* Text Label */}
        <span className="text-xs sm:text-sm font-semibold tracking-wide pr-0.5 whitespace-nowrap drop-shadow-xs">
          {buttonLabel}
        </span>

        {/* Online Indicator Green Dot */}
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-200"></span>
        </span>
      </a>
    </aside>
  );
}
