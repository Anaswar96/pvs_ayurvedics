import React from "react";
import Link from "next/link";
import { getSiteSettings } from "@/lib/supabase/queries";

export const metadata = {
  title: "Privacy Policy | PVS Ayurvedics",
  description: "Privacy policy and patient data confidentiality standards of PVS Ayurvedics in Manjeri, Kerala.",
};

export default async function PrivacyPolicyPage() {
  const settings = await getSiteSettings();

  return (
    <div className="py-12 lg:py-16 bg-ayur-cream min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-3xl border border-emerald-900/10 shadow-sm space-y-8 text-stone-700 leading-relaxed text-sm">
        
        <div className="border-b border-stone-200 pb-6">
          <div className="inline-flex items-center gap-2 text-xs text-stone-500 font-medium mb-2">
            <Link href="/" className="hover:text-[#0d3b27]">Home</Link>
            <span>/</span>
            <span className="text-[#0d3b27] font-semibold">Privacy Policy</span>
          </div>
          <h1 className="text-3xl font-bold font-serif-ayur text-[#0d3b27]">
            Privacy Policy
          </h1>
          <p className="text-xs text-stone-400 mt-1">Last updated: September 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-serif-ayur text-[#0d3b27]">1. Introduction</h2>
          <p>
            At <strong>{settings.business_name || "PVS Ayurvedics"}</strong>, located in Manjeri, Malappuram, Kerala, we value and respect your privacy. This Privacy Policy explains how we collect, handle, and safeguard your personal information when you visit our website, submit consultation inquiries, or purchase our Ayurvedic formulations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-serif-ayur text-[#0d3b27]">2. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li><strong>Contact Information:</strong> Name, phone number, email address, and city when submitting enquiry or booking forms.</li>
            <li><strong>Health Consultation Details:</strong> Voluntary health queries, product interests, and preferred appointment dates.</li>
            <li><strong>Technical Usage Data:</strong> Anonymized analytical logs for site performance optimization.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-serif-ayur text-[#0d3b27]">3. How We Use Your Information</h2>
          <p>
            Your information is strictly used to fulfill consultation requests, answer WhatsApp/phone enquiries, provide customized Ayurvedic recommendations, and deliver customer care. We never sell, rent, or trade your personal or health data to third parties.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-serif-ayur text-[#0d3b27]">4. Contact Us</h2>
          <p>
            If you have any questions regarding your data privacy, please reach out to us at <a href={`mailto:${settings.email}`} className="text-emerald-800 font-semibold underline">{settings.email}</a> or visit us at {settings.address}.
          </p>
        </section>

      </div>
    </div>
  );
}
