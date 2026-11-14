import React from "react";
import AnnouncementsManager from "./AnnouncementsManager";
import { getAllAnnouncementsAdmin } from "@/lib/supabase/queries";

export const metadata = {
  title: "Announcement Bar | Admin | PVS Ayurvedics",
};

export default async function AdminAnnouncementsPage() {
  const announcements = await getAllAnnouncementsAdmin();
  return <AnnouncementsManager initialAnnouncements={announcements} />;
}
