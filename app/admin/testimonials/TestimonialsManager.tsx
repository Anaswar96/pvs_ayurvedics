"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, X, Star, Upload, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Testimonial } from "@/lib/types";

interface TestimonialsManagerProps {
  initialTestimonials: Testimonial[];
}

export default function TestimonialsManager({ initialTestimonials }: TestimonialsManagerProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [formData, setFormData] = useState<Partial<Testimonial>>({
    author_name: "",
    author_image: "/images/testimonials/anjali.svg",
    location: "Manjeri, Malappuram",
    rating: 5,
    quote: "",
    is_featured: true,
    is_published: true,
    sort_order: 1,
  });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleOpenCreate = () => {
    setEditingTestimonial(null);
    setFormData({
      author_name: "",
      author_image: "/images/testimonials/anjali.svg",
      location: "Manjeri, Malappuram",
      rating: 5,
      quote: "",
      is_featured: true,
      is_published: true,
      sort_order: testimonials.length + 1,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (t: Testimonial) => {
    setEditingTestimonial(t);
    setFormData({ ...t });
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please choose an image file.", "error");
      return;
    }

    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("folder", "pvs-ayurvedics/testimonials");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const json = await res.json();
      if (res.ok && json.url) {
        setFormData((prev) => ({ ...prev, author_image: json.url }));
        showToast("Author photo uploaded!");
      } else {
        showToast(json.error || "Upload failed.", "error");
      }
    } catch {
      showToast("Network error uploading photo.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.author_name || !formData.quote) {
      showToast("Author name and quote are required.", "error");
      return;
    }

    setSaving(true);
    try {
      const method = editingTestimonial ? "PUT" : "POST";
      const payload = {
        ...(editingTestimonial ? { id: editingTestimonial.id } : {}),
        ...formData,
      };

      const res = await fetch("/api/testimonials", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.testimonial) {
        const saved: Testimonial = data.testimonial;
        if (editingTestimonial) {
          setTestimonials((prev) => prev.map((t) => (t.id === saved.id ? saved : t)));
        } else {
          setTestimonials((prev) => [...prev, saved]);
        }
        showToast(editingTestimonial ? "Testimonial updated!" : "Testimonial added!");
        setModalOpen(false);
      } else {
        showToast(data.error || "Failed to save testimonial.", "error");
      }
    } catch {
      showToast("Network error saving testimonial.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      const res = await fetch(`/api/testimonials?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (res.ok) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
        showToast("Testimonial deleted.");
      } else {
        showToast("Failed to delete testimonial.", "error");
      }
    } catch {
      showToast("Network error deleting testimonial.", "error");
    }
  };

  const handleTogglePublish = async (t: Testimonial) => {
    const updated = { ...t, is_published: !t.is_published };
    setTestimonials((prev) => prev.map((item) => (item.id === t.id ? updated : item)));

    try {
      await fetch("/api/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: t.id, is_published: updated.is_published }),
      });
    } catch {
      setTestimonials((prev) => prev.map((item) => (item.id === t.id ? t : item)));
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
            Patient Testimonials Management
          </h2>
          <p className="text-xs text-stone-500">
            Manage genuine patient reviews, doctor feedback, and community experiences.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0d3b27] text-white text-xs font-semibold hover:bg-[#165b33] transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className={`bg-white rounded-3xl border p-6 flex flex-col justify-between shadow-2xs transition-all ${
              t.is_published ? "border-stone-200" : "border-stone-200 opacity-60 bg-stone-50/50"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => handleTogglePublish(t)}
                  className={`p-1.5 rounded-lg text-xs ${
                    t.is_published ? "text-emerald-700 bg-emerald-50" : "text-stone-400 bg-stone-100"
                  }`}
                  title={t.is_published ? "Published (click to hide)" : "Hidden (click to show)"}
                >
                  {t.is_published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>

              <blockquote className="text-xs text-stone-700 italic leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-stone-100 border border-stone-200">
                  <Image
                    src={t.author_image || "/images/testimonials/anjali.svg"}
                    alt={t.author_name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">{t.author_name}</h4>
                  <p className="text-[11px] text-stone-400">{t.location || "Manjeri, Malappuram"}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(t)}
                  className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                  title="Edit testimonial"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(t.id)}
                  className="p-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
                  title="Delete testimonial"
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
                {editingTestimonial ? "Edit Testimonial" : "New Testimonial"}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)}>
                <X className="w-5 h-5 text-stone-400 hover:text-stone-700" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Patient Photo Upload */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Author Photo / Avatar</label>
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-stone-100 border border-stone-200">
                    <Image
                      src={formData.author_image || "/images/testimonials/anjali.svg"}
                      alt="Author preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold cursor-pointer text-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? "Uploading..." : "Upload Photo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Author Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Priya Menon"
                  value={formData.author_name || ""}
                  onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Location / Details</label>
                <input
                  type="text"
                  placeholder="e.g. Manjeri, Malappuram"
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Rating (1 to 5 Stars)</label>
                <select
                  value={formData.rating || 5}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                  <option value={3}>⭐⭐⭐ (3 Stars)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Patient Review Quote *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share the patient's experience with treatments and herbal formulations..."
                  value={formData.quote || ""}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl resize-none"
                />
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
                  <span>Save Testimonial</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
