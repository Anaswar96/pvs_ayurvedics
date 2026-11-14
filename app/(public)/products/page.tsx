import React from "react";
import Link from "next/link";
import ProductCard from "@/components/public/ProductCard";
import { getProducts, getCategories, getSiteSettings } from "@/lib/supabase/queries";
import { Search, Filter } from "lucide-react";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
  }>;
}

export const metadata = {
  title: "Products Catalogue | PVS Ayurvedics - Natural Kerala Formulations",
  description:
    "Explore our complete range of authentic Ayurvedic oils, herbal capsules, digestive tonics, and natural skincare crafted in Manjeri, Kerala.",
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category = "all", search = "", sort = "default" } = await searchParams;

  const [categories, settings, rawProducts] = await Promise.all([
    getCategories(),
    getSiteSettings(),
    getProducts({
      categorySlug: category !== "all" ? category : undefined,
      search: search || undefined,
    }),
  ]);

  let products = [...rawProducts];
  if (sort === "name-asc") {
    products.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "name-desc") {
    products.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sort === "price-asc") {
    products.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sort === "price-desc") {
    products.sort((a, b) => (b.price || 0) - (a.price || 0));
  }

  const currentCategory = categories.find((c) => c.slug === category);

  return (
    <div className="py-10 lg:py-16 bg-ayur-cream min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs text-stone-500 font-medium">
            <Link href="/" className="hover:text-[#0d3b27]">Home</Link>
            <span>/</span>
            <span className="text-[#0d3b27] font-semibold">Products</span>
            {currentCategory && (
              <>
                <span>/</span>
                <span className="text-emerald-800 font-semibold">{currentCategory.name}</span>
              </>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0d3b27] font-serif-ayur">
            {currentCategory ? currentCategory.name : "Pure Ayurvedic Formulations"}
          </h1>

          <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto leading-relaxed">
            {currentCategory?.description ||
              "Rooted in classical Kerala Ayurvedic principles. Pure, lab-tested herbal formulations for everyday health and family vitality."}
          </p>
        </div>

        {/* Filter & Search Bar Controls */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-emerald-900/10 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input Form */}
            <form action="/products" method="GET" className="relative w-full md:w-96 flex items-center">
              {category !== "all" && <input type="hidden" name="category" value={category} />}
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search by product name or herb..."
                className="w-full pl-10 pr-24 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0d3b27] focus:bg-white"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5" />
              <button
                type="submit"
                className="absolute right-1 px-3.5 py-1.5 bg-[#0d3b27] text-white text-xs font-semibold rounded-full hover:bg-[#165b33] transition-colors"
              >
                Search
              </button>
            </form>

            {/* Results Count & Clear Filter */}
            <div className="flex items-center gap-4 text-xs text-stone-500 w-full md:w-auto justify-between md:justify-end">
              <span>Showing <strong>{products.length}</strong> products</span>
              {(category !== "all" || search) && (
                <Link
                  href="/products"
                  className="text-emerald-800 font-semibold hover:underline"
                >
                  Reset Filters
                </Link>
              )}
            </div>
          </div>

          {/* Category Pills Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-stone-100 scrollbar-none">
            <Link
              href="/products"
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                category === "all"
                  ? "bg-[#0d3b27] text-white shadow-sm"
                  : "bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200"
              }`}
            >
              All Categories
            </Link>

            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  category === cat.slug
                    ? "bg-[#0d3b27] text-white shadow-sm"
                    : "bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-dashed border-stone-300 max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#0d3b27] flex items-center justify-center mx-auto">
              <Filter className="w-8 h-8 opacity-60" />
            </div>
            <h3 className="text-lg font-bold font-serif-ayur text-[#0d3b27]">No products available yet.</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              {search
                ? `No products matched "${search}". Try searching for another herb or resetting filters.`
                : "Products in this category are being prepared by our Ayurvedic pharmacy."}
            </p>
            <Link
              href="/products"
              className="inline-block px-5 py-2 rounded-full bg-[#0d3b27] text-white text-xs font-semibold hover:bg-[#165b33]"
            >
              View All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                whatsappNumber={settings.whatsapp_number}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
