import React from "react";
import ProductsManager from "./ProductsManager";
import { getAllProductsAdmin, getAllCategories } from "@/lib/supabase/queries";

export const metadata = {
  title: "Product Inventory & Formulations | Admin | PVS Ayurvedics",
};

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getAllProductsAdmin(),
    getAllCategories(),
  ]);

  return <ProductsManager initialProducts={products} categories={categories} />;
}
