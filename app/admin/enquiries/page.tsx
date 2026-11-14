import React from "react";
import EnquiriesManager from "./EnquiriesManager";
import { getEnquiries } from "@/lib/supabase/queries";

export const metadata = {
  title: "Consultation & Enquiries CRM | Admin | PVS Ayurvedics",
};

export default async function AdminEnquiriesPage() {
  const enquiries = await getEnquiries();
  return <EnquiriesManager initialEnquiries={enquiries} />;
}
