"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, X, Upload, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Banner } from "@/lib/types";

interface BannersManagerProps {
  initialBanners: Banner[];
}

export default function BannersManager({ initialBanners }: BannersManagerProps) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [featureInput, setFeatureInput] = useState("");

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

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

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
    setFeatureInput("");
    setModalOpen(true);
  };

  const handleOpenEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({ ...banner });
    setFeatureInput("");
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "desktop_image" | "mobile_image") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please choose an image file.", "error");
      return;
    }

    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("folder", "pvs-ayurvedics/banners");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const json = await res.json();
      if (res.ok && json.url) {
        setFormData((prev) => ({ ...prev, [field]: json.url }));
        showToast("Banner image uploaded successfully!");
      } else {
        showToast(json.error || "Upload failed.", "error");
      }
    } catch {
      showToast("Network error uploading banner.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...(prev.features || []), featureInput.trim()],
      }));
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== idx),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      showToast("Banner title is required.", "error");
      return;
    }

    setSaving(true);
    try {
      const method = editingBanner ? "PUT" : "POST";
      const payload = {
        ...(editingBanner ? { id: editingBanner.id } : {}),
        ...formData,
      };

      const res = await fetch("/api/banners", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.banner) {
        const saved: Banner = data.banner;
        if (editingBanner) {
          setBanners((prev) => prev.map((b) => (b.id === saved.id ? saved : b)));
        } else {
          setBanners((prev) => [...prev, saved]);
        }
        showToast(editingBanner ? "Banner updated!" : "Banner created!");
        setModalOpen(false);
      } else {
        showToast(data.error || "Failed to save banner.", "error");
      }
    } catch {
      showToast("Network error saving banner.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promotional banner?")) return;

    try {
      const res = await fetch(`/api/banners?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (res.ok) {
        setBanners((prev) => prev.filter((b) => b.id !== id));
        showToast("Banner deleted.");
      } else {
        showToast("Failed to delete banner.", "error");
      }
    } catch {
      showToast("Network error deleting banner.", "error");
    }
  };

  const handleToggleActive = async (banner: Banner) => {
    const updated = { ...banner, is_active: !banner.is_active };
    setBanners((prev) => prev.map((b) => (b.id === banner.id ? updated : b)));

    try {
      await fetch("/api/banners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: banner.id, is_active: updated.is_active }),
      });
    } catch {
      setBanners((prev) => prev.map((b) => (b.id === banner.id ? banner : b)));
      showToast("Error updating visibility.", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 border animate-in slide-in-from-top-2 duration-200 ${
            toast.type === "success"
              ? "bg-emerald-950 text-emerald-100 border-emerald-800"
              : "bg-red-950 text-red-100 border-red-800"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-ayur text-[#0d3b27]">
            Promotional Banners &amp; Highlights
          </h2>
          <p className="text-xs text-stone-500">
            Control promotional banners, product highlight cards, and campaign visuals.
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
          <div
            key={ban.id}
            className={`bg-white rounded-3xl border overflow-hidden shadow-2xs flex flex-col justify-between transition-all ${
              ban.is_active ? "border-stone-200" : "border-stone-200 opacity-60 bg-stone-50/50"
            }`}
          >
            <div>
              <div className="relative w-full aspect-[16/9] bg-stone-100 border-b border-stone-100">
                <Image
                  src={ban.desktop_image || "/images/banners/promo-banner.svg"}
                  alt={ban.title}
                  fill
                  className="object-cover"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-mono backdrop-blur-xs">
                  {ban.placement || "home_sidebar"}
                </span>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-sm font-serif-ayur text-stone-900 line-clamp-1">
                    {ban.title}
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleToggleActive(ban)}
                    className={`p-1.5 rounded-lg text-xs ${
                      ban.is_active ? "text-emerald-700 bg-emerald-50" : "text-stone-400 bg-stone-100"
                    }`}
                    title={ban.is_active ? "Active (click to hide)" : "Hidden (click to show)"}
                  >
                    {ban.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {ban.subtitle && (
                  <p className="text-xs text-stone-500 line-clamp-2">{ban.subtitle}</p>
                )}

                {ban.features && ban.features.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {ban.features.map((f, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px]">
                        {f}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-stone-400 truncate max-w-[150px]">
                CTA: {ban.cta_text || "Explore"}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(ban)}
                  className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                  title="Edit banner"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(ban.id)}
                  className="p-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
                  title="Delete banner"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-bold font-serif-ayur text-[#0d3b27]">
                {editingBanner ? "Edit Banner" : "Create New Banner"}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)}>
                <X className="w-5 h-5 text-stone-400 hover:text-stone-700" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Desktop Image */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Banner Image *</label>
                <div className="flex items-center gap-3">
                  <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                    <Image
                      src={formData.desktop_image || "/images/banners/promo-banner.svg"}
                      alt="Banner Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold cursor-pointer text-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? "Uploading..." : "Upload New Image"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "desktop_image")}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Banner Heading *</label>
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
                <label className="block font-bold text-stone-700 mb-1">Subheading / Description</label>
                <textarea
                  rows={2}
                  value={formData.subtitle || ""}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={formData.cta_text || ""}
                    onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">CTA Destination URL</label>
                  <input
                    type="text"
                    value={formData.cta_url || ""}
                    onChange={(e) => setFormData({ ...formData, cta_url: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Bullet Features */}
              <div className="space-y-2">
                <label className="block font-bold text-stone-700">Highlighted Features (Bullet points)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Herbal Formulations..."
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2 bg-[#0d3b27] text-white rounded-xl hover:bg-[#165b33]"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formData.features?.map((f, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 text-stone-700 rounded-lg text-[11px]"
                    >
                      <span>{f}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(i)}
                        className="hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-500 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#0d3b27] text-white font-semibold hover:bg-[#165b33] disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Banner</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
