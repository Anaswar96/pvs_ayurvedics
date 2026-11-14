"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, X, Megaphone, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Announcement } from "@/lib/types";

interface AnnouncementsManagerProps {
  initialAnnouncements: Announcement[];
}

export default function AnnouncementsManager({ initialAnnouncements }: AnnouncementsManagerProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [formData, setFormData] = useState<Partial<Announcement>>({
    text: "",
    link_url: "",
    bg_color: "#0d3b27",
    text_color: "#ffffff",
    priority: 1,
    is_active: true,
  });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleOpenCreate = () => {
    setEditingAnnouncement(null);
    setFormData({
      text: "",
      link_url: "",
      bg_color: "#0d3b27",
      text_color: "#ffffff",
      priority: announcements.length + 1,
      is_active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (a: Announcement) => {
    setEditingAnnouncement(a);
    setFormData({ ...a });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.text) {
      showToast("Announcement message text is required.", "error");
      return;
    }

    setSaving(true);
    try {
      const method = editingAnnouncement ? "PUT" : "POST";
      const payload = {
        ...(editingAnnouncement ? { id: editingAnnouncement.id } : {}),
        ...formData,
      };

      const res = await fetch("/api/announcements", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.announcement) {
        const saved: Announcement = data.announcement;
        if (editingAnnouncement) {
          setAnnouncements((prev) => prev.map((a) => (a.id === saved.id ? saved : a)));
        } else {
          setAnnouncements((prev) => [...prev, saved]);
        }
        showToast(editingAnnouncement ? "Announcement updated!" : "Announcement created!");
        setModalOpen(false);
      } else {
        showToast(data.error || "Failed to save announcement.", "error");
      }
    } catch {
      showToast("Network error saving announcement.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;

    try {
      const res = await fetch(`/api/announcements?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (res.ok) {
        setAnnouncements((prev) => prev.filter((a) => a.id !== id));
        showToast("Announcement deleted.");
      } else {
        showToast("Failed to delete announcement.", "error");
      }
    } catch {
      showToast("Network error deleting announcement.", "error");
    }
  };

  const handleToggleActive = async (a: Announcement) => {
    const updated = { ...a, is_active: !a.is_active };
    setAnnouncements((prev) => prev.map((item) => (item.id === a.id ? updated : item)));

    try {
      await fetch("/api/announcements", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: a.id, is_active: updated.is_active }),
      });
    } catch {
      setAnnouncements((prev) => prev.map((item) => (item.id === a.id ? a : item)));
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
            Top Announcement Bar Alerts
          </h2>
          <p className="text-xs text-stone-500">
            Control the top banner message shown to every website visitor.
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

      <div className="space-y-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className={`bg-white rounded-2xl border p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
              ann.is_active ? "border-stone-200" : "border-stone-200 opacity-60 bg-stone-50/50"
            }`}
          >
            <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold"
                style={{ backgroundColor: ann.bg_color || "#0d3b27" }}
              >
                <Megaphone className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border"
                    style={{
                      backgroundColor: ann.bg_color,
                      color: ann.text_color,
                      borderColor: "rgba(0,0,0,0.1)",
                    }}
                  >
                    Preview Badge
                  </span>
                  {ann.is_active ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Live on Site
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-md">
                      Disabled
                    </span>
                  )}
                </div>
                <p className="text-xs font-medium text-stone-800 truncate">{ann.text}</p>
                {ann.link_url && (
                  <p className="text-[11px] text-stone-400 font-mono truncate">Link: {ann.link_url}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => handleToggleActive(ann)}
                className={`p-2 rounded-xl text-xs flex items-center gap-1.5 ${
                  ann.is_active ? "text-emerald-800 bg-emerald-50 hover:bg-emerald-100" : "text-stone-500 bg-stone-100 hover:bg-stone-200"
                }`}
                title={ann.is_active ? "Disable announcement" : "Enable announcement"}
              >
                {ann.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span className="text-[11px] font-semibold hidden md:inline">
                  {ann.is_active ? "Active" : "Inactive"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenEdit(ann)}
                className="p-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                title="Edit announcement"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleDelete(ann.id)}
                className="p-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100"
                title="Delete announcement"
              >
                <Trash2 className="w-4 h-4" />
              </button>
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
                {editingAnnouncement ? "Edit Announcement" : "New Announcement"}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)}>
                <X className="w-5 h-5 text-stone-400 hover:text-stone-700" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Message Text *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. 🌿 Special Ayurvedic Doctor Consultation every Saturday | WhatsApp us to reserve your slot"
                  value={formData.text || ""}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Destination URL (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. /enquiry or https://..."
                  value={formData.link_url || ""}
                  onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Banner Background Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.bg_color || "#0d3b27"}
                      onChange={(e) => setFormData({ ...formData, bg_color: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-stone-300"
                    />
                    <input
                      type="text"
                      value={formData.bg_color || "#0d3b27"}
                      onChange={(e) => setFormData({ ...formData, bg_color: e.target.value })}
                      className="w-full px-2 py-1.5 bg-stone-50 border border-stone-200 rounded-lg font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Text Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.text_color || "#ffffff"}
                      onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-stone-300"
                    />
                    <input
                      type="text"
                      value={formData.text_color || "#ffffff"}
                      onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                      className="w-full px-2 py-1.5 bg-stone-50 border border-stone-200 rounded-lg font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Live Banner Preview</label>
                <div
                  className="p-3 rounded-xl text-center text-xs font-medium"
                  style={{ backgroundColor: formData.bg_color || "#0d3b27", color: formData.text_color || "#ffffff" }}
                >
                  {formData.text || "Your announcement message will display here."}
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
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#0d3b27] text-white font-semibold hover:bg-[#165b33] disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Announcement</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
