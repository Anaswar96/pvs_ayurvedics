import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Leaf, Award, Users, Trees } from "lucide-react";
import { WebsiteSection } from "@/lib/types";

interface AboutSectionProps {
  section?: WebsiteSection;
}

export default function AboutSection({ section }: AboutSectionProps) {
  if (section && !section.is_visible) return null;

  const subtitle = section?.subtitle || "OUR STORY";
  const title = section?.title || "Rooted in Tradition, Caring for Generations";
  const description =
    section?.content ||
    "At PVS Ayurvedics, we bring the wisdom of Ayurveda closer to your everyday life. Our focus is on natural care, thoughtful consultation, and wellness for the entire family.";
  const ctaText = section?.cta_text || "Learn More";
  const ctaUrl = section?.cta_url || "/about";
  const imageSrc = section?.image_url || "/images/story-ayurveda.svg";

  const pillars = [
    { title: "Natural Ingredients", desc: "100% herbal", icon: Leaf },
    { title: "Quality Focused", desc: "Strict standards", icon: Award },
    { title: "People Centred", desc: "Compassionate care", icon: Users },
    { title: "Community Care", desc: "Family wellness", icon: Trees },
  ];

  return (
    <section id="story" className="py-14 lg:py-20 bg-white border-y border-emerald-900/5 relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Illustration / Photo */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-emerald-900/10 bg-ayur-cream group">
              <Image
                src={imageSrc}
                alt="PVS Ayurvedics Tradition & Story"
                fill
                className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Right Copy */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#0d3b27] text-xs font-bold tracking-wider uppercase">
              {subtitle}
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0d3b27] font-serif-ayur leading-tight">
              {title}
            </h2>

            <p className="text-base text-stone-600 leading-relaxed max-w-2xl">
              {description}
            </p>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {pillars.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={idx} className="p-3.5 rounded-2xl bg-ayur-cream border border-emerald-900/5 text-center sm:text-left">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-[#0d3b27] flex items-center justify-center mb-2.5 mx-auto sm:mx-0">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-[#0d3b27]">{item.title}</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">{item.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <Link
                href={ctaUrl}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#0d3b27] hover:text-[#165b33] group"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
