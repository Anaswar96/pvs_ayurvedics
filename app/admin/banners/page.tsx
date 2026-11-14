import React from "react";
import BannersManager from "./BannersManager";
import { getAllBannersAdmin } from "@/lib/supabase/queries";

export const metadata = {
  title: "Banners & Highlights | Admin | PVS Ayurvedics",
};

export default async function AdminBannersPage() {
  const banners = await getAllBannersAdmin();
  return <BannersManager initialBanners={banners} />;
}
