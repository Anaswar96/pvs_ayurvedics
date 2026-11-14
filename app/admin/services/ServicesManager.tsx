"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, X, Stethoscope, Sparkles, Package, Users, CheckCircle2, Eye, EyeOff } from "lucide-react";
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

  const [formData, setFormData] = useState<Partial<Service>>({
    title: "",
    slug: "",
    short_description: "",
    full_description: "",
    icon_name: "Stethoscope",
    benefits: [],
    sort_order: 1,
    is_published: true,
  });

  const handleOpenCreate = () => {
    setEditingService(null);
    setFormData({
      title: "",
      slug: "",
      short_description: "",
      full_description: "",
      icon_name: "Stethoscope",
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.short_description) return;

    if (editingService) {
      setServices((prev) =>
        prev.map((s) => (s.id === editingService.id ? ({ ...s, ...formData } as Service) : s))
      );
    } else {
      const newSrv: Service = {
        id: `srv_${Date.now()}`,
        title: formData.title!,
        slug: formData.slug || slugify(formData.title!),
        short_description: formData.short_description!,
        full_description: formData.full_description || null,
        icon_name: formData.icon_name || "Stethoscope",
        image_url: null,
        benefits: formData.benefits || [],
        sort_order: formData.sort_order || services.length + 1,
        is_published: formData.is_published !== undefined ? formData.is_published : true,
      };
      setServices([...services, newSrv]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this clinic service?")) {
      setServices((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleTogglePublish = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_published: !s.is_published } : s))
    );
  };

  return (
    <div className="space-y-6">
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
          <span>Add Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((srv) => (
          <div key={srv.id} className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <button
                  type="button"
                  onClick={() => handleTogglePublish(srv.id)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    srv.is_published ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-500"
                  }`}
                >
                  {srv.is_published ? "Published" : "Draft"}
                </button>
              </div>

              <h3 className="text-lg font-bold font-serif-ayur text-[#0d3b27]">
                {srv.title}
              </h3>
              <p className="text-xs text-stone-500 mt-1">{srv.short_description}</p>

              {srv.benefits && srv.benefits.length > 0 && (
                <div className="pt-3 border-t border-stone-100 mt-3 space-y-1">
                  {srv.benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-stone-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
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
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(srv.id)}
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
                {editingService ? "Edit Service" : "New Service"}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
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
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono"
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
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={formData.full_description || ""}
                  onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl resize-none"
                />
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
                    className="flex-1 px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={handleAddBenefit}
                    className="px-4 py-2 bg-[#0d3b27] text-white rounded-xl font-semibold"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formData.benefits?.map((b, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-900 rounded-full text-[11px]"
                    >
                      <span>{b}</span>
                      <button type="button" onClick={() => handleRemoveBenefit(idx)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
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
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
