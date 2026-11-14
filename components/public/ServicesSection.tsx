import React from "react";
import Link from "next/link";
import { Stethoscope, Sparkles, Package, Users, ArrowRight } from "lucide-react";
import { Service, WebsiteSection } from "@/lib/types";

interface ServicesSectionProps {
  section?: WebsiteSection;
  services: Service[];
}

export default function ServicesSection({ section, services }: ServicesSectionProps) {
  if (section && !section.is_visible) return null;

  const title = section?.title || "Holistic Care for Your Well-being";
  const subtitle = section?.subtitle || "OUR SERVICES";

  const getServiceIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case "sparkles":
        return <Sparkles className="w-6 h-6 text-emerald-800" />;
      case "package":
        return <Package className="w-6 h-6 text-emerald-800" />;
      case "users":
        return <Users className="w-6 h-6 text-emerald-800" />;
      case "stethoscope":
      default:
        return <Stethoscope className="w-6 h-6 text-emerald-800" />;
    }
  };

  return (
    <section id="services" className="py-14 lg:py-20 bg-white border-t border-emerald-900/5 relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest text-emerald-800 uppercase block mb-2">
            {subtitle}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0d3b27] font-serif-ayur">
            {title}
          </h2>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="ayur-card p-6 flex flex-col justify-between hover:border-emerald-700/30 transition-all duration-300"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4">
                  {getServiceIcon(srv.icon_name)}
                </div>

                <h3 className="text-lg font-bold text-[#0d3b27] font-serif-ayur mb-2">
                  {srv.title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                  {srv.short_description}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-stone-100">
                <Link
                  href={`/services#${srv.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0d3b27] hover:text-[#165b33] group"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
