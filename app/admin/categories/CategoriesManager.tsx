"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, X, Layers, Eye, EyeOff, Upload, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Category } from "@/lib/types";
import { slugify } from "@/lib/utils";

interface CategoriesManagerProps {
  initialCategories: Category[];
}

export default function CategoriesManager({ initialCategories }: CategoriesManagerProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [formData, setFormData] = useState<Partial<Category>>({
    name: "",
    slug: "",
    description: "",
    image_url: null,
    sort_order: 1,
    is_active: true,
  });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      image_url: null,
      sort_order: categories.length + 1,
      is_active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCategory(c);
    setFormData({ ...c });
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
    data.append("folder", "pvs-ayurvedics/categories");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const json = await res.json();
      if (res.ok && json.url) {
        setFormData((prev) => ({ ...prev, image_url: json.url }));
        showToast("Category image uploaded!");
      } else {
        showToast(json.error || "Upload failed.", "error");
      }
    } catch {
      showToast("Network error uploading category image.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      showToast("Category name is required.", "error");
      return;
    }

    setSaving(true);
    try {
      const method = editingCategory ? "PUT" : "POST";
      const payload = {
        ...(editingCategory ? { id: editingCategory.id } : {}),
        ...formData,
        slug: formData.slug || slugify(formData.name),
      };

      const res = await fetch("/api/categories", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.category) {
        const saved: Category = data.category;
        if (editingCategory) {
          setCategories((prev) => prev.map((c) => (c.id === saved.id ? saved : c)));
        } else {
          setCategories((prev) => [...prev, saved]);
        }
        showToast(editingCategory ? "Category updated!" : "Category created!");
        setModalOpen(false);
      } else {
        showToast(data.error || "Failed to save category.", "error");
      }
    } catch {
      showToast("Network error saving category.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`/api/categories?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        showToast("Category deleted.");
      } else {
        showToast("Failed to delete category.", "error");
      }
    } catch {
      showToast("Network error deleting category.", "error");
    }
  };

  const handleToggleActive = async (c: Category) => {
    const updated = { ...c, is_active: !c.is_active };
    setCategories((prev) => prev.map((item) => (item.id === c.id ? updated : item)));

    try {
      await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: c.id, is_active: updated.is_active }),
      });
    } catch {
      setCategories((prev) => prev.map((item) => (item.id === c.id ? c : item)));
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
            Product Categories Management
          </h2>
          <p className="text-xs text-stone-500">
            Organize herbal medicines and wellness products into distinct classifications.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0d3b27] text-white text-xs font-semibold hover:bg-[#165b33] transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((c) => (
          <div
            key={c.id}
            className={`bg-white rounded-3xl border p-5 flex flex-col justify-between shadow-2xs transition-all ${
              c.is_active ? "border-stone-200" : "border-stone-200 opacity-60 bg-stone-50/50"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  {c.image_url ? (
                    <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                      <Image src={c.image_url} alt={c.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                      <Layers className="w-4 h-4" />
                    </div>
                  )}
                  <h3 className="font-bold text-sm text-stone-900">{c.name}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleActive(c)}
                  className={`p-1.5 rounded-lg text-xs ${
                    c.is_active ? "text-emerald-700 bg-emerald-50" : "text-stone-400 bg-stone-100"
                  }`}
                  title={c.is_active ? "Active (click to hide)" : "Hidden (click to show)"}
                >
                  {c.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>

              {c.description && (
                <p className="text-xs text-stone-500 line-clamp-2 mb-3">{c.description}</p>
              )}
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="font-mono text-stone-400 text-[11px]">/{c.slug}</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(c)}
                  className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                  title="Edit category"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(c.id)}
                  className="p-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
                  title="Delete category"
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-bold font-serif-ayur text-[#0d3b27]">
                {editingCategory ? "Edit Category" : "New Category"}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)}>
                <X className="w-5 h-5 text-stone-400 hover:text-stone-700" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Optional Category Image */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Category Icon / Image</label>
                <div className="flex items-center gap-3">
                  {formData.image_url ? (
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                      <Image src={formData.image_url} alt="Category preview" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-stone-100 border border-dashed border-stone-300 flex items-center justify-center text-stone-400">
                      <Layers className="w-5 h-5 opacity-40" />
                    </div>
                  )}
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold cursor-pointer text-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? "Uploading..." : "Upload Image"}</span>
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
                <label className="block font-bold text-stone-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hair Care, Pain Relief"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: formData.slug || slugify(e.target.value),
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Slug</label>
                <input
                  type="text"
                  required
                  value={formData.slug || ""}
                  onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl resize-none"
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
                  <span>Save Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
