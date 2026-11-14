"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, X, Stethoscope, Sparkles, Package, Users, CheckCircle2, Eye, EyeOff, Upload, Loader2, AlertCircle } from "lucide-react";
import { Service } from "@/lib/types";
import { slugify } from "@/lib/utils";

interface ServicesManagerProps {
  initialServices: Service[];
}

export default function ServicesManager({ initialServices }: ServicesManagerProps) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [benefitInput, setBenefitInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [formData, setFormData] = useState<Partial<Service>>({
    title: "",
    slug: "",
    short_description: "",
    full_description: "",
    icon_name: "Stethoscope",
    image_url: null,
    benefits: [],
    sort_order: 1,
    is_published: true,
  });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleOpenCreate = () => {
    setEditingService(null);
    setFormData({
      title: "",
      slug: "",
      short_description: "",
      full_description: "",
      icon_name: "Stethoscope",
      image_url: null,
      benefits: [],
      sort_order: services.length + 1,
      is_published: true,
    });
    setBenefitInput("");
    setModalOpen(true);
  };

  const handleOpenEdit = (srv: Service) => {
    setEditingService(srv);
    setFormData({ ...srv });
    setBenefitInput("");
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file.", "error");
      return;
    }

    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("folder", "pvs-ayurvedics/services");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const json = await res.json();
      if (res.ok && json.url) {
        setFormData((prev) => ({ ...prev, image_url: json.url }));
        showToast("Service image uploaded successfully!");
      } else {
        showToast(json.error || "Upload failed.", "error");
      }
    } catch {
      showToast("Network error uploading image.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleAddBenefit = () => {
    if (benefitInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        benefits: [...(prev.benefits || []), benefitInput.trim()],
      }));
      setBenefitInput("");
    }
  };

  const handleRemoveBenefit = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits?.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.short_description) {
      showToast("Title and short description are required.", "error");
      return;
    }

    setSaving(true);
    try {
      const method = editingService ? "PUT" : "POST";
      const payload = {
        ...(editingService ? { id: editingService.id } : {}),
        ...formData,
        slug: formData.slug || slugify(formData.title),
      };

      const res = await fetch("/api/services", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.service) {
        const saved: Service = data.service;
        if (editingService) {
          setServices((prev) => prev.map((s) => (s.id === saved.id ? saved : s)));
        } else {
          setServices((prev) => [...prev, saved]);
        }
        showToast(editingService ? "Service updated!" : "Service created!");
        setModalOpen(false);
      } else {
        showToast(data.error || "Failed to save service.", "error");
      }
    } catch {
      showToast("Network error saving service.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this treatment service?")) return;

    try {
      const res = await fetch(`/api/services?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== id));
        showToast("Service deleted.");
      } else {
        showToast("Failed to delete service.", "error");
      }
    } catch {
      showToast("Network error deleting service.", "error");
    }
  };

  const handleTogglePublish = async (srv: Service) => {
    const updated = { ...srv, is_published: !srv.is_published };
    setServices((prev) => prev.map((s) => (s.id === srv.id ? updated : s)));

    try {
      await fetch("/api/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: srv.id, is_published: updated.is_published }),
      });
    } catch {
      // Revert if error
      setServices((prev) => prev.map((s) => (s.id === srv.id ? srv : s)));
      showToast("Error updating visibility.", "error");
    }
  };

  const getServiceIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case "sparkles":
        return <Sparkles className="w-5 h-5 text-emerald-800" />;
      case "package":
        return <Package className="w-5 h-5 text-emerald-800" />;
      case "users":
        return <Users className="w-5 h-5 text-emerald-800" />;
      case "stethoscope":
      default:
        return <Stethoscope className="w-5 h-5 text-emerald-800" />;
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
            Services &amp; Therapies Management
          </h2>
          <p className="text-xs text-stone-500">
            Control clinic consultation offerings, wellness plans, and specialized therapies.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0d3b27] text-white text-xs font-semibold hover:bg-[#165b33] transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((srv) => (
          <div
            key={srv.id}
            className={`bg-white rounded-3xl border p-5 flex flex-col justify-between shadow-2xs transition-all ${
              srv.is_published ? "border-stone-200" : "border-stone-200 opacity-60 bg-stone-50/50"
            }`}
          >
            <div>
              {/* Image Preview or Icon */}
              {srv.image_url ? (
                <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 mb-3">
                  <Image src={srv.image_url} alt={srv.title} fill className="object-cover" />
                </div>
              ) : (
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800">
                    {getServiceIcon(srv.icon_name)}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="font-bold text-sm font-serif-ayur text-stone-900 line-clamp-1">
                  {srv.title}
                </h3>
                <button
                  type="button"
                  onClick={() => handleTogglePublish(srv)}
                  className={`p-1.5 rounded-lg text-xs ${
                    srv.is_published ? "text-emerald-700 bg-emerald-50" : "text-stone-400 bg-stone-100"
                  }`}
                  title={srv.is_published ? "Published (click to hide)" : "Hidden (click to publish)"}
                >
                  {srv.is_published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>

              <p className="text-xs text-stone-500 line-clamp-2 mb-3">
                {srv.short_description}
              </p>

              {srv.benefits && srv.benefits.length > 0 && (
                <div className="space-y-1 mb-3">
                  {srv.benefits.slice(0, 3).map((b, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-stone-600">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                      <span className="truncate">{b}</span>
                    </div>
                  ))}
                  {srv.benefits.length > 3 && (
                    <span className="text-[10px] text-stone-400">+{srv.benefits.length - 3} more</span>
                  )}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="font-mono text-stone-400 text-[11px]">/{srv.slug}</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(srv)}
                  className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                  title="Edit service"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(srv.id)}
                  className="p-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
                  title="Delete service"
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
                {editingService ? "Edit Service" : "New Service"}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)}>
                <X className="w-5 h-5 text-stone-400 hover:text-stone-700" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Treatment Image Upload */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Treatment Image (Photo / Illustration)</label>
                <div className="flex items-center gap-3">
                  {formData.image_url ? (
                    <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                      <Image src={formData.image_url} alt="Service preview" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-20 h-14 rounded-xl bg-stone-100 border border-dashed border-stone-300 flex items-center justify-center text-stone-400">
                      <Upload className="w-5 h-5 opacity-40" />
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
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
                    {formData.image_url && (
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, image_url: null }))}
                        className="block text-[11px] text-red-600 hover:underline"
                      >
                        Remove image
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ayurvedic Consultation"
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                      slug: formData.slug || slugify(e.target.value),
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0d3b27]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">URL Slug</label>
                <input
                  type="text"
                  required
                  value={formData.slug || ""}
                  onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-xs focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Short Description *</label>
                <input
                  type="text"
                  required
                  placeholder="Personalized guidance for your health concerns"
                  value={formData.short_description || ""}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Full Description</label>
                <textarea
                  rows={3}
                  placeholder="Detailed consultation guidelines, treatment process..."
                  value={formData.full_description || ""}
                  onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl resize-none focus:bg-white focus:outline-none"
                />
              </div>

              {/* Icon selector */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Icon Style</label>
                <select
                  value={formData.icon_name || "Stethoscope"}
                  onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800"
                >
                  <option value="Stethoscope">Stethoscope (Doctor / Diagnosis)</option>
                  <option value="Sparkles">Sparkles (Rejuvenation / Wellness)</option>
                  <option value="Package">Package (Formulations &amp; Medicines)</option>
                  <option value="Users">Users (Family / Community Follow-up)</option>
                </select>
              </div>

              {/* Benefits tag list */}
              <div className="space-y-2">
                <label className="block font-bold text-stone-700">What to Expect / Benefits</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add benefit item..."
                    value={benefitInput}
                    onChange={(e) => setBenefitInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddBenefit();
                      }
                    }}
                    className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={handleAddBenefit}
                    className="px-4 py-2 bg-[#0d3b27] text-white rounded-xl hover:bg-[#165b33]"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formData.benefits?.map((b, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-full text-[11px]"
                    >
                      <span>{b}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveBenefit(i)}
                        className="hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Visibility and Sort Order */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.sort_order ?? 1}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Publish Status</label>
                  <select
                    value={formData.is_published ? "true" : "false"}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.value === "true" })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-800"
                  >
                    <option value="true">Published</option>
                    <option value="false">Hidden / Draft</option>
                  </select>
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
                  <span>Save Service</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
