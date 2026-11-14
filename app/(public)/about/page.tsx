import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Leaf, Award, Users, Trees, ShieldCheck, HeartHandshake, MapPin, ArrowRight } from "lucide-react";
import { getSiteSettings } from "@/lib/supabase/queries";

export const metadata = {
  title: "About Us & Our Heritage | PVS Ayurvedics Manjeri Kerala",
  description:
    "Learn about PVS Ayurvedics in Manjeri, Malappuram, Kerala. Rooted in authentic Ayurvedic tradition, botanical purity, and personalized compassionate healthcare.",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  const coreValues = [
    {
      title: "Natural Ingredients",
      desc: "We ethically source raw botanicals, forest herbs, and cold-pressed oils prepared according to classic Ayurvedic scriptures without harsh chemical additives.",
      icon: Leaf,
    },
    {
      title: "Quality Focused",
      desc: "Every herbal formulation and oil preparation is cooked with authentic classical decoction methods under the vigilant guidance of Ayurvedic Vaidyas.",
      icon: Award,
    },
    {
      title: "People Centred",
      desc: "We honor the unique constitution (Prakriti) of every patient, offering patient-centric listening, personalized lifestyle tips, and diet regimens.",
      icon: Users,
    },
    {
      title: "Community Care",
      desc: "Deeply rooted in Manjeri, Malappuram, we are committed to uplifting family wellness and making genuine Ayurveda accessible to all.",
      icon: Trees,
    },
  ];

  return (
    <div className="py-10 lg:py-16 bg-ayur-cream min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Breadcrumb & Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs text-stone-500 font-medium">
            <Link href="/" className="hover:text-[#0d3b27]">Home</Link>
            <span>/</span>
            <span className="text-[#0d3b27] font-semibold">About Us</span>
          </div>

          <span className="text-xs font-bold tracking-widest text-emerald-800 uppercase block">
            OUR STORY &amp; HERITAGE
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0d3b27] font-serif-ayur">
            Rooted in Tradition, Caring for Generations
          </h1>

          <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
            At PVS Ayurvedics, we bring the timeless wisdom of Kerala Ayurveda into modern everyday life with natural remedies, mindful consultations, and holistic family care.
          </p>
        </div>

        {/* Legacy & Visual Section */}
        <div className="bg-white p-6 sm:p-12 rounded-3xl border border-emerald-900/10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
              AUTHENTIC KERALA AYURVEDA
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#0d3b27] font-serif-ayur leading-tight">
              A Legacy of Natural Healing in Manjeri
            </h2>

            <div className="space-y-4 text-sm text-stone-600 leading-relaxed">
              <p>
                Kerala is revered worldwide as the cradle of authentic Ayurveda. Blessed by lush monsoons, fertile Western Ghats soil, and unbroken traditions of Ayurvedic physicians, the region holds centuries of healing wisdom.
              </p>
              <p>
                <strong>PVS Ayurvedics</strong> was established with a clear mission: to make pure, effective, and classical Ayurvedic wellness accessible to everyone. From authentic thailams and kashayams to restorative physician consultations, every offering is crafted with reverence for natural balance.
              </p>
              <p>
                Whether you seek relief from chronic joint pain, digestive imbalance, seasonal respiratory allergies, or desire nourished hair and glowing skin, our clinic in Manjeri is your dedicated sanctuary for natural healing.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-6 text-xs text-stone-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Certified Pure Ingredients</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-emerald-700" />
                <span>Personalized Care</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-emerald-900/10 bg-ayur-cream group">
              <Image
                src="/images/kerala-heritage.svg"
                alt="Kerala Traditional Ayurveda Heritage"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* 4 Core Pillars */}
        <div id="approach" className="space-y-8 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold tracking-widest text-emerald-800 uppercase block mb-1">
              OUR GUIDING PRINCIPLES
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0d3b27] font-serif-ayur">
              How We Nurture Your Health
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((val, idx) => {
              const IconComp = val.icon;
              return (
                <div key={idx} className="ayur-card p-6 bg-white space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-[#0d3b27] font-serif-ayur">
                      {val.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-500 leading-relaxed mt-2">
                      {val.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Clinic Location & CTA Banner */}
        <div className="bg-[#0d3b27] text-white p-8 sm:p-12 rounded-3xl relative overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Manjeri, Malappuram, Kerala</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif-ayur">
              Visit PVS Ayurvedics in Manjeri
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl leading-relaxed">
              Experience warm hospitality, consultation with experienced Ayurvedic practitioners, and explore our complete dispensary of genuine herbal formulations.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
            <Link
              href="/enquiry"
              className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-white text-[#0d3b27] text-xs font-bold hover:bg-emerald-50 transition-colors"
            >
              <span>Book a Consultation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full border border-emerald-400/30 text-white text-xs font-semibold hover:bg-emerald-900/40 transition-colors"
            >
              <span>Get Directions</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
