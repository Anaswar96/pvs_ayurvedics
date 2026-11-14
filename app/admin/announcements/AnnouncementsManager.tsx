"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, X, Megaphone } from "lucide-react";
import { Announcement } from "@/lib/types";

interface AnnouncementsManagerProps {
  initialAnnouncements: Announcement[];
}

export default function AnnouncementsManager({
  initialAnnouncements,
}: AnnouncementsManagerProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState<Partial<Announcement>>({
    text: "",
    link_url: "/enquiry",
    bg_color: "#0d3b27",
    text_color: "#ffffff",
    priority: 1,
    is_active: true,
  });

  const handleOpenCreate = () => {
    setEditingAnnouncement(null);
    setFormData({
      text: "",
      link_url: "/enquiry",
      bg_color: "#0d3b27",
      text_color: "#ffffff",
      priority: 1,
      is_active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (ann: Announcement) => {
    setEditingAnnouncement(ann);
    setFormData({ ...ann });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.text) return;

    if (editingAnnouncement) {
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === editingAnnouncement.id ? ({ ...a, ...formData } as Announcement) : a))
      );
    } else {
      const newAnn: Announcement = {
        id: `ann_${Date.now()}`,
        text: formData.text!,
        link_url: formData.link_url || null,
        bg_color: formData.bg_color || "#0d3b27",
        text_color: formData.text_color || "#ffffff",
        priority: formData.priority || 1,
        start_date: null,
        end_date: null,
        is_active: formData.is_active !== undefined ? formData.is_active : true,
      };
      setAnnouncements([...announcements, newAnn]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this announcement?")) {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleToggleActive = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, is_active: !a.is_active } : a))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-ayur text-[#0d3b27]">
            Top Announcement Bar
          </h2>
          <p className="text-xs text-stone-500">
            Publish site-wide alerts, doctor visiting hours, or festive wellness discounts.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0d3b27] text-white text-xs font-semibold hover:bg-[#165b33] transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Announcement</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-100">
            <tr>
              <th className="py-3 px-4">Announcement Preview</th>
              <th className="py-3 px-4">Link URL</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {announcements.map((ann) => (
              <tr key={ann.id} className="hover:bg-stone-50/70 transition-colors">
                <td className="py-3.5 px-4">
                  <div
                    className="py-1.5 px-3 rounded-lg text-xs font-medium inline-block max-w-lg truncate"
                    style={{
                      backgroundColor: ann.bg_color || "#0d3b27",
                      color: ann.text_color || "#ffffff",
                    }}
                  >
                    {ann.text}
                  </div>
                </td>
                <td className="py-3.5 px-4 font-mono text-stone-500 text-[11px]">
                  {ann.link_url || "—"}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(ann.id)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      ann.is_active ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-500"
                    }`}
                  >
                    {ann.is_active ? "Active" : "Disabled"}
                  </button>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(ann)}
                      className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(ann.id)}
                      className="p-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-bold font-serif-ayur text-[#0d3b27]">
                {editingAnnouncement ? "Edit Announcement" : "Create Announcement"}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Message Text *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="🌿 Natural Care for a Healthier Tomorrow | Consultation available at Manjeri Clinic..."
                  value={formData.text || ""}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Click Action URL</label>
                <input
                  type="text"
                  placeholder="/enquiry"
                  value={formData.link_url || ""}
                  onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Background Color</label>
                  <input
                    type="color"
                    value={formData.bg_color || "#0d3b27"}
                    onChange={(e) => setFormData({ ...formData, bg_color: e.target.value })}
                    className="w-full h-10 rounded-xl cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Text Color</label>
                  <input
                    type="color"
                    value={formData.text_color || "#ffffff"}
                    onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                    className="w-full h-10 rounded-xl cursor-pointer"
                  />
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
                  Save Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
