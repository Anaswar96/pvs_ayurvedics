import React from "react";
import SettingsManager from "./SettingsManager";
import { getSiteSettings } from "@/lib/supabase/queries";

export const metadata = {
  title: "Site Settings & Contact Info | Admin | PVS Ayurvedics",
};

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();
  return <SettingsManager initialSettings={settings} />;
}
