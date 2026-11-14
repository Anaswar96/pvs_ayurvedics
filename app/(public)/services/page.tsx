import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getServices, getProducts, getSiteSettings } from "@/lib/supabase/queries";
import EnquirySection from "@/components/public/EnquirySection";
import { Stethoscope, Sparkles, Package, Users, CheckCircle2, Calendar, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Holistic Ayurvedic Services & Consultations | PVS Ayurvedics Manjeri",
  description:
    "Comprehensive pulse diagnosis (Nadi Pariksha), constitution assessment (Prakriti), Panchakarma therapy plans, and personalized herbal medicine guidance in Manjeri, Kerala.",
};

export default async function ServicesPage() {
  const [services, products, settings] = await Promise.all([
    getServices(),
    getProducts(),
    getSiteSettings(),
  ]);

  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case "sparkles":
        return <Sparkles className="w-8 h-8 text-emerald-800" />;
      case "package":
        return <Package className="w-8 h-8 text-emerald-800" />;
      case "users":
        return <Users className="w-8 h-8 text-emerald-800" />;
      case "stethoscope":
      default:
        return <Stethoscope className="w-8 h-8 text-emerald-800" />;
    }
  };

  return (
    <div className="py-10 lg:py-16 bg-ayur-cream min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs text-stone-500 font-medium">
            <Link href="/" className="hover:text-[#0d3b27]">Home</Link>
            <span>/</span>
            <span className="text-[#0d3b27] font-semibold">Services</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0d3b27] font-serif-ayur">
            Holistic Care for Your Well-being
          </h1>

          <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Rooted in authentic Kerala Ayurvedic tradition. Our experienced physicians offer customized wellness programs, pulse diagnosis, and lifelong health guidance in Manjeri.
          </p>
        </div>

        {/* Services Detailed List */}
        <div className="space-y-8 mb-16">
          {services.map((srv, index) => (
            <div
              key={srv.id}
              id={srv.slug}
              className="bg-white p-6 sm:p-10 rounded-3xl border border-emerald-900/10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center scroll-mt-24"
            >
              <div className="lg:col-span-8 space-y-4">
                {srv.image_url && (
                  <div className="relative w-full aspect-[21/9] sm:aspect-[3/1] rounded-2xl overflow-hidden bg-stone-50 border border-stone-200 mb-2">
                    <Image
                      src={srv.image_url}
                      alt={srv.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    {getIcon(srv.icon_name)}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 tracking-wider uppercase">
                      Service 0{index + 1}
                    </span>
                    <h2 className="text-2xl font-bold text-[#0d3b27] font-serif-ayur">
                      {srv.title}
                    </h2>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                  {srv.full_description || srv.short_description}
                </p>

                {/* Key Benefits */}
                {srv.benefits && srv.benefits.length > 0 && (
                  <div className="pt-2">
                    <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2.5">
                      What to Expect:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {srv.benefits.map((b, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-stone-600">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Box on Right */}
              <div className="lg:col-span-4 bg-ayur-cream p-6 rounded-2xl border border-emerald-900/5 space-y-4 text-center lg:text-left">
                <h4 className="text-sm font-bold text-[#0d3b27] font-serif-ayur">
                  Ready to Consult?
                </h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Book an in-person appointment at our Manjeri clinic or consult online via WhatsApp.
                </p>
                <div className="space-y-2 pt-2">
                  <a
                    href="#consultation-booking"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0d3b27] text-white text-xs font-semibold hover:bg-[#165b33] transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Appointment</span>
                  </a>
                  <a
                    href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, "")}?text=Hello%20PVS%20Ayurvedics,%20I%20would%20like%20to%20inquire%20about%20${encodeURIComponent(srv.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-emerald-700/30 text-[#0d3b27] bg-white text-xs font-semibold hover:bg-emerald-50 transition-colors"
                  >
                    <span>Quick WhatsApp Enquiry</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Booking Form */}
        <div id="consultation-booking" className="max-w-3xl mx-auto mb-12">
          <EnquirySection
            products={products}
            services={services}
            isStandalonePage={true}
          />
        </div>

      </div>
    </div>
  );
}
