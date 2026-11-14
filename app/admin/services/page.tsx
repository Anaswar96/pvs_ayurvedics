import React from "react";
import ServicesManager from "./ServicesManager";
import { getAllServicesAdmin } from "@/lib/supabase/queries";

export const metadata = {
  title: "Services Management | Admin | PVS Ayurvedics",
};

export default async function AdminServicesPage() {
  const services = await getAllServicesAdmin();
  return <ServicesManager initialServices={services} />;
}
