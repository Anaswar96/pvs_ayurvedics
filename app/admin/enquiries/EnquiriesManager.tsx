"use client";

import React, { useState } from "react";
import {
  Inbox,
  Search,
  Filter,
  Phone,
  MessageCircle,
  Mail,
  Calendar,
  Clock,
  Trash2,
  CheckCircle2,
  X,
  FileText,
  Save,
} from "lucide-react";
import { Enquiry } from "@/lib/types";
import { formatDateTime, getWhatsAppLink } from "@/lib/utils";

interface EnquiriesManagerProps {
  initialEnquiries: Enquiry[];
}

export default function EnquiriesManager({ initialEnquiries }: EnquiriesManagerProps) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries);
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [internalNotes, setInternalNotes] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const statuses = ["All", "New", "Contacted", "In Progress", "Completed", "Cancelled"];

  const handleOpenDetail = (enq: Enquiry) => {
    setSelectedEnquiry(enq);
    setInternalNotes(enq.internal_notes || "");
  };

  const handleUpdateStatus = async (id: string, newStatus: Enquiry["status"]) => {
    // Update local state immediately
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
    );

    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    try {
      await fetch("/api/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch {
      // Ignored
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return;
    setSavingNote(true);

    const updatedNotes = internalNotes;
    setEnquiries((prev) =>
      prev.map((e) =>
        e.id === selectedEnquiry.id ? { ...e, internal_notes: updatedNotes } : e
      )
    );
    setSelectedEnquiry((prev) => (prev ? { ...prev, internal_notes: updatedNotes } : null));

    try {
      await fetch("/api/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedEnquiry.id, internal_notes: updatedNotes }),
      });
    } catch {
      // Ignored
    } finally {
      setSavingNote(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this enquiry?")) {
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null);

      try {
        await fetch(`/api/enquiries?id=${id}`, { method: "DELETE" });
      } catch {
        // Ignored
      }
    }
  };

  const filtered = enquiries.filter((enq) => {
    const matchStatus = selectedStatus === "All" || enq.status === selectedStatus;
    const matchSearch =
      !searchQuery ||
      enq.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enq.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (enq.email && enq.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (enq.product_interest && enq.product_interest.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-ayur text-[#0d3b27]">
            Consultation Enquiries &amp; Orders CRM
          </h2>
          <p className="text-xs text-stone-500">
            Track patient consultations, inquiries, follow-up notes, and instant WhatsApp replies.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 font-bold">
            {enquiries.filter((e) => e.status === "New").length} New Requests
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-stone-200 text-stone-700 font-bold">
            {enquiries.length} Total
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search by customer name, phone, or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0d3b27]"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none">
            {statuses.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedStatus === st
                    ? "bg-[#0d3b27] text-white"
                    : "bg-stone-50 text-stone-600 hover:bg-stone-100"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-stone-400 text-xs">
            No enquiries found under &ldquo;{selectedStatus}&rdquo;.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-100">
                <tr>
                  <th className="py-3 px-4">Patient / Customer</th>
                  <th className="py-3 px-4">Phone Number</th>
                  <th className="py-3 px-4">Interest</th>
                  <th className="py-3 px-4">Preferred Slot</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((enq) => (
                  <tr
                    key={enq.id}
                    onClick={() => handleOpenDetail(enq)}
                    className="hover:bg-emerald-50/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-stone-900">
                      {enq.full_name}
                      {enq.status === "New" && (
                        <span className="ml-2 w-2 h-2 rounded-full bg-amber-500 inline-block animate-pulse" />
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-stone-600">
                      {enq.phone}
                    </td>

                    <td className="py-3.5 px-4 text-stone-700 font-medium max-w-xs truncate">
                      {enq.product_interest || "General Consultation"}
                    </td>

                    <td className="py-3.5 px-4 text-stone-500">
                      {enq.preferred_date ? `${enq.preferred_date}` : "Flexible"}
                    </td>

                    <td className="py-3.5 px-4 text-stone-400 text-[11px]">
                      {formatDateTime(enq.created_at)}
                    </td>

                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={enq.status}
                        onChange={(e) =>
                          handleUpdateStatus(enq.id, e.target.value as Enquiry["status"])
                        }
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border-0 focus:ring-1 focus:ring-[#0d3b27] ${
                          enq.status === "New"
                            ? "bg-amber-100 text-amber-900"
                            : enq.status === "Contacted"
                            ? "bg-blue-100 text-blue-900"
                            : enq.status === "In Progress"
                            ? "bg-purple-100 text-purple-900"
                            : enq.status === "Completed"
                            ? "bg-emerald-100 text-emerald-900"
                            : "bg-stone-200 text-stone-700"
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center gap-1">
                        <a
                          href={getWhatsAppLink(
                            enq.phone,
                            `Hello ${enq.full_name}, this is from PVS Ayurvedics Manjeri regarding your consultation enquiry for ${enq.product_interest || "Ayurvedic wellness"}.`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                          title="Reply on WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`tel:${enq.phone}`}
                          className="p-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200"
                          title="Call Customer"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDelete(enq.id)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
                          title="Delete Enquiry"
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
        )}
      </div>

      {/* Detailed Enquiry Modal / Drawer */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-emerald-800 uppercase">
                  Enquiry Details
                </span>
                <h3 className="text-xl font-bold font-serif-ayur text-[#0d3b27]">
                  {selectedEnquiry.full_name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="p-2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-stone-400 font-bold uppercase text-[10px]">Phone</p>
                <p className="font-mono text-stone-800 font-bold mt-0.5">{selectedEnquiry.phone}</p>
              </div>

              <div>
                <p className="text-stone-400 font-bold uppercase text-[10px]">Email</p>
                <p className="text-stone-800 mt-0.5">{selectedEnquiry.email || "—"}</p>
              </div>

              <div>
                <p className="text-stone-400 font-bold uppercase text-[10px]">Requested Product / Service</p>
                <p className="font-bold text-emerald-900 mt-0.5">{selectedEnquiry.product_interest}</p>
              </div>

              <div>
                <p className="text-stone-400 font-bold uppercase text-[10px]">Preferred Slot</p>
                <p className="text-stone-800 mt-0.5">
                  {selectedEnquiry.preferred_date ? `${selectedEnquiry.preferred_date} ` : ""}
                  {selectedEnquiry.preferred_time || ""}
                </p>
              </div>
            </div>

            {/* Patient Message */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1">
              <p className="text-stone-400 font-bold uppercase text-[10px]">Message / Health Concern:</p>
              <p className="text-stone-700 leading-relaxed italic">&ldquo;{selectedEnquiry.message}&rdquo;</p>
            </div>

            {/* Internal Clinic Notes */}
            <div className="space-y-2 text-xs">
              <label className="block font-bold text-stone-700">Internal Clinic Notes (Staff only):</label>
              <textarea
                rows={3}
                placeholder="Add medical follow-up notes, physician remarks, or appointment confirmation details..."
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#0d3b27] focus:bg-white resize-none"
              />
              <button
                type="button"
                disabled={savingNote}
                onClick={handleSaveNotes}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 text-white text-xs font-semibold hover:bg-stone-900"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingNote ? "Saving..." : "Save Notes"}</span>
              </button>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <a
                  href={getWhatsAppLink(
                    selectedEnquiry.phone,
                    `Hello ${selectedEnquiry.full_name}, this is from PVS Ayurvedics Manjeri regarding your consultation enquiry.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] text-white font-bold hover:bg-[#20bd5a]"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Reply on WhatsApp</span>
                </a>

                <a
                  href={`tel:${selectedEnquiry.phone}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0d3b27] text-white font-semibold hover:bg-[#165b33]"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(selectedEnquiry.id)}
                className="text-red-600 hover:underline text-xs"
              >
                Delete Enquiry
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
