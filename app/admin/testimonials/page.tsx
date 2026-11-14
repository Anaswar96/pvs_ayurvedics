import React from "react";
import TestimonialsManager from "./TestimonialsManager";
import { getAllTestimonialsAdmin } from "@/lib/supabase/queries";

export const metadata = {
  title: "Testimonials Management | Admin | PVS Ayurvedics",
};

export default async function AdminTestimonialsPage() {
  const testimonials = await getAllTestimonialsAdmin();
  return <TestimonialsManager initialTestimonials={testimonials} />;
}
