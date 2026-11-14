import React from "react";
import ContentManager from "./ContentManager";
import { getAllWebsiteSections, getTrustPoints } from "@/lib/supabase/queries";

export const metadata = {
  title: "Website Content & Sections | Admin | PVS Ayurvedics",
};

export default async function AdminContentPage() {
  const [sections, trustPoints] = await Promise.all([
    getAllWebsiteSections(),
    getTrustPoints(),
  ]);

  return <ContentManager initialSections={sections} initialTrustPoints={trustPoints} />;
}
