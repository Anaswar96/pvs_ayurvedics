import React from "react";
import AdminClientLayout from "./AdminClientLayout";
import { getEnquiries } from "@/lib/supabase/queries";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const enquiries = await getEnquiries();
  const newCount = enquiries.filter((e) => e.status === "New").length;

  return (
    <AdminClientLayout newEnquiriesCount={newCount}>
      {children}
    </AdminClientLayout>
  );
}
