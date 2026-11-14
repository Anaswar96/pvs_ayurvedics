"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Product, Service } from "@/lib/types";

interface EnquirySectionProps {
  products?: Product[];
  services?: Service[];
  defaultProductInterest?: string;
  isStandalonePage?: boolean;
}

export default function EnquirySection({
  products = [],
  services = [],
  defaultProductInterest = "",
  isStandalonePage = false,
}: EnquirySectionProps) {
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    product_interest: defaultProductInterest || "General Ayurvedic Consultation",
    preferred_date: "",
    preferred_time: "Morning (9:30 AM - 1:00 PM)",
    message: "",
    consent: true,
    website_url_hp: "", // Honeypot field
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setError("Please fill in all required fields (Name, Phone, and Message).");
      return;
    }

    if (!formData.consent) {
      setError("Please accept the privacy consent to proceed.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && (data.success || data.enquiry)) {
        setSuccess(true);
      } else {
        setError(data.error || "Failed to submit enquiry. Please try again.");
      }
    } catch {
      setError("Network error. Please try again or chat with us on WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`ayur-card p-6 sm:p-8 bg-white ${isStandalonePage ? "shadow-xl border-emerald-900/10" : ""}`}>
      <div className="mb-6">
        <span className="text-[10px] font-bold tracking-widest text-emerald-800 uppercase block mb-1">
          Consultation &amp; Orders
        </span>
        <h3 className="text-xl sm:text-2xl font-bold font-serif-ayur text-[#0d3b27]">
          Send Us an Enquiry
        </h3>
        <p className="text-xs text-stone-500 mt-1">
          We&apos;ll get back to you soon.
        </p>
      </div>

      {success ? (
        <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold font-serif-ayur text-[#0d3b27]">
            Enquiry Received!
          </h4>
          <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
            Thank you for reaching out to PVS Ayurvedics. Our Ayurvedic team in Manjeri will contact you shortly to confirm your consultation or product enquiry.
          </p>
          <button
            type="button"
            onClick={() => {
              setSuccess(false);
              setFormData({
                full_name: "",
                phone: "",
                email: "",
                product_interest: "General Ayurvedic Consultation",
                preferred_date: "",
                preferred_time: "Morning (9:30 AM - 1:00 PM)",
                message: "",
                consent: true,
                website_url_hp: "",
              });
            }}
            className="px-5 py-2 rounded-full border border-emerald-800 text-[#0d3b27] text-xs font-semibold hover:bg-emerald-50 transition-colors"
          >
            Send Another Enquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot for spam bot prevention */}
          <input
            type="text"
            name="website_url_hp"
            value={formData.website_url_hp}
            onChange={(e) => setFormData({ ...formData, website_url_hp: e.target.value })}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1 uppercase tracking-wider">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Nair"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0d3b27] focus:bg-white transition-all"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1 uppercase tracking-wider">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98470 12345"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0d3b27] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Email Address */}
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1 uppercase tracking-wider">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="rahul@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0d3b27] focus:bg-white transition-all"
              />
            </div>

            {/* Product / Consultation Interest */}
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1 uppercase tracking-wider">
                Product / Service Interested In
              </label>
              <select
                value={formData.product_interest}
                onChange={(e) => setFormData({ ...formData, product_interest: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0d3b27] focus:bg-white transition-all text-stone-700"
              >
                <optgroup label="Consultations &amp; Treatments">
                  <option value="General Ayurvedic Consultation">General Ayurvedic Consultation</option>
                  <option value="Panchakarma &amp; Rejuvenation">Panchakarma &amp; Rejuvenation</option>
                  <option value="Lifestyle &amp; Diet Guidance">Lifestyle &amp; Diet Guidance</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.title}>{s.title}</option>
                  ))}
                </optgroup>
                <optgroup label="Ayurvedic Products">
                  {products.map((p) => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          {/* Date & Time Slot (For Consultations) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1 uppercase tracking-wider">
                Preferred Date (Optional)
              </label>
              <input
                type="date"
                value={formData.preferred_date}
                onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0d3b27] focus:bg-white transition-all text-stone-700"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1 uppercase tracking-wider">
                Preferred Time Slot
              </label>
              <select
                value={formData.preferred_time}
                onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0d3b27] focus:bg-white transition-all text-stone-700"
              >
                <option value="Morning (9:30 AM - 1:00 PM)">Morning (9:30 AM - 1:00 PM)</option>
                <option value="Afternoon (2:00 PM - 4:30 PM)">Afternoon (2:00 PM - 4:30 PM)</option>
                <option value="Evening (5:00 PM - 7:00 PM)">Evening (5:00 PM - 7:00 PM)</option>
              </select>
            </div>
          </div>

          {/* Message / Details */}
          <div>
            <label className="block text-[11px] font-bold text-stone-700 mb-1 uppercase tracking-wider">
              Message / Health Concern *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe your health requirement or specific product questions..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0d3b27] focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Consent Checkbox */}
          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="consent"
              checked={formData.consent}
              onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
              className="mt-0.5 rounded text-emerald-800 focus:ring-emerald-700 border-stone-300"
            />
            <label htmlFor="consent" className="text-[11px] text-stone-500 leading-snug">
              I agree to allow PVS Ayurvedics to contact me regarding this enquiry. Your details will be used only to respond to your enquiry.
            </label>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#0d3b27] text-white text-xs font-semibold hover:bg-[#165b33] transition-all duration-200 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting Enquiry...</span>
              </>
            ) : (
              <>
                <span>Submit Enquiry</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
