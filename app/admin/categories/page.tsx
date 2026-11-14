import React from "react";
import CategoriesManager from "./CategoriesManager";
import { getAllCategories } from "@/lib/supabase/queries";

export const metadata = {
  title: "Categories Management | Admin | PVS Ayurvedics",
};

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();
  return <CategoriesManager initialCategories={categories} />;
}
