import React from "react";
import Link from "next/link";
import { getProducts, getServices } from "@/lib/supabase/queries";
import EnquirySection from "@/components/public/EnquirySection";
import { ShieldCheck, HeartHandshake, Leaf, Clock } from "lucide-react";

export const metadata = {
  title: "Book Consultation & Product Enquiry | PVS Ayurvedics Manjeri",
  description:
    "Schedule an Ayurvedic consultation with experienced physicians at PVS Ayurvedics in Manjeri or place product enquiries online.",
};

export default async function EnquiryPage() {
  const [products, services] = await Promise.all([
    getProducts(),
    getServices(),
  ]);

  return (
    <div className="py-10 lg:py-16 bg-ayur-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Breadcrumb & Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs text-stone-500 font-medium">
            <Link href="/" className="hover:text-[#0d3b27]">Home</Link>
            <span>/</span>
            <span className="text-[#0d3b27] font-semibold">Consultation &amp; Enquiry</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0d3b27] font-serif-ayur">
            Book Your Consultation
          </h1>

          <p className="text-sm sm:text-base text-stone-600 max-w-lg mx-auto leading-relaxed">
            Fill out the form below and our medical reception team in Manjeri will contact you to confirm your appointment or product order.
          </p>
        </div>

        {/* Feature points */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-white border border-stone-200 text-xs font-semibold text-stone-700 flex items-center justify-center gap-1.5">
            <Leaf className="w-4 h-4 text-emerald-700" />
            <span>Pure Botanicals</span>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-stone-200 text-xs font-semibold text-stone-700 flex items-center justify-center gap-1.5">
            <HeartHandshake className="w-4 h-4 text-emerald-700" />
            <span>Nadi Pariksha</span>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-stone-200 text-xs font-semibold text-stone-700 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Privacy Assured</span>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-stone-200 text-xs font-semibold text-stone-700 flex items-center justify-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-700" />
            <span>Quick Callback</span>
          </div>
        </div>

        {/* Form Container */}
        <EnquirySection
          products={products}
          services={services}
          isStandalonePage={true}
        />

      </div>
    </div>
  );
}
