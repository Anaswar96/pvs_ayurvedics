import React from "react";
import Link from "next/link";
import { getSiteSettings } from "@/lib/supabase/queries";

export const metadata = {
  title: "Terms and Conditions | PVS Ayurvedics",
  description: "Terms and conditions for using PVS Ayurvedics website, consultations, and herbal products.",
};

export default async function TermsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="py-12 lg:py-16 bg-ayur-cream min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-3xl border border-emerald-900/10 shadow-sm space-y-8 text-stone-700 leading-relaxed text-sm">
        
        <div className="border-b border-stone-200 pb-6">
          <div className="inline-flex items-center gap-2 text-xs text-stone-500 font-medium mb-2">
            <Link href="/" className="hover:text-[#0d3b27]">Home</Link>
            <span>/</span>
            <span className="text-[#0d3b27] font-semibold">Terms &amp; Conditions</span>
          </div>
          <h1 className="text-3xl font-bold font-serif-ayur text-[#0d3b27]">
            Terms and Conditions
          </h1>
          <p className="text-xs text-stone-400 mt-1">Last updated: September 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-serif-ayur text-[#0d3b27]">1. General Overview</h2>
          <p>
            Welcome to the official website of <strong>{settings.business_name || "PVS Ayurvedics"}</strong>. By browsing this website, scheduling consultations, or ordering products, you agree to comply with and be bound by the following terms and conditions of use.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-serif-ayur text-[#0d3b27]">2. Ayurvedic Advice &amp; Medical Disclaimer</h2>
          <p>
            The herbal formulations, wellness descriptions, and dietary suggestions on this website are rooted in traditional Ayurvedic knowledge. They are intended for holistic balance and wellness maintenance. While consultations with our registered Vaidyas provide individualized advice, information on this site does not replace emergency medical interventions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-serif-ayur text-[#0d3b27]">3. Product Descriptions &amp; Inquiries</h2>
          <p>
            We strive to provide accurate ingredient disclosures, usage guidelines, and beneficial attributes. Pricing and availability are subject to confirmation upon direct inquiry via WhatsApp or at our clinic counter in Manjeri, Malappuram.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-serif-ayur text-[#0d3b27]">4. Governing Law</h2>
          <p>
            These terms are governed by and construed in accordance with the laws of India and the jurisdiction of courts in Malappuram District, Kerala.
          </p>
        </section>

      </div>
    </div>
  );
}
