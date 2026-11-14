import React from "react";
import Header from "@/components/public/Header";
import AnnouncementBar from "@/components/public/AnnouncementBar";
import Footer from "@/components/public/Footer";
import FloatingWhatsApp from "@/components/public/FloatingWhatsApp";
import { getSiteSettings, getAnnouncements, getNavigationItems } from "@/lib/supabase/queries";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, announcements, navigationItems] = await Promise.all([
    getSiteSettings(),
    getAnnouncements(),
    getNavigationItems(),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-ayur-cream">
      {/* Dynamic Announcement Bar */}
      <AnnouncementBar announcements={announcements} />

      {/* Main Header & Navbar */}
      <Header settings={settings} navigationItems={navigationItems} />

      {/* Page Content */}
      <main className="flex-1">{children}</main>

      {/* Floating WhatsApp Action Button (Sticky on right corner of every page) */}
      <FloatingWhatsApp
        phoneNumber={settings.whatsapp_number}
        message={settings.whatsapp_default_message || "Hello PVS Ayurvedics, I would like to inquire about your Ayurvedic treatments and products."}
        buttonLabel={settings.whatsapp_button_label || "Chat with Us"}
        enabled={settings.whatsapp_sticky_enabled !== false}
      />

      {/* Footer */}
      <Footer settings={settings} />
    </div>
  );
}
