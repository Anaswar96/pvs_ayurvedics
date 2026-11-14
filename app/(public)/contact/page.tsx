import React from "react";
import Link from "next/link";
import { getSiteSettings, getProducts, getServices } from "@/lib/supabase/queries";
import { getWhatsAppLink } from "@/lib/utils";
import EnquirySection from "@/components/public/EnquirySection";
import LocationSection from "@/components/public/LocationSection";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Contact Us & Clinic Location | PVS Ayurvedics Manjeri",
  description:
    "Get in touch with PVS Ayurvedics in Manjeri, Malappuram, Kerala. Phone: +91 9061-853-542. Schedule your clinic consultation or order herbal remedies.",
};

export default async function ContactPage() {
  const [settings, products, services] = await Promise.all([
    getSiteSettings(),
    getProducts(),
    getServices(),
  ]);

  const whatsappUrl = getWhatsAppLink(
    settings.whatsapp_number,
    "Hello PVS Ayurvedics, I would like to visit your clinic in Manjeri. Could you share consultation timings?"
  );

  return (
    <div className="py-10 lg:py-16 bg-ayur-cream min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumbs & Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs text-stone-500 font-medium">
            <Link href="/" className="hover:text-[#0d3b27]">Home</Link>
            <span>/</span>
            <span className="text-[#0d3b27] font-semibold">Contact Us</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0d3b27] font-serif-ayur">
            We&apos;re Here to Guide Your Health
          </h1>

          <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto leading-relaxed">
            Visit our clinic in Manjeri, Malappuram or connect directly via WhatsApp and phone for personalized Ayurvedic care.
          </p>
        </div>

        {/* 4 Quick Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="ayur-card p-5 bg-white space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0d3b27] flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">Phone Support</h4>
            <a href={`tel:${settings.phone}`} className="text-sm font-bold text-[#0d3b27] hover:underline block">
              {settings.phone || "+91 9061-853-542"}
            </a>
            <p className="text-[11px] text-stone-500">Direct clinic reception line</p>
          </div>

          <div className="ayur-card p-5 bg-white space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0d3b27] flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">WhatsApp Chat</h4>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-emerald-800 hover:underline block"
            >
              Chat on WhatsApp &rarr;
            </a>
            <p className="text-[11px] text-stone-500">Instant Physician &amp; order chat</p>
          </div>

          <div className="ayur-card p-5 bg-white space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0d3b27] flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">Email Inquiries</h4>
            <a href={`mailto:${settings.email}`} className="text-sm font-bold text-[#0d3b27] hover:underline block truncate">
              {settings.email || "info@pvsayurvedics.com"}
            </a>
            <p className="text-[11px] text-stone-500">Response within 24 business hours</p>
          </div>

          <div className="ayur-card p-5 bg-white space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0d3b27] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">Working Hours</h4>
            <p className="text-xs font-bold text-[#0d3b27]">
              {settings.working_hours || "Mon - Sat: 9:00 AM - 7:00 PM"}
            </p>
            <p className="text-[11px] text-stone-500">Sunday morning appointments</p>
          </div>
        </div>

        {/* 2-Column: Form + Location & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <div className="lg:col-span-7">
            <EnquirySection products={products} services={services} />
          </div>

          <div className="lg:col-span-5">
            <LocationSection settings={settings} />
          </div>
        </div>

      </div>
    </div>
  );
}
