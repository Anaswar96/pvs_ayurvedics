"use client";

import React, { useState } from "react";
import {
  Save,
  Check,
  Phone,
  MessageCircle,
  Mail,
  Globe,
  Sparkles,
  ExternalLink,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { SiteSettings } from "@/lib/types";
import { getWhatsAppLink } from "@/lib/utils";

interface SettingsManagerProps {
  initialSettings: SiteSettings;
}

export default function SettingsManager({ initialSettings }: SettingsManagerProps) {
  const [settings, setSettings] = useState<SiteSettings>({
    ...initialSettings,
    whatsapp_sticky_enabled:
      initialSettings.whatsapp_sticky_enabled !== undefined
        ? initialSettings.whatsapp_sticky_enabled
        : true,
    whatsapp_button_label: initialSettings.whatsapp_button_label || "Chat with Us",
    whatsapp_default_message:
      initialSettings.whatsapp_default_message ||
      "Hello PVS Ayurvedics, I would like to inquire about your Ayurvedic treatments and products.",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFieldChange = (field: keyof SiteSettings, value: unknown) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to save settings.");
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving settings";
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const previewWhatsAppUrl = getWhatsAppLink(
    settings.whatsapp_number,
    settings.whatsapp_default_message || "Hello PVS Ayurvedics"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-ayur text-[#0d3b27]">
            Clinic Contact &amp; Site Settings
          </h2>
          <p className="text-xs text-stone-500">
            Configure business identity, phone numbers, sticky WhatsApp widget, working hours, and social profiles.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleSave()}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0d3b27] text-white text-xs font-semibold hover:bg-[#165b33] transition-all shadow-sm self-start sm:self-auto disabled:opacity-60"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-emerald-300" />
              <span>Saving...</span>
            </>
          ) : savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Saved Successfully!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </>
          )}
        </button>
      </div>

      {/* Notifications */}
      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-medium animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>All site settings and WhatsApp sticky configurations have been updated and synced successfully!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-800 text-xs font-medium animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={(e) => handleSave(e)} className="space-y-6">
        {/* ========================================================================= */}
        {/* WHATSAPP STICKY WIDGET CONTROLS */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-br from-emerald-50/70 via-white to-white p-6 sm:p-8 rounded-3xl border-2 border-emerald-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-md">
                <MessageCircle className="w-6 h-6 fill-white" />
              </div>
              <div>
                <h3 className="text-base font-bold font-serif-ayur text-[#0d3b27]">
                  Sticky WhatsApp Widget (Right Corner on Every Page)
                </h3>
                <p className="text-xs text-stone-500">
                  Control the floating WhatsApp action button displayed at the bottom-right of every public page.
                </p>
              </div>
            </div>

            {/* Enable/Disable Toggle */}
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={settings.whatsapp_sticky_enabled !== false}
                onChange={(e) => handleFieldChange("whatsapp_sticky_enabled", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#25D366]"></div>
              <span className="ml-3 text-xs font-bold text-stone-700 flex items-center gap-1.5">
                {settings.whatsapp_sticky_enabled !== false ? (
                  <>
                    <Eye className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Active on Every Page</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-stone-400" />
                    <span className="text-stone-500">Hidden / Disabled</span>
                  </>
                )}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Form Fields */}
            <div className="lg:col-span-7 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    WhatsApp Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={settings.whatsapp_number}
                    onChange={(e) => handleFieldChange("whatsapp_number", e.target.value)}
                    placeholder="+919061853542"
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl font-mono text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">
                    With country code (e.g. <code>+919061853542</code> or <code>919061853542</code>).
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Button Label Text
                  </label>
                  <input
                    type="text"
                    value={settings.whatsapp_button_label || ""}
                    onChange={(e) => handleFieldChange("whatsapp_button_label", e.target.value)}
                    placeholder="Chat with Us"
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">
                    Text displayed next to the WhatsApp icon (e.g. &quot;Chat with Us&quot;).
                  </p>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Default Pre-filled Chat Message
                </label>
                <textarea
                  rows={3}
                  value={settings.whatsapp_default_message || ""}
                  onChange={(e) => handleFieldChange("whatsapp_default_message", e.target.value)}
                  placeholder="Hello PVS Ayurvedics, I would like to inquire about your Ayurvedic treatments and products."
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  When visitors tap the sticky button, this text is automatically drafted in their WhatsApp chat.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <a
                  href={previewWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100/80 hover:bg-emerald-200/80 text-[#0d3b27] rounded-xl font-bold transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Test WhatsApp Direct Link</span>
                </a>
                <span className="text-[11px] text-stone-500">
                  Opens WhatsApp web/app with your current number &amp; message.
                </span>
              </div>
            </div>

            {/* Live Interactive Preview Box */}
            <div className="lg:col-span-5 bg-stone-100/80 rounded-2xl p-4 border border-stone-200/80 text-xs">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-stone-200">
                <span className="font-bold text-stone-600 uppercase tracking-wider text-[10px]">
                  Live Website Corner Preview
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-stone-600 border border-stone-200">
                  Bottom-Right Corner
                </span>
              </div>

              {/* Simulated browser window corner */}
              <div className="relative h-44 bg-white rounded-xl border border-stone-200 overflow-hidden flex flex-col justify-between p-3.5 shadow-inner">
                {/* Mock page content lines */}
                <div className="space-y-2 opacity-30 select-none pointer-events-none">
                  <div className="w-3/4 h-2 bg-stone-400 rounded"></div>
                  <div className="w-1/2 h-2 bg-stone-300 rounded"></div>
                  <div className="w-5/6 h-2 bg-stone-300 rounded"></div>
                </div>

                {/* Simulated Sticky Button */}
                <div className="flex justify-end items-end w-full">
                  {settings.whatsapp_sticky_enabled !== false ? (
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white px-3 py-2 rounded-full shadow-lg border border-emerald-300/30 animate-pulse-subtle">
                      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                        <path d="M12.004 0C5.373 0 0 5.373 0 12c0 2.112.551 4.167 1.597 5.98L.066 23.934l6.108-1.503A11.968 11.968 0 0012.004 24C18.63 24 24 18.627 24 12c0-6.627-5.37-12-11.996-12zm0 21.956c-1.802 0-3.568-.485-5.111-1.402l-.366-.217-3.799.934.953-3.702-.238-.378a9.92 9.92 0 01-1.523-5.191c0-5.495 4.475-9.97 9.974-9.97 5.498 0 9.974 4.475 9.974 9.97 0 5.496-4.476 9.97-10.074 9.97z" />
                      </svg>
                      <span className="font-semibold text-[11px]">
                        {settings.whatsapp_button_label || "Chat with Us"}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-ping" />
                    </div>
                  ) : (
                    <div className="text-[11px] text-stone-400 italic bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-lg">
                      (Sticky WhatsApp is currently disabled)
                    </div>
                  )}
                </div>
              </div>

              <p className="text-[10px] text-stone-400 mt-2 text-center">
                This button will automatically appear in this position on every single page of the website.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CLINIC IDENTITY & TAGLINES */}
        {/* ========================================================================= */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-4 text-xs">
          <h3 className="text-base font-bold font-serif-ayur text-[#0d3b27] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>Clinic Identity &amp; Taglines</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Business Name</label>
              <input
                type="text"
                value={settings.business_name}
                onChange={(e) => handleFieldChange("business_name", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">English Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => handleFieldChange("tagline", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Malayalam Main Tagline</label>
              <input
                type="text"
                value={settings.malayalam_headline}
                onChange={(e) => handleFieldChange("malayalam_headline", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-[#0d3b27] focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Malayalam Footer Subline</label>
              <input
                type="text"
                value={settings.malayalam_tagline}
                onChange={(e) => handleFieldChange("malayalam_tagline", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* GENERAL CONTACT NUMBERS & EMAIL */}
        {/* ========================================================================= */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-4 text-xs">
          <h3 className="text-base font-bold font-serif-ayur text-[#0d3b27] flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-700" />
            <span>Clinic Phone, Email &amp; Timings</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Clinic Phone (Display)</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Support Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Clinic Working Hours</label>
              <input
                type="text"
                value={settings.working_hours}
                onChange={(e) => handleFieldChange("working_hours", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Clinic Physical Address</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => handleFieldChange("address", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* GOOGLE MAPS & SOCIAL PROFILES */}
        {/* ========================================================================= */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-4 text-xs">
          <h3 className="text-base font-bold font-serif-ayur text-[#0d3b27] flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-700" />
            <span>Maps &amp; Social Profiles</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Google Maps Directions URL</label>
              <input
                type="text"
                value={settings.google_map_directions_url}
                onChange={(e) => handleFieldChange("google_map_directions_url", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Facebook URL</label>
                <input
                  type="text"
                  value={settings.facebook_url}
                  onChange={(e) => handleFieldChange("facebook_url", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Instagram URL</label>
                <input
                  type="text"
                  value={settings.instagram_url}
                  onChange={(e) => handleFieldChange("instagram_url", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">YouTube URL</label>
                <input
                  type="text"
                  value={settings.youtube_url}
                  onChange={(e) => handleFieldChange("youtube_url", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#0d3b27] text-white text-xs font-semibold hover:bg-[#165b33] transition-all shadow-md disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-emerald-300" />
                <span>Saving All Settings...</span>
              </>
            ) : savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Settings Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
