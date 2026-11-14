"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, X, Star, Upload, MessageSquareQuote } from "lucide-react";
import { Testimonial } from "@/lib/types";

interface TestimonialsManagerProps {
  initialTestimonials: Testimonial[];
}

export default function TestimonialsManager({
  initialTestimonials,
}: TestimonialsManagerProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState<Partial<Testimonial>>({
    author_name: "",
    location: "Manjeri, Malappuram",
    rating: 5,
    quote: "",
    author_image: "/images/testimonials/anjali.svg",
    is_featured: true,
    is_published: true,
    sort_order: 1,
  });

  const handleOpenCreate = () => {
    setEditingTestimonial(null);
    setFormData({
      author_name: "",
      location: "Manjeri, Malappuram",
      rating: 5,
      quote: "",
      author_image: "/images/testimonials/anjali.svg",
      is_featured: true,
      is_published: true,
      sort_order: testimonials.length + 1,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (test: Testimonial) => {
    setEditingTestimonial(test);
    setFormData({ ...test });
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("folder", "pvs-ayurvedics/testimonials");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const result = await res.json();
      if (result.url) {
        setFormData((prev) => ({ ...prev, author_image: result.url }));
      }
    } catch {
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.author_name || !formData.quote) return;

    if (editingTestimonial) {
      setTestimonials((prev) =>
        prev.map((t) => (t.id === editingTestimonial.id ? ({ ...t, ...formData } as Testimonial) : t))
      );
    } else {
      const newT: Testimonial = {
        id: `test_${Date.now()}`,
        author_name: formData.author_name!,
        author_image: formData.author_image || "/images/testimonials/anjali.svg",
        location: formData.location || "Manjeri, Malappuram",
        rating: formData.rating || 5,
        quote: formData.quote!,
        is_featured: formData.is_featured !== undefined ? formData.is_featured : true,
        is_published: formData.is_published !== undefined ? formData.is_published : true,
        sort_order: formData.sort_order || testimonials.length + 1,
      };
      setTestimonials([...testimonials, newT]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this patient testimonial?")) {
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-ayur text-[#0d3b27]">
            Patient Testimonials
          </h2>
          <p className="text-xs text-stone-500">
            Showcase authentic patient recovery stories, ratings, and doctor reviews.
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((test) => (
          <div key={test.id} className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {Array.from({ length: test.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                  {test.is_published ? "Published" : "Draft"}
                </span>
              </div>

              <p className="text-xs text-stone-700 italic leading-relaxed">
                &ldquo;{test.quote}&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-emerald-100 flex-shrink-0">
                  <Image src={test.author_image || "/images/testimonials/anjali.svg"} alt={test.author_name} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-800">{test.author_name}</p>
                  <p className="text-[10px] text-stone-400">{test.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(test)}
                  className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(test.id)}
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-bold font-serif-ayur text-[#0d3b27]">
                {editingTestimonial ? "Edit Testimonial" : "Add Patient Review"}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Patient / Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anjali"
                  value={formData.author_name || ""}
                  onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="Manjeri, Malappuram"
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Star Rating (1 - 5)</label>
                <select
                  value={formData.rating || 5}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                >
                  <option value={5}>5 Stars - Outstanding Experience</option>
                  <option value={4}>4 Stars - Very Good Care</option>
                  <option value={3}>3 Stars - Satisfied</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Review Quote *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="The products are really good and the team is very supportive..."
                  value={formData.quote || ""}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl resize-none"
                />
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
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
