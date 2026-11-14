"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, X, Upload, Image as ImageIcon, Eye, EyeOff } from "lucide-react";
import { Banner } from "@/lib/types";

interface BannersManagerProps {
  initialBanners: Banner[];
}

export default function BannersManager({ initialBanners }: BannersManagerProps) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState<Partial<Banner>>({
    title: "",
    subtitle: "",
    cta_text: "Explore Products",
    cta_url: "/products",
    desktop_image: "/images/banners/promo-banner.svg",
    mobile_image: null,
    placement: "home_sidebar",
    features: ["Herbal Formulations", "Quality Ingredients", "Daily Wellness Support"],
    is_active: true,
    sort_order: 1,
  });

  const handleOpenCreate = () => {
    setEditingBanner(null);
    setFormData({
      title: "",
      subtitle: "",
      cta_text: "Explore Products",
      cta_url: "/products",
      desktop_image: "/images/banners/promo-banner.svg",
      mobile_image: null,
      placement: "home_sidebar",
      features: ["Herbal Formulations", "Quality Ingredients", "Daily Wellness Support"],
      is_active: true,
      sort_order: banners.length + 1,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({ ...banner });
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("folder", "pvs-ayurvedics/banners");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const result = await res.json();
      if (result.url) {
        setFormData((prev) => ({ ...prev, desktop_image: result.url }));
      }
    } catch {
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    if (editingBanner) {
      setBanners((prev) =>
        prev.map((b) =>
          b.id === editingBanner.id
            ? ({ ...b, ...formData, updated_at: new Date().toISOString() } as Banner)
            : b
        )
      );
    } else {
      const newB: Banner = {
        id: `ban_${Date.now()}`,
        title: formData.title!,
        subtitle: formData.subtitle || null,
        cta_text: formData.cta_text || "Explore Products",
        cta_url: formData.cta_url || "/products",
        desktop_image: formData.desktop_image || "/images/banners/promo-banner.svg",
        mobile_image: formData.mobile_image || null,
        placement: formData.placement || "home_sidebar",
        features: formData.features || [],
        start_date: null,
        end_date: null,
        is_active: formData.is_active !== undefined ? formData.is_active : true,
        sort_order: formData.sort_order || banners.length + 1,
        created_at: new Date().toISOString(),
      };
      setBanners([...banners, newB]);
    }

    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this banner?")) {
      setBanners((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const handleToggleActive = (id: string) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, is_active: !b.is_active } : b))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-ayur text-[#0d3b27]">
            Banners &amp; Highlights Management
          </h2>
          <p className="text-xs text-stone-500">
            Control promotional banners, sidebar cards, and campaign visuals across the public store.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0d3b27] text-white text-xs font-semibold hover:bg-[#165b33] transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Banner</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((ban) => (
          <div key={ban.id} className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs flex flex-col justify-between">
            <div>
              <div className="relative w-full aspect-[16/9] bg-stone-100 border-b border-stone-100">
                <Image
                  src={ban.desktop_image || "/images/banners/promo-banner.svg"}
                  alt={ban.title}
                  fill
                  className="object-contain p-3"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-950/80 text-white text-[10px] font-bold">
                  {ban.placement}
                </span>
              </div>

              <div className="p-5 space-y-2.5">
                <h3 className="text-base font-bold font-serif-ayur text-[#0d3b27] line-clamp-1">
                  {ban.title}
                </h3>
                {ban.subtitle && (
                  <p className="text-xs text-stone-500 line-clamp-2">{ban.subtitle}</p>
                )}

                <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500 border-t border-stone-100">
                  <span>CTA: <strong>{ban.cta_text}</strong></span>
                  <span className="truncate max-w-[120px]">{ban.cta_url}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleToggleActive(ban.id)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  ban.is_active ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-600"
                }`}
              >
                {ban.is_active ? "Active" : "Disabled"}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(ban)}
                  className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(ban.id)}
                  className="p-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-bold font-serif-ayur text-[#0d3b27]">
                {editingBanner ? "Edit Banner" : "New Promotional Banner"}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Banner Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Natural Solutions for a Healthier You"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Subtitle / Description</label>
                <textarea
                  rows={2}
                  placeholder="Short marketing hook..."
                  value={formData.subtitle || ""}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Button Label</label>
                  <input
                    type="text"
                    value={formData.cta_text || ""}
                    onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Button Link</label>
                  <input
                    type="text"
                    value={formData.cta_url || ""}
                    onChange={(e) => setFormData({ ...formData, cta_url: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Image URL / Cloudinary</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.desktop_image || ""}
                    onChange={(e) => setFormData({ ...formData, desktop_image: e.target.value })}
                    className="flex-1 px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                  <label className="px-3 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl cursor-pointer font-semibold flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? "..." : "Upload"}</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0d3b27] text-white font-semibold hover:bg-[#165b33]"
                >
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
