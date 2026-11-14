"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Save,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Check,
  Leaf,
  ImageIcon,
  Upload,
  Loader2,
  Sparkles,
  ExternalLink,
  Stethoscope,
  Package,
  MessageSquareQuote,
  Megaphone,
  MapPin,
  Palette,
  Send,
  Trees,
  Phone,
  Clock,
  Mail,
  ArrowRight,
} from "lucide-react";
import {
  WebsiteSection,
  TrustPoint,
  Service,
  Testimonial,
  Banner,
  SiteSettings,
} from "@/lib/types";
import ServicesManager from "../services/ServicesManager";
import TestimonialsManager from "../testimonials/TestimonialsManager";
import BannersManager from "../banners/BannersManager";

interface ContentManagerProps {
  initialSections: WebsiteSection[];
  initialTrustPoints: TrustPoint[];
  initialServices: Service[];
  initialTestimonials: Testimonial[];
  initialBanners: Banner[];
  initialSettings: SiteSettings;
  productsCount: number;
  categoriesCount: number;
}

type TabType =
  | "hero"
  | "about"
  | "services"
  | "products"
  | "testimonials"
  | "banners"
  | "cta"
  | "heritage"
  | "contact"
  | "footer";

export default function ContentManager({
  initialSections,
  initialTrustPoints,
  initialServices,
  initialTestimonials,
  initialBanners,
  initialSettings,
  productsCount,
  categoriesCount,
}: ContentManagerProps) {
  const [sections, setSections] = useState<WebsiteSection[]>(initialSections);
  const [trustPoints, setTrustPoints] = useState<TrustPoint[]>(initialTrustPoints);
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [activeTab, setActiveTab] = useState<TabType>("hero");

  // Loading states
  const [savingSections, setSavingSections] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const [uploadingAboutImage, setUploadingAboutImage] = useState(false);
  const [uploadingCtaImage, setUploadingCtaImage] = useState(false);
  const [uploadingHeritageImage, setUploadingHeritageImage] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Notifications
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Section finders
  const heroSection = sections.find((s) => s.section_key === "hero");
  const aboutSection = sections.find((s) => s.section_key === "our_story");
  const heritageSection = sections.find((s) => s.section_key === "kerala_story");
  const ctaSection = sections.find((s) => s.section_key === "cta_journey");

  // Handlers for Sections
  const handleUpdateSection = (sectionKey: string, field: string, value: unknown) => {
    setSections((prev) =>
      prev.map((s) => (s.section_key === sectionKey ? { ...s, [field]: value } : s))
    );
  };

  const handleToggleSectionVisibility = (sectionKey: string) => {
    setSections((prev) =>
      prev.map((s) => (s.section_key === sectionKey ? { ...s, is_visible: !s.is_visible } : s))
    );
  };

  // Trust Points
  const handleAddTrustPoint = () => {
    const newTP: TrustPoint = {
      id: `tp_${Date.now()}`,
      title: "New Trust Point",
      subtitle: "Ayurvedic standard",
      icon_name: "Leaf",
      is_active: true,
      sort_order: trustPoints.length + 1,
    };
    setTrustPoints([...trustPoints, newTP]);
  };

  const handleUpdateTrustPoint = (id: string, field: string, value: unknown) => {
    setTrustPoints((prev) =>
      prev.map((tp) => (tp.id === id ? { ...tp, [field]: value } : tp))
    );
  };

  const handleDeleteTrustPoint = (id: string) => {
    setTrustPoints((prev) => prev.filter((tp) => tp.id !== id));
  };

  // Hero Banners (up to 3 slides)
  const getHeroBanners = (): Array<{ id: string; image_url: string; link?: string }> => {
    const raw = heroSection?.meta_data?.hero_banners as
      | Array<{ id: string; image_url: string; link?: string }>
      | undefined;
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.filter((b) => b && b.image_url);
    }
    if (heroSection?.image_url) {
      return [{ id: "slide-1", image_url: heroSection.image_url, link: "/products" }];
    }
    return [
      {
        id: "slide-1",
        image_url:
          "https://res.cloudinary.com/cj5pfdzi/image/upload/v1789024868/pvs-ayurvedics/hero/if4tk6fzoyyybuzccooh.webp",
        link: "/products",
      },
    ];
  };

  const updateHeroBanners = (
    newBanners: Array<{ id: string; image_url: string; link?: string }>
  ) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.section_key === "hero") {
          return {
            ...s,
            image_url: newBanners[0]?.image_url || s.image_url,
            meta_data: {
              ...(s.meta_data || {}),
              hero_banners: newBanners,
            },
          };
        }
        return s;
      })
    );
  };

  const handleUploadSlide = async (slotIndex: number, file: File) => {
    if (!file) return;
    setUploadingSlot(slotIndex);
    const data = new FormData();
    data.append("file", file);
    data.append("folder", "pvs-ayurvedics/hero");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const result = await res.json();
      if (res.ok && result.url) {
        const current = [...getHeroBanners()];
        while (current.length <= slotIndex) {
          current.push({ id: `slide-${current.length + 1}`, image_url: "", link: "/products" });
        }
        current[slotIndex] = {
          id: current[slotIndex]?.id || `slide-${slotIndex + 1}`,
          image_url: result.url,
          link: current[slotIndex]?.link || "/products",
        };
        updateHeroBanners(current);
        showToast(`Hero Slide ${slotIndex + 1} uploaded successfully!`);
      } else {
        showToast(result.error || "Failed to upload image.", "error");
      }
    } catch {
      showToast("Network error uploading hero slide.", "error");
    } finally {
      setUploadingSlot(null);
    }
  };

  const handleRemoveSlide = (slotIndex: number) => {
    const current = getHeroBanners().filter((_, idx) => idx !== slotIndex);
    updateHeroBanners(current);
    showToast(`Hero Slide ${slotIndex + 1} removed.`);
  };

  const handleUpdateSlideLink = (slotIndex: number, link: string) => {
    const current = [...getHeroBanners()];
    if (current[slotIndex]) {
      current[slotIndex] = { ...current[slotIndex], link };
      updateHeroBanners(current);
    }
  };

  const handleAddSlideSlot = () => {
    const current = getHeroBanners();
    if (current.length >= 3) {
      showToast("Maximum of 3 hero banner slides supported.", "error");
      return;
    }
    const updated = [
      ...current,
      { id: `slide-${current.length + 1}`, image_url: "", link: "/products" },
    ];
    updateHeroBanners(updated);
  };

  // Image Upload helper for Section Images
  const handleUploadSectionImage = async (
    sectionKey: string,
    file: File,
    folder: string,
    setLoading: (val: boolean) => void
  ) => {
    if (!file) return;
    setLoading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("folder", folder);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const result = await res.json();
      if (res.ok && result.url) {
        handleUpdateSection(sectionKey, "image_url", result.url);
        showToast("Section image updated successfully!");
      } else {
        showToast(result.error || "Failed to upload image.", "error");
      }
    } catch {
      showToast("Failed to upload image file.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Logo Upload
  const handleUploadLogo = async (file: File) => {
    if (!file) return;
    setUploadingLogo(true);
    const data = new FormData();
    data.append("file", file);
    data.append("folder", "pvs-ayurvedics/branding");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const result = await res.json();
      if (res.ok && result.url) {
        setSettings((prev) => ({ ...prev, logo_url: result.url }));
        showToast("Clinic logo updated! Click 'Save Settings' to apply.");
      } else {
        showToast(result.error || "Failed to upload logo.", "error");
      }
    } catch {
      showToast("Failed to upload logo image.", "error");
    } finally {
      setUploadingLogo(false);
    }
  };

  // Save Website Sections
  const handleSaveSections = async () => {
    setSavingSections(true);
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections, trustPoints }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Website sections and content updated successfully!");
      } else {
        showToast(data.error || "Failed to save sections.", "error");
      }
    } catch {
      showToast("An error occurred while saving website sections.", "error");
    } finally {
      setSavingSections(false);
    }
  };

  // Save Settings
  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok && !data.error) {
        showToast("Clinic settings and branding saved successfully!");
      } else {
        showToast(data.error || "Failed to save settings.", "error");
      }
    } catch {
      showToast("An error occurred while saving clinic settings.", "error");
    } finally {
      setSavingSettings(false);
    }
  };

  const tabs: Array<{ id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: "hero", label: "Hero Section", icon: Sparkles },
    { id: "about", label: "About Section", icon: Leaf },
    { id: "services", label: "Treatments & Services", icon: Stethoscope },
    { id: "products", label: "Herbal Products", icon: Package },
    { id: "testimonials", label: "Testimonials", icon: MessageSquareQuote },
    { id: "banners", label: "Promotional Banners", icon: Megaphone },
    { id: "cta", label: "CTA Section", icon: Send },
    { id: "heritage", label: "Kerala Heritage", icon: Trees },
    { id: "contact", label: "Location & Contact", icon: MapPin },
    { id: "footer", label: "Footer & Branding", icon: Palette },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-ayur text-[#0d3b27]">
            Website Content &amp; Image Management
          </h2>
          <p className="text-xs text-stone-500">
            Unified dynamic content control center for every public section, treatment, review, and branding asset.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {(activeTab === "hero" ||
            activeTab === "about" ||
            activeTab === "cta" ||
            activeTab === "heritage") && (
            <button
              type="button"
              disabled={savingSections}
              onClick={handleSaveSections}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0d3b27] text-white text-xs font-semibold hover:bg-[#165b33] transition-colors shadow-sm disabled:opacity-60"
            >
              {savingSections ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-300" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-emerald-300" />
                  <span>Save Website Sections</span>
                </>
              )}
            </button>
          )}

          {(activeTab === "contact" || activeTab === "footer") && (
            <button
              type="button"
              disabled={savingSettings}
              onClick={handleSaveSettings}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0d3b27] text-white text-xs font-semibold hover:bg-[#165b33] transition-colors shadow-sm disabled:opacity-60"
            >
              {savingSettings ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-300" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-emerald-300" />
                  <span>Save Settings &amp; Branding</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-medium border animate-in fade-in ${
            toast.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {toast.type === "success" ? (
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <Sparkles className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Tabs Navigation Bar (Scrollable for mobile/tablets) */}
      <div className="bg-white p-1.5 rounded-2xl border border-stone-200 shadow-2xs overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#0d3b27] text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-300" : "text-stone-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: HERO SECTION */}
      {/* ========================================================================= */}
      {activeTab === "hero" && heroSection && (
        <div className="space-y-6">
          {/* Section Visibility & Overview */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
              <div>
                <h3 className="text-base font-bold font-serif-ayur text-[#0d3b27]">
                  Hero Banner Slider &amp; Text Overlay
                </h3>
                <p className="text-xs text-stone-500">
                  Control the primary top slider, up to 3 banner images, optional headline overlay, and trust badges strip.
                </p>
              </div>

              {/* Visibility Toggle */}
              <button
                type="button"
                onClick={() => handleToggleSectionVisibility("hero")}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors border ${
                  heroSection.is_visible
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-stone-100 border-stone-200 text-stone-500"
                }`}
              >
                {heroSection.is_visible ? (
                  <>
                    <Eye className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Hero Section Visible</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-stone-400" />
                    <span>Hero Section Hidden</span>
                  </>
                )}
              </button>
            </div>

            {/* 3-Slide Banner Manager */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-stone-800">
                  Hero Slides ({getHeroBanners().length}/3 configured)
                </label>
                {getHeroBanners().length < 3 && (
                  <button
                    type="button"
                    onClick={handleAddSlideSlot}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Slide Slot</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {getHeroBanners().map((slide, slotIdx) => (
                  <div
                    key={slide.id || slotIdx}
                    className="p-4 rounded-2xl border border-stone-200 bg-stone-50/70 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                      <span>Slide {slotIdx + 1}</span>
                      {getHeroBanners().length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSlide(slotIdx)}
                          className="p-1 text-stone-400 hover:text-red-600 rounded-lg transition-colors"
                          title="Remove Slide"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Image Preview Box */}
                    <div className="relative aspect-[21/9] rounded-xl overflow-hidden bg-stone-200 border border-stone-300">
                      {slide.image_url ? (
                        <Image
                          src={slide.image_url}
                          alt={`Hero Slide ${slotIdx + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-stone-400 text-xs">
                          No Image Uploaded
                        </div>
                      )}
                    </div>

                    {/* Upload / Replace Action */}
                    <div className="space-y-2">
                      <label className="inline-flex items-center justify-center gap-2 w-full px-3 py-2 bg-[#0d3b27] text-white rounded-xl text-xs font-medium cursor-pointer hover:bg-[#165b33] transition-colors shadow-2xs">
                        {uploadingSlot === slotIdx ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            <span>{slide.image_url ? "Replace Image" : "Upload Image"}</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadSlide(slotIdx, file);
                          }}
                          disabled={uploadingSlot !== null}
                        />
                      </label>

                      {/* Destination Link */}
                      <div>
                        <label className="block text-[10px] text-stone-400 font-medium mb-1">
                          Slide Click Destination
                        </label>
                        <input
                          type="text"
                          value={slide.link || ""}
                          onChange={(e) => handleUpdateSlideLink(slotIdx, e.target.value)}
                          placeholder="/products or /services"
                          className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-mono text-stone-700 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Optional Overlay Headings */}
            <div className="pt-4 border-t border-stone-100 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                Optional Headline Overlay (Leave blank for clean graphic banners)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Main Heading</label>
                  <input
                    type="text"
                    value={heroSection.title || ""}
                    onChange={(e) => handleUpdateSection("hero", "title", e.target.value)}
                    placeholder="e.g. Traditional Ayurvedic Healing (Leave blank for clean image)"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Subtitle / Badge</label>
                  <input
                    type="text"
                    value={heroSection.subtitle || ""}
                    onChange={(e) => handleUpdateSection("hero", "subtitle", e.target.value)}
                    placeholder="e.g. PURE AYURVEDA FOR MODERN LIFE"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Primary CTA Button Text</label>
                  <input
                    type="text"
                    value={heroSection.cta_text || ""}
                    onChange={(e) => handleUpdateSection("hero", "cta_text", e.target.value)}
                    placeholder="e.g. Explore Herbal Remedies"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Primary CTA Button URL</label>
                  <input
                    type="text"
                    value={heroSection.cta_url || ""}
                    onChange={(e) => handleUpdateSection("hero", "cta_url", e.target.value)}
                    placeholder="/products"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges Strip Manager */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-base font-bold font-serif-ayur text-[#0d3b27]">
                  Trust Points &amp; Badges Strip
                </h3>
                <p className="text-xs text-stone-500">
                  Displayed directly beneath the hero banner across 4 columns.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddTrustPoint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Badge</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {trustPoints.map((tp) => (
                <div
                  key={tp.id}
                  className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-stone-400">Badge #{tp.sort_order}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteTrustPoint(tp.id)}
                      className="p-1 text-stone-400 hover:text-red-600 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={tp.title}
                      onChange={(e) => handleUpdateTrustPoint(tp.id, "title", e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-bold text-[#0d3b27] focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={tp.subtitle || ""}
                      onChange={(e) => handleUpdateTrustPoint(tp.id, "subtitle", e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ABOUT SECTION */}
      {/* ========================================================================= */}
      {activeTab === "about" && aboutSection && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
            <div>
              <h3 className="text-base font-bold font-serif-ayur text-[#0d3b27]">
                About Section Manager
              </h3>
              <p className="text-xs text-stone-500">
                Manage the tradition story, illustration/photograph, and supporting philosophy on the homepage.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleToggleSectionVisibility("our_story")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors border ${
                aboutSection.is_visible
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-stone-100 border-stone-200 text-stone-500"
              }`}
            >
              {aboutSection.is_visible ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  <span>About Section Visible</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-stone-400" />
                  <span>About Section Hidden</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Story Image Upload & Preview */}
            <div className="lg:col-span-5 space-y-4">
              <label className="block text-xs font-bold text-stone-800">
                Section Illustration / Photo
              </label>

              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-ayur-cream border border-stone-200 shadow-inner flex items-center justify-center p-4">
                {aboutSection.image_url ? (
                  <Image
                    src={aboutSection.image_url}
                    alt="About Section Story"
                    fill
                    className="object-contain p-4"
                    unoptimized
                  />
                ) : (
                  <span className="text-stone-400 text-xs">No Image Set</span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#0d3b27] text-white rounded-xl text-xs font-semibold cursor-pointer hover:bg-[#165b33] transition-colors shadow-2xs">
                  {uploadingAboutImage ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload New Image</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleUploadSectionImage(
                          "our_story",
                          file,
                          "pvs-ayurvedics/about",
                          setUploadingAboutImage
                        );
                      }
                    }}
                    disabled={uploadingAboutImage}
                  />
                </label>

                {aboutSection.image_url !== "/images/story-ayurveda.svg" && (
                  <button
                    type="button"
                    onClick={() => handleUpdateSection("our_story", "image_url", "/images/story-ayurveda.svg")}
                    className="px-3 py-2 bg-stone-100 text-stone-600 rounded-xl text-xs font-medium hover:bg-stone-200 transition-colors"
                  >
                    Reset to Default SVG
                  </button>
                )}
              </div>
            </div>

            {/* Story Text Fields */}
            <div className="lg:col-span-7 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Section Subheading Badge</label>
                <input
                  type="text"
                  value={aboutSection.subtitle || ""}
                  onChange={(e) => handleUpdateSection("our_story", "subtitle", e.target.value)}
                  placeholder="OUR STORY"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Section Main Title</label>
                <input
                  type="text"
                  value={aboutSection.title || ""}
                  onChange={(e) => handleUpdateSection("our_story", "title", e.target.value)}
                  placeholder="Rooted in Tradition, Caring for Generations"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-serif-ayur font-bold text-[#0d3b27] focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Story Narrative Description</label>
                <textarea
                  rows={4}
                  value={aboutSection.content || ""}
                  onChange={(e) => handleUpdateSection("our_story", "content", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 leading-relaxed focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">CTA Link Text</label>
                  <input
                    type="text"
                    value={aboutSection.cta_text || ""}
                    onChange={(e) => handleUpdateSection("our_story", "cta_text", e.target.value)}
                    placeholder="Learn More"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">CTA Destination URL</label>
                  <input
                    type="text"
                    value={aboutSection.cta_url || ""}
                    onChange={(e) => handleUpdateSection("our_story", "cta_url", e.target.value)}
                    placeholder="/about"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: TREATMENTS & SERVICES */}
      {/* ========================================================================= */}
      {activeTab === "services" && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-emerald-700" />
              <span>
                Treatments added or updated here appear immediately on the Homepage Services Carousel and the dedicated Treatments page.
              </span>
            </div>
            <Link
              href="/services"
              target="_blank"
              className="inline-flex items-center gap-1 font-bold text-emerald-800 hover:underline"
            >
              <span>View Public Page</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          <ServicesManager initialServices={initialServices} />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: HERBAL PRODUCTS */}
      {/* ========================================================================= */}
      {activeTab === "products" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
            <div>
              <h3 className="text-base font-bold font-serif-ayur text-[#0d3b27]">
                Herbal Products &amp; Remedies Hub
              </h3>
              <p className="text-xs text-stone-500">
                Products and categories are managed with dedicated rich editors for multi-image galleries, dosage, and pricing.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/products"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0d3b27] text-white text-xs font-semibold hover:bg-[#165b33] transition-colors shadow-2xs"
              >
                <Package className="w-3.5 h-3.5" />
                <span>Open Products Manager</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Catalog Inventory</span>
                <Package className="w-5 h-5 text-emerald-700" />
              </div>
              <div className="text-3xl font-bold font-serif-ayur text-[#0d3b27]">
                {productsCount} Products
              </div>
              <p className="text-xs text-stone-500">
                Herbal formulations with dynamic Cloudinary galleries, ingredients list, and WhatsApp ordering.
              </p>
              <div className="pt-2">
                <Link
                  href="/admin/products"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
                >
                  <span>Manage Products</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Categories</span>
                <Sparkles className="w-5 h-5 text-emerald-700" />
              </div>
              <div className="text-3xl font-bold font-serif-ayur text-[#0d3b27]">
                {categoriesCount} Categories
              </div>
              <p className="text-xs text-stone-500">
                Product categories with custom banner images and filter tags.
              </p>
              <div className="pt-2">
                <Link
                  href="/admin/categories"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
                >
                  <span>Manage Categories</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Public Storefront</span>
                <ExternalLink className="w-5 h-5 text-emerald-700" />
              </div>
              <div className="text-3xl font-bold font-serif-ayur text-[#0d3b27]">
                Live Store
              </div>
              <p className="text-xs text-stone-500">
                Explore the public customer catalog, search filters, and detail modals.
              </p>
              <div className="pt-2">
                <Link
                  href="/products"
                  target="_blank"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
                >
                  <span>Visit /products</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: TESTIMONIALS */}
      {/* ========================================================================= */}
      {activeTab === "testimonials" && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <MessageSquareQuote className="w-4 h-4 text-emerald-700" />
              <span>
                Genuine patient testimonials and verified feedback displayed on the homepage review carousel.
              </span>
            </div>
          </div>
          <TestimonialsManager initialTestimonials={initialTestimonials} />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: PROMOTIONAL BANNERS */}
      {/* ========================================================================= */}
      {activeTab === "banners" && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-emerald-700" />
              <span>
                Promotional banners for seasonal wellness packages, festival offers, and consultation announcements.
              </span>
            </div>
          </div>
          <BannersManager initialBanners={initialBanners} />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: CTA SECTION */}
      {/* ========================================================================= */}
      {activeTab === "cta" && ctaSection && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
            <div>
              <h3 className="text-base font-bold font-serif-ayur text-[#0d3b27]">
                CTA Banner &amp; Consultation Invitation
              </h3>
              <p className="text-xs text-stone-500">
                Controls the full-width high-contrast call-to-action banner near the bottom of the homepage.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleToggleSectionVisibility("cta_journey")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors border ${
                ctaSection.is_visible
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-stone-100 border-stone-200 text-stone-500"
              }`}
            >
              {ctaSection.is_visible ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  <span>CTA Banner Visible</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-stone-400" />
                  <span>CTA Banner Hidden</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Background Image Upload & Preview */}
            <div className="lg:col-span-5 space-y-4">
              <label className="block text-xs font-bold text-stone-800">
                CTA Background Texture / Image
              </label>

              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-[#0d3b27] border border-stone-200 shadow-inner flex items-center justify-center">
                {ctaSection.image_url ? (
                  <Image
                    src={ctaSection.image_url}
                    alt="CTA Background Preview"
                    fill
                    className="object-cover opacity-60"
                    unoptimized
                  />
                ) : (
                  <span className="text-emerald-200/70 text-xs text-center px-4">
                    Default Dark Green Ayurvedic Gradient Active
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#0d3b27] text-white rounded-xl text-xs font-semibold cursor-pointer hover:bg-[#165b33] transition-colors shadow-2xs">
                  {uploadingCtaImage ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Texture / Photo</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleUploadSectionImage(
                          "cta_journey",
                          file,
                          "pvs-ayurvedics/cta",
                          setUploadingCtaImage
                        );
                      }
                    }}
                    disabled={uploadingCtaImage}
                  />
                </label>

                {ctaSection.image_url && (
                  <button
                    type="button"
                    onClick={() => handleUpdateSection("cta_journey", "image_url", "")}
                    className="px-3 py-2 bg-stone-100 text-stone-600 rounded-xl text-xs font-medium hover:bg-stone-200 transition-colors"
                  >
                    Clear Custom Image
                  </button>
                )}
              </div>
            </div>

            {/* CTA Copy & Destination Fields */}
            <div className="lg:col-span-7 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">CTA Headline</label>
                <input
                  type="text"
                  value={ctaSection.title || ""}
                  onChange={(e) => handleUpdateSection("cta_journey", "title", e.target.value)}
                  placeholder="Begin Your Ayurvedic Wellness Journey"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-serif-ayur font-bold text-[#0d3b27] focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Supporting Text</label>
                <textarea
                  rows={3}
                  value={ctaSection.content || ""}
                  onChange={(e) => handleUpdateSection("cta_journey", "content", e.target.value)}
                  placeholder="Schedule a consultation with our experienced Ayurvedic physicians..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Primary Button Text</label>
                  <input
                    type="text"
                    value={ctaSection.cta_text || ""}
                    onChange={(e) => handleUpdateSection("cta_journey", "cta_text", e.target.value)}
                    placeholder="Book Consultation"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Primary Destination URL</label>
                  <input
                    type="text"
                    value={ctaSection.cta_url || ""}
                    onChange={(e) => handleUpdateSection("cta_journey", "cta_url", e.target.value)}
                    placeholder="/enquiry"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 8: KERALA HERITAGE */}
      {/* ========================================================================= */}
      {activeTab === "heritage" && heritageSection && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
            <div>
              <h3 className="text-base font-bold font-serif-ayur text-[#0d3b27]">
                Kerala Heritage Section Manager
              </h3>
              <p className="text-xs text-stone-500">
                Manage the traditional Kerala wellness spotlight on the homepage and about page.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleToggleSectionVisibility("kerala_story")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors border ${
                heritageSection.is_visible
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-stone-100 border-stone-200 text-stone-500"
              }`}
            >
              {heritageSection.is_visible ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Heritage Card Visible</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-stone-400" />
                  <span>Heritage Card Hidden</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Heritage Photo Upload & Preview */}
            <div className="lg:col-span-5 space-y-4">
              <label className="block text-xs font-bold text-stone-800">
                Heritage Visual / Photograph
              </label>

              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#0d3b27] border border-stone-200 shadow-inner flex items-center justify-center">
                <Image
                  src={heritageSection.image_url || "/images/kerala-heritage.svg"}
                  alt="Kerala Heritage"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#0d3b27] text-white rounded-xl text-xs font-semibold cursor-pointer hover:bg-[#165b33] transition-colors shadow-2xs">
                  {uploadingHeritageImage ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Heritage Image</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleUploadSectionImage(
                          "kerala_story",
                          file,
                          "pvs-ayurvedics/heritage",
                          setUploadingHeritageImage
                        );
                      }
                    }}
                    disabled={uploadingHeritageImage}
                  />
                </label>

                {heritageSection.image_url !== "/images/kerala-heritage.svg" && (
                  <button
                    type="button"
                    onClick={() => handleUpdateSection("kerala_story", "image_url", "/images/kerala-heritage.svg")}
                    className="px-3 py-2 bg-stone-100 text-stone-600 rounded-xl text-xs font-medium hover:bg-stone-200 transition-colors"
                  >
                    Reset to Default SVG
                  </button>
                )}
              </div>
            </div>

            {/* Heritage Copy */}
            <div className="lg:col-span-7 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Card Title</label>
                <input
                  type="text"
                  value={heritageSection.title || ""}
                  onChange={(e) => handleUpdateSection("kerala_story", "title", e.target.value)}
                  placeholder="Wellness Rooted in Kerala"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-serif-ayur font-bold text-[#0d3b27] focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Story Content</label>
                <textarea
                  rows={4}
                  value={heritageSection.content || ""}
                  onChange={(e) => handleUpdateSection("kerala_story", "content", e.target.value)}
                  placeholder="A calm, welcoming environment where traditional Ayurvedic principles meet modern care."
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 leading-relaxed focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={heritageSection.cta_text || ""}
                    onChange={(e) => handleUpdateSection("kerala_story", "cta_text", e.target.value)}
                    placeholder="Watch Our Story"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">CTA Destination URL</label>
                  <input
                    type="text"
                    value={heritageSection.cta_url || ""}
                    onChange={(e) => handleUpdateSection("kerala_story", "cta_url", e.target.value)}
                    placeholder="/about#heritage"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 9: LOCATION & CONTACT */}
      {/* ========================================================================= */}
      {activeTab === "contact" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-5">
            <div>
              <h3 className="text-base font-bold font-serif-ayur text-[#0d3b27]">
                Location, Hours &amp; Communication Details
              </h3>
              <p className="text-xs text-stone-500">
                Displayed on the Contact page, Location map banner, and Footer clinic details.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-bold text-stone-700 mb-1">Physical Clinic Address</label>
              <textarea
                rows={2}
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Clinic Phone (Display)</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Support Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Clinic Working Hours</label>
              <input
                type="text"
                value={settings.working_hours}
                onChange={(e) => setSettings({ ...settings, working_hours: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Google Maps Directions Link</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={settings.google_map_directions_url || ""}
                  onChange={(e) => setSettings({ ...settings, google_map_directions_url: e.target.value })}
                  placeholder="https://maps.google.com/..."
                  className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 font-mono text-xs focus:outline-none focus:border-emerald-500"
                />
                {settings.google_map_directions_url && (
                  <a
                    href={settings.google_map_directions_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl hover:bg-emerald-100 transition-colors"
                    title="Test Google Maps Link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 10: FOOTER & BRANDING */}
      {/* ========================================================================= */}
      {activeTab === "footer" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-5">
            <div>
              <h3 className="text-base font-bold font-serif-ayur text-[#0d3b27]">
                Footer &amp; Brand Identity
              </h3>
              <p className="text-xs text-stone-500">
                Clinic logo, Malayalam taglines, and social media channels displayed on the header, drawer, and footer.
              </p>
            </div>
          </div>

          {/* Logo Upload Widget */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
            <label className="block text-xs font-bold text-stone-800">
              Clinic Logo (Header, Drawer &amp; Footer)
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-28 h-28 rounded-2xl border-2 border-dashed border-stone-300 bg-white p-2 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                {settings.logo_url ? (
                  <Image
                    src={settings.logo_url}
                    alt="Clinic Logo Preview"
                    width={100}
                    height={100}
                    className="max-h-full max-w-full object-contain"
                    unoptimized
                  />
                ) : (
                  <span className="text-stone-400 text-xs text-center">No Logo Set</span>
                )}
              </div>

              <div className="space-y-3 flex-1 w-full text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#0d3b27] text-white rounded-xl text-xs font-semibold cursor-pointer hover:bg-[#165b33] transition-colors shadow-2xs">
                    {uploadingLogo ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading Logo...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload New Logo</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadLogo(file);
                      }}
                      disabled={uploadingLogo}
                    />
                  </label>

                  {settings.logo_url !== "/images/logo.png" && (
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, logo_url: "/images/logo.png" })}
                      className="px-3 py-2 bg-stone-200 text-stone-700 rounded-xl text-xs font-medium hover:bg-stone-300 transition-colors"
                    >
                      Reset to Default Logo
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">Logo URL</label>
                  <input
                    type="text"
                    value={settings.logo_url || ""}
                    onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-mono text-stone-700 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Malayalam Taglines & Social Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Business Name</label>
              <input
                type="text"
                value={settings.business_name}
                onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">English Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Malayalam Main Headline</label>
              <input
                type="text"
                value={settings.malayalam_headline}
                onChange={(e) => setSettings({ ...settings, malayalam_headline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-[#0d3b27] focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Malayalam Footer Subline</label>
              <input
                type="text"
                value={settings.malayalam_tagline}
                onChange={(e) => setSettings({ ...settings, malayalam_tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Instagram Profile URL</label>
              <input
                type="text"
                value={settings.instagram_url || ""}
                onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                placeholder="https://instagram.com/..."
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Facebook Page URL</label>
              <input
                type="text"
                value={settings.facebook_url || ""}
                onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                placeholder="https://facebook.com/..."
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
