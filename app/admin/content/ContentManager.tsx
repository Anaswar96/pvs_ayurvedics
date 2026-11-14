"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Save,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Check,
  ArrowUp,
  ArrowDown,
  Leaf,
  FileText,
  Image as ImageIcon,
  Upload,
  Loader2,
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
} from "lucide-react";
import { WebsiteSection, TrustPoint } from "@/lib/types";

interface ContentManagerProps {
  initialSections: WebsiteSection[];
  initialTrustPoints: TrustPoint[];
}

export default function ContentManager({
  initialSections,
  initialTrustPoints,
}: ContentManagerProps) {
  const [sections, setSections] = useState<WebsiteSection[]>(initialSections);
  const [trustPoints, setTrustPoints] = useState<TrustPoint[]>(initialTrustPoints);
  const [activeTab, setActiveTab] = useState<"sections" | "hero" | "about" | "trust" | "heritage">("hero");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const heroFileInputRef = useRef<HTMLInputElement>(null);

  const heroSection = sections.find((s) => s.section_key === "hero");
  const aboutSection = sections.find((s) => s.section_key === "our_story");
  const heritageSection = sections.find((s) => s.section_key === "kerala_story");
  const ctaSection = sections.find((s) => s.section_key === "cta_journey");

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

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

  const handleMoveSection = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // Reassign sort orders
    newSections.forEach((s, idx) => {
      s.sort_order = idx + 1;
    });

    setSections(newSections);
  };

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

  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);

  // Extract up to 3 hero banner slides from heroSection meta_data or image_url
  const getHeroBanners = (): Array<{ id: string; image_url: string; link?: string }> => {
    const raw = heroSection?.meta_data?.hero_banners as Array<{ id: string; image_url: string; link?: string }> | undefined;
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.filter((b) => b && b.image_url);
    }
    if (heroSection?.image_url) {
      return [{ id: "slide-1", image_url: heroSection.image_url, link: "/products" }];
    }
    return [];
  };

  const updateHeroBanners = (newBanners: Array<{ id: string; image_url: string; link?: string }>) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.section_key === "hero") {
          return {
            ...s,
            title: "", // Cleanly remove all text content as requested
            subtitle: "",
            content: "",
            cta_text: "",
            cta_url: "",
            image_url: newBanners[0]?.image_url || "",
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

  // Upload file for a specific hero slide slot (0, 1, 2)
  const handleUploadSlide = async (slotIndex: number, file: File) => {
    if (!file) return;

    setUploadingSlot(slotIndex);
    const data = new FormData();
    data.append("file", file);
    data.append("folder", "pvs-ayurvedics/hero");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (result.url) {
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
        showToast(`Hero Banner Slide ${slotIndex + 1} uploaded successfully!`);
      } else {
        showToast(result.error || "Failed to upload image.", "error");
      }
    } catch (err) {
      console.error("Hero banner upload error:", err);
      showToast("Failed to upload image file.", "error");
    } finally {
      setUploadingSlot(null);
    }
  };

  const handleRemoveSlide = (slotIndex: number) => {
    const current = getHeroBanners().filter((_, idx) => idx !== slotIndex);
    updateHeroBanners(current);
    showToast(`Banner Slide ${slotIndex + 1} removed.`);
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
      showToast("Maximum of 3 hero banner slides reached.", "error");
      return;
    }
    const updated = [
      ...current,
      { id: `slide-${current.length + 1}`, image_url: "", link: "/products" },
    ];
    updateHeroBanners(updated);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections, trustPoints }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3500);
        showToast("Website content and Hero Banner saved successfully!");
      } else {
        showToast(data.error || "Failed to save content.", "error");
      }
    } catch (err) {
      console.error("Save content error:", err);
      showToast("An unexpected error occurred while saving.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-ayur text-[#0d3b27]">
            Website Content &amp; Section Manager
          </h2>
          <p className="text-xs text-stone-500">
            Edit Malayalam headlines, story copy, trust badges, and toggle homepage section visibility.
          </p>
        </div>

        <button
          type="button"
          disabled={saving}
          onClick={handleSaveAll}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0d3b27] text-white text-xs font-semibold hover:bg-[#165b33] transition-colors shadow-sm self-start sm:self-auto disabled:opacity-60"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-emerald-300" />
              <span>Saving Changes...</span>
            </>
          ) : savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Saved Successfully!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl border text-xs font-semibold animate-in fade-in slide-in-from-bottom-5 duration-300 ${
            toast.type === "success"
              ? "bg-[#0d3b27] text-white border-emerald-600 shadow-emerald-950/20"
              : "bg-red-900 text-white border-red-700 shadow-red-950/20"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("hero")}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            activeTab === "hero" ? "bg-[#0d3b27] text-white" : "bg-white text-stone-600 hover:bg-stone-100"
          }`}
        >
          Hero Section
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("about")}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            activeTab === "about" ? "bg-[#0d3b27] text-white" : "bg-white text-stone-600 hover:bg-stone-100"
          }`}
        >
          Our Story / About
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("trust")}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            activeTab === "trust" ? "bg-[#0d3b27] text-white" : "bg-white text-stone-600 hover:bg-stone-100"
          }`}
        >
          Trust Badges ({trustPoints.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("heritage")}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            activeTab === "heritage" ? "bg-[#0d3b27] text-white" : "bg-white text-stone-600 hover:bg-stone-100"
          }`}
        >
          Kerala Heritage Card
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("sections")}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            activeTab === "sections" ? "bg-[#0d3b27] text-white" : "bg-white text-stone-600 hover:bg-stone-100"
          }`}
        >
          Section Visibility &amp; Ordering
        </button>
      </div>

      {/* Tab: Hero Section Carousel Slides */}
      {activeTab === "hero" && heroSection && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-serif-ayur text-[#0d3b27]">
                  Hero Banner Carousel (Up to 3 Slides)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {getHeroBanners().length} of 3 Uploaded
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Upload up to 3 full-width landscape banners with smooth sliding animation. All overlying text and buttons have been removed so your custom-designed banners display edge-to-edge.
              </p>
            </div>

            {getHeroBanners().length < 3 && (
              <button
                type="button"
                onClick={handleAddSlideSlot}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors self-start"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Banner Slide</span>
              </button>
            )}
          </div>

          {/* 3 Banner Slide Slots */}
          <div className="space-y-6">
            {[0, 1, 2].map((slotIndex) => {
              const currentBanners = getHeroBanners();
              const banner = currentBanners[slotIndex];
              const isUploading = uploadingSlot === slotIndex;

              // Don't render empty slot 2 or 3 unless user added it or previous slot is filled
              if (!banner && slotIndex > currentBanners.length) return null;

              return (
                <div
                  key={slotIndex}
                  className="p-5 rounded-2xl bg-stone-50/80 border border-stone-200 space-y-4 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#0d3b27] text-white font-bold flex items-center justify-center text-xs">
                        {slotIndex + 1}
                      </span>
                      <h4 className="font-bold text-stone-800 text-xs sm:text-sm">
                        {slotIndex === 0
                          ? "Hero Slide 1 (Primary Banner)"
                          : `Hero Slide ${slotIndex + 1}`}
                      </h4>
                      {banner?.image_url && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Active in Carousel</span>
                        </span>
                      )}
                    </div>

                    {banner?.image_url && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSlide(slotIndex)}
                        className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-semibold p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete this slide"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Remove Slide</span>
                      </button>
                    )}
                  </div>

                  {/* Hidden File Input for this specific slot */}
                  <input
                    id={`hero-slide-input-${slotIndex}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadSlide(slotIndex, file);
                      e.target.value = "";
                    }}
                    className="hidden"
                  />

                  {/* Slide Image Preview or Upload Dropzone */}
                  {banner?.image_url ? (
                    <div className="space-y-3">
                      <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden border-2 border-emerald-800/20 bg-stone-100 shadow-sm group">
                        <img
                          src={banner.image_url}
                          alt={`Hero Slide ${slotIndex + 1} Preview`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <label
                            htmlFor={`hero-slide-input-${slotIndex}`}
                            className="py-2 px-4 rounded-xl bg-white text-stone-900 text-xs font-bold shadow-md cursor-pointer hover:bg-stone-100 transition-all flex items-center gap-1.5"
                          >
                            <Upload className="w-3.5 h-3.5 text-emerald-800" />
                            <span>Change Image File</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => handleRemoveSlide(slotIndex)}
                            className="py-2 px-4 rounded-xl bg-red-600 text-white text-xs font-bold shadow-md hover:bg-red-700 transition-all flex items-center gap-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>

                      {/* Optional Click Destination Link */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1">
                        <label className="text-[11px] font-bold text-stone-600 whitespace-nowrap">
                          Banner Click Link (Optional):
                        </label>
                        <input
                          type="text"
                          placeholder="/products or /enquiry or https://wa.me/..."
                          value={banner.link || ""}
                          onChange={(e) => handleUpdateSlideLink(slotIndex, e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-mono text-stone-800"
                        />
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() =>
                        !isUploading &&
                        document.getElementById(`hero-slide-input-${slotIndex}`)?.click()
                      }
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const file = e.dataTransfer.files?.[0];
                        if (file && file.type.startsWith("image/")) {
                          handleUploadSlide(slotIndex, file);
                        }
                      }}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 ${
                        isUploading
                          ? "border-emerald-500 bg-emerald-50/50 cursor-wait"
                          : "border-stone-300 hover:border-emerald-700 bg-white hover:bg-emerald-50/20"
                      }`}
                    >
                      {isUploading ? (
                        <>
                          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                            <Loader2 className="w-5 h-5 animate-spin" />
                          </div>
                          <div>
                            <p className="font-bold text-stone-800 text-xs">
                              Uploading slide image from your computer...
                            </p>
                            <p className="text-[11px] text-stone-500">
                              Please wait while the image is being saved
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-stone-800 text-xs sm:text-sm">
                              Click to upload Banner Slide {slotIndex + 1} from your files
                            </p>
                            <p className="text-[11px] text-stone-500 mt-0.5">
                              Or drag &amp; drop your landscape image file here (PNG, JPG, WebP)
                            </p>
                          </div>
                          <span className="text-[10px] text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
                            Recommended landscape format: 21:9 or 16:7 (e.g. 1920x800)
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: About Section Editor */}
      {activeTab === "about" && aboutSection && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-5">
          <h3 className="text-lg font-bold font-serif-ayur text-[#0d3b27]">
            Our Story / About Section Settings
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Section Title</label>
              <input
                type="text"
                value={aboutSection.title || ""}
                onChange={(e) => handleUpdateSection("our_story", "title", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold text-[#0d3b27]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Badge Subtitle</label>
              <input
                type="text"
                value={aboutSection.subtitle || ""}
                onChange={(e) => handleUpdateSection("our_story", "subtitle", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Story Content</label>
              <textarea
                rows={3}
                value={aboutSection.content || ""}
                onChange={(e) => handleUpdateSection("our_story", "content", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab: Trust Points Manager */}
      {activeTab === "trust" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-serif-ayur text-[#0d3b27]">
              Trust &amp; Value Badges
            </h3>
            <button
              type="button"
              onClick={handleAddTrustPoint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Badge</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {trustPoints.map((tp) => (
              <div key={tp.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-700">Badge #{tp.sort_order}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteTrustPoint(tp.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] text-stone-500 font-bold mb-0.5">Title</label>
                  <input
                    type="text"
                    value={tp.title}
                    onChange={(e) => handleUpdateTrustPoint(tp.id, "title", e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg font-bold text-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-stone-500 font-bold mb-0.5">Subtitle</label>
                  <input
                    type="text"
                    value={tp.subtitle || ""}
                    onChange={(e) => handleUpdateTrustPoint(tp.id, "subtitle", e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Heritage Section */}
      {activeTab === "heritage" && heritageSection && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-5">
          <h3 className="text-lg font-bold font-serif-ayur text-[#0d3b27]">
            Kerala Heritage Highlight Card
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Title</label>
              <input
                type="text"
                value={heritageSection.title || ""}
                onChange={(e) => handleUpdateSection("kerala_story", "title", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-[#0d3b27]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Content</label>
              <textarea
                rows={2}
                value={heritageSection.content || ""}
                onChange={(e) => handleUpdateSection("kerala_story", "content", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab: Homepage Section Visibility & Ordering */}
      {activeTab === "sections" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
          <h3 className="text-lg font-bold font-serif-ayur text-[#0d3b27]">
            Homepage Section Order &amp; Visibility
          </h3>
          <p className="text-xs text-stone-500">
            Reorder or toggle any section on/off on the live public homepage.
          </p>

          <div className="space-y-2 pt-2">
            {sections.map((sec, idx) => (
              <div
                key={sec.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-bold text-stone-800">{sec.section_name}</p>
                    <p className="text-[10px] text-stone-400 font-mono">{sec.section_key}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveSection(idx, "up")}
                    className="p-1 rounded-lg hover:bg-stone-200 disabled:opacity-30"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === sections.length - 1}
                    onClick={() => handleMoveSection(idx, "down")}
                    className="p-1 rounded-lg hover:bg-stone-200 disabled:opacity-30"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleSectionVisibility(sec.section_key)}
                    className={`px-3 py-1 rounded-full font-bold text-[10px] ${
                      sec.is_visible
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-stone-200 text-stone-600"
                    }`}
                  >
                    {sec.is_visible ? "Visible" : "Hidden"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
