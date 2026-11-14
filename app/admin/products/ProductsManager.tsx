"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  Check,
  X,
  Upload,
  AlertCircle,
  Sparkles,
  Leaf,
  Star,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  Tag,
  IndianRupee,
} from "lucide-react";
import { Product, Category } from "@/lib/types";
import { slugify, formatCurrency } from "@/lib/utils";

interface ProductsManagerProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function ProductsManager({
  initialProducts,
  categories,
}: ProductsManagerProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form State (no mandatory fields)
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    slug: "",
    category_id: categories[0]?.id || "",
    sku: "",
    short_description: "",
    full_description: "",
    price: null,
    mrp: null,
    main_image: "/images/products/herbal-hair-oil.svg",
    gallery_images: [],
    ingredients: [],
    usage_instructions: "",
    benefits: [],
    is_featured: false,
    is_published: true,
    in_stock: true,
    sort_order: 0,
    meta_title: "",
    meta_description: "",
  });

  const [ingredientInput, setIngredientInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      slug: "",
      category_id: categories[0]?.id || "",
      sku: `PVS-${Math.floor(100 + Math.random() * 900)}`,
      short_description: "",
      full_description: "",
      price: null,
      mrp: null,
      main_image: "/images/products/herbal-hair-oil.svg",
      gallery_images: [],
      ingredients: [],
      usage_instructions: "",
      benefits: [],
      is_featured: false,
      is_published: true,
      in_stock: true,
      sort_order: products.length + 1,
      meta_title: "",
      meta_description: "",
    });
    setIngredientInput("");
    setBenefitInput("");
    setModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      category_id: product.category_id || categories[0]?.id || "",
    });
    setIngredientInput("");
    setBenefitInput("");
    setModalOpen(true);
  };

  // Requirement: Slug automatically updates on the basis of Product Name
  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: slugify(name),
    }));
  };

  const handleAddIngredient = () => {
    if (ingredientInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        ingredients: [...(prev.ingredients || []), ingredientInput.trim()],
      }));
      setIngredientInput("");
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients?.filter((_, i) => i !== index),
    }));
  };

  const handleAddBenefit = () => {
    if (benefitInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        benefits: [...(prev.benefits || []), benefitInput.trim()],
      }));
      setBenefitInput("");
    }
  };

  const handleRemoveBenefit = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits?.filter((_, i) => i !== index),
    }));
  };

  // Cloudinary image upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("folder", "pvs-ayurvedics/products");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (result.url) {
        setFormData((prev) => ({
          ...prev,
          main_image: result.url,
          gallery_images: prev.gallery_images?.length
            ? [...prev.gallery_images, result.url]
            : [result.url],
        }));
        showToast("Image uploaded successfully!");
      } else {
        showToast("Failed to upload image.", "error");
      }
    } catch {
      showToast("Failed to upload image.", "error");
    } finally {
      setUploading(false);
    }
  };

  // Save product (Update or Create) with API persistence
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Safe non-mandatory defaults
      const productName = formData.name?.trim() || (editingProduct ? editingProduct.name : "New Ayurvedic Formulation");
      const productSlug = formData.slug?.trim() || slugify(productName) || `prod-${Date.now()}`;
      const productShortDesc = formData.short_description?.trim() || "Authentic Kerala Ayurvedic preparation.";

      const payload = {
        ...formData,
        name: productName,
        slug: productSlug,
        short_description: productShortDesc,
        id: editingProduct ? editingProduct.id : undefined,
      };

      const method = editingProduct ? "PUT" : "POST";
      const res = await fetch("/api/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        showToast(data.error || "Failed to save product.", "error");
        setSaving(false);
        return;
      }

      const savedProduct: Product = {
        ...data.product,
        category: categories.find((c) => c.id === data.product.category_id) || null,
      };

      if (editingProduct) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id || p.slug === editingProduct.slug ? savedProduct : p
          )
        );
        if (data.persisted_to_db === false) {
          showToast("Changes saved & live on website! (To sync Supabase cloud DB, run fix_rls_permissions.sql)", "success");
        } else {
          showToast("Product updated and saved successfully!");
        }
      } else {
        setProducts((prev) => [savedProduct, ...prev]);
        if (data.persisted_to_db === false) {
          showToast("Product created & live on website! (To sync Supabase cloud DB, run fix_rls_permissions.sql)", "success");
        } else {
          showToast("New product created and saved successfully!");
        }
      }

      setModalOpen(false);
    } catch (err) {
      console.error("Save product error:", err);
      showToast("An unexpected error occurred while saving.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Toggle publish with API persistence
  const handleTogglePublish = async (id: string) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;

    const newStatus = !prod.is_published;
    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_published: newStatus } : p))
    );

    try {
      await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: prod.id, slug: prod.slug, is_published: newStatus }),
      });
      showToast(newStatus ? "Product published!" : "Product set to draft.");
    } catch {
      showToast("Failed to update status on server.", "error");
    }
  };

  // Toggle featured with API persistence
  const handleToggleFeatured = async (id: string) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;

    const newFeatured = !prod.is_featured;
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_featured: newFeatured } : p))
    );

    try {
      await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: prod.id, slug: prod.slug, is_featured: newFeatured }),
      });
      showToast(newFeatured ? "Added to homepage featured!" : "Removed from featured.");
    } catch {
      showToast("Failed to update featured status.", "error");
    }
  };

  // Delete product with API persistence
  const handleDelete = async (id: string) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;

    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirmId(null);

    try {
      await fetch(`/api/products?id=${encodeURIComponent(prod.id)}&slug=${encodeURIComponent(prod.slug)}`, {
        method: "DELETE",
      });
      showToast("Product deleted successfully.");
    } catch {
      showToast("Failed to delete product from server.", "error");
    }
  };

  // Duplicate product with API persistence
  const handleDuplicate = async (product: Product) => {
    const newName = `${product.name} (Copy)`;
    const newSlug = slugify(`${product.slug}-copy-${Date.now().toString().slice(-4)}`);
    const duplicatedPayload = {
      ...product,
      name: newName,
      slug: newSlug,
      sku: product.sku ? `${product.sku}-CP` : null,
    };
    delete (duplicatedPayload as Record<string, unknown>).id;

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(duplicatedPayload),
      });
      const data = await res.json();
      if (data.product) {
        const fullProd = {
          ...data.product,
          category: categories.find((c) => c.id === data.product.category_id) || product.category,
        };
        setProducts([fullProd, ...products]);
        showToast("Product duplicated successfully!");
      }
    } catch {
      showToast("Failed to duplicate product.", "error");
    }
  };

  // Filtered Products List
  const filtered = products.filter((p) => {
    const matchCat =
      selectedCategory === "all" ||
      p.category_id === selectedCategory ||
      p.category?.slug === selectedCategory;
    const matchSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.short_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold animate-in slide-in-from-top-4 duration-200 ${
            toast.type === "success"
              ? "bg-emerald-900 text-white border-emerald-700"
              : "bg-red-900 text-white border-red-700"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-ayur text-[#0d3b27]">
            Product Management
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Add, edit, feature, and manage Ayurvedic remedies with live cloud synchronization.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0d3b27] text-white text-xs font-semibold hover:bg-[#165b33] transition-all shadow-sm active:scale-95 self-stretch sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter & Search Bar - Fully Responsive */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <input
            type="text"
            placeholder="Search products, SKU, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0d3b27]"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0d3b27] text-stone-700 w-full sm:w-auto"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Content: Dual Responsive View */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-stone-700">No products found</p>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Try adjusting your search keyword or selected category filter.
          </p>
        </div>
      ) : (
        <>
          {/* MOBILE CARDS VIEW (Phones & small screens) */}
          <div className="grid grid-cols-1 gap-3.5 md:hidden">
            {filtered.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className="relative w-14 h-14 rounded-xl bg-stone-50 border border-stone-100 overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                    <Image
                      src={prod.main_image || "/images/products/herbal-hair-oil.svg"}
                      alt={prod.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-900 text-[10px] font-bold truncate">
                        {prod.category?.name || "General"}
                      </span>
                      {prod.sku && (
                        <span className="font-mono text-stone-400 text-[10px]">
                          {prod.sku}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-stone-900 text-sm font-serif-ayur truncate mt-0.5">
                      {prod.name}
                    </h3>
                    <p className="text-[11px] text-stone-500 line-clamp-1">
                      {prod.short_description}
                    </p>
                  </div>
                </div>

                {/* Pricing info if present */}
                {(prod.price !== null && prod.price !== undefined) && (
                  <div className="flex items-center gap-2 pt-1 text-xs">
                    <span className="font-bold text-[#0d3b27]">
                      {formatCurrency(prod.price)}
                    </span>
                    {prod.mrp && prod.mrp > prod.price && (
                      <span className="text-[11px] text-stone-400 line-through">
                        {formatCurrency(prod.mrp)}
                      </span>
                    )}
                  </div>
                )}

                {/* Action Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(prod.id)}
                      className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                        prod.is_featured
                          ? "bg-amber-100 text-amber-700"
                          : "bg-stone-100 text-stone-500"
                      }`}
                      title={prod.is_featured ? "Featured on Homepage" : "Not Featured"}
                    >
                      <Star className={`w-3.5 h-3.5 ${prod.is_featured ? "fill-amber-500 text-amber-500" : ""}`} />
                      <span className="text-[10px]">{prod.is_featured ? "Featured" : "Feature"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTogglePublish(prod.id)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                        prod.is_published
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {prod.is_published ? (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>Live</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>Draft</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleDuplicate(prod)}
                      className="p-2 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(prod)}
                      className="p-2 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(prod.id)}
                      className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP TABLE VIEW (Medium to Large screens) */}
          <div className="hidden md:block bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">Product</th>
                    <th className="py-3.5 px-4 font-semibold">Category</th>
                    <th className="py-3.5 px-4 font-semibold">SKU</th>
                    <th className="py-3.5 px-4 font-semibold">Price</th>
                    <th className="py-3.5 px-4 text-center font-semibold">Featured</th>
                    <th className="py-3.5 px-4 text-center font-semibold">Status</th>
                    <th className="py-3.5 px-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filtered.map((prod) => (
                    <tr key={prod.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-xl bg-stone-50 border border-stone-100 overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                            <Image
                              src={prod.main_image || "/images/products/herbal-hair-oil.svg"}
                              alt={prod.name}
                              fill
                              className="object-contain p-1"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-stone-900 text-sm font-serif-ayur">
                              {prod.name}
                            </p>
                            <p className="text-[11px] text-stone-400 line-clamp-1 max-w-xs">
                              {prod.short_description}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-900 text-[10px] font-bold">
                          {prod.category?.name || "General"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-stone-500 text-[11px]">
                        {prod.sku || "—"}
                      </td>

                      <td className="py-3.5 px-4 text-stone-700 font-medium">
                        {prod.price !== null && prod.price !== undefined ? (
                          formatCurrency(prod.price)
                        ) : (
                          <span className="text-stone-300">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(prod.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            prod.is_featured
                              ? "bg-amber-100 text-amber-700"
                              : "bg-stone-100 text-stone-400 hover:text-stone-600"
                          }`}
                          title={prod.is_featured ? "Featured Product" : "Click to Feature"}
                        >
                          <Star className={`w-4 h-4 ${prod.is_featured ? "fill-amber-500 text-amber-500" : ""}`} />
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(prod.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                            prod.is_published
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-stone-100 text-stone-500"
                          }`}
                        >
                          {prod.is_published ? (
                            <>
                              <Eye className="w-3 h-3" />
                              <span>Published</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              <span>Draft</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleDuplicate(prod)}
                            className="p-1.5 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
                            title="Duplicate Product"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(prod)}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(prod.id)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold font-serif-ayur text-stone-900">
              Delete Product?
            </h3>
            <p className="text-xs text-stone-500">
              Are you sure you want to remove this product from the database? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal Form - No Mandatory Requirements & Auto Slug */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full my-6 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-stone-100 flex-shrink-0 bg-stone-50/50">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-emerald-800 uppercase">
                  {editingProduct ? "Edit Product" : "New Formulation"}
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-serif-ayur text-[#0d3b27]">
                  {editingProduct ? editingProduct.name : "Create Ayurvedic Product"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Scrollable Area */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-5 text-xs">
              
              {/* Product Name & Auto-Generated Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Herbal Hair Oil"
                    value={formData.name || ""}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#0d3b27] focus:bg-white text-xs"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-stone-700">URL Slug</label>
                    <span className="text-[10px] text-emerald-700 font-medium">Auto-generated</span>
                  </div>
                  <input
                    type="text"
                    placeholder="herbal-hair-oil"
                    value={formData.slug || ""}
                    onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#0d3b27] focus:bg-white font-mono text-xs text-stone-600"
                  />
                </div>
              </div>

              {/* Category, SKU & Sort Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={formData.category_id || ""}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#0d3b27] focus:bg-white text-xs"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">SKU / Formulation Code</label>
                  <input
                    type="text"
                    placeholder="PVS-OIL-001"
                    value={formData.sku || ""}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#0d3b27] focus:bg-white font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={formData.sort_order ?? 0}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#0d3b27] focus:bg-white text-xs"
                  />
                </div>
              </div>

              {/* Pricing & MRP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-emerald-50/40 p-4 rounded-2xl border border-emerald-900/10">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Selling Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-stone-400 font-bold">₹</span>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 320"
                      value={formData.price !== null && formData.price !== undefined ? formData.price : ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: e.target.value === "" ? null : parseFloat(e.target.value),
                        })
                      }
                      className="w-full pl-8 pr-3.5 py-2.5 bg-white border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#0d3b27] text-xs font-semibold text-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">MRP / Strike-through Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-stone-400 font-bold">₹</span>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 380"
                      value={formData.mrp !== null && formData.mrp !== undefined ? formData.mrp : ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mrp: e.target.value === "" ? null : parseFloat(e.target.value),
                        })
                      }
                      className="w-full pl-8 pr-3.5 py-2.5 bg-white border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#0d3b27] text-xs font-semibold text-stone-900"
                    />
                  </div>
                </div>
              </div>

              {/* Short & Full Descriptions */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Short Description / Subtitle</label>
                <input
                  type="text"
                  placeholder="e.g. Nourishes scalp and promotes healthy hair"
                  value={formData.short_description || ""}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#0d3b27] focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Full Description &amp; Traditional Context</label>
                <textarea
                  rows={3}
                  placeholder="Detailed description of the formulation, herbs, and classical Ayurvedic preparation..."
                  value={formData.full_description || ""}
                  onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#0d3b27] focus:bg-white resize-none text-xs"
                />
              </div>

              {/* Image Uploader & Preview */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <label className="block font-bold text-stone-700">Product Main Image (Cloudinary or local path)</label>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl bg-white border border-stone-200 overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                    <Image
                      src={formData.main_image || "/images/products/herbal-hair-oil.svg"}
                      alt="Product preview"
                      fill
                      className="object-contain p-1"
                    />
                  </div>

                  <div className="space-y-2 flex-1 w-full">
                    <input
                      type="text"
                      placeholder="Image URL or Cloudinary path"
                      value={formData.main_image || ""}
                      onChange={(e) => setFormData({ ...formData, main_image: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg"
                    />

                    <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-stone-700 cursor-pointer hover:bg-stone-100 transition-colors text-xs font-semibold">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploading ? "Uploading to Cloudinary..." : "Upload New Image"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Key Botanical Ingredients */}
              <div className="space-y-2">
                <label className="block font-bold text-stone-700">Key Botanical Ingredients</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add ingredient (e.g. Bringaraja, Amla, Brahmi)..."
                    value={ingredientInput}
                    onChange={(e) => setIngredientInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddIngredient();
                      }
                    }}
                    className="flex-1 px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddIngredient}
                    className="px-4 py-2 bg-[#0d3b27] text-white rounded-xl font-semibold hover:bg-[#165b33] text-xs transition-colors"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {formData.ingredients?.map((ing, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-900 rounded-full text-[11px] font-semibold"
                    >
                      <Leaf className="w-3 h-3 text-emerald-700" />
                      <span>{ing}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(idx)}
                        className="hover:text-red-600 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Benefits Manager */}
              <div className="space-y-2">
                <label className="block font-bold text-stone-700">Key Benefits</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add benefit (e.g. Reduces hair fall, Soothes dry scalp)..."
                    value={benefitInput}
                    onChange={(e) => setBenefitInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddBenefit();
                      }
                    }}
                    className="flex-1 px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddBenefit}
                    className="px-4 py-2 bg-[#0d3b27] text-white rounded-xl font-semibold hover:bg-[#165b33] text-xs transition-colors"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {formData.benefits?.map((b, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-900 rounded-full text-[11px] font-semibold"
                    >
                      <Sparkles className="w-3 h-3 text-blue-700" />
                      <span>{b}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveBenefit(idx)}
                        className="hover:text-red-600 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Usage / Directions */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Directions for Use / Dosage</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Gently massage into scalp using circular motions..."
                  value={formData.usage_instructions || ""}
                  onChange={(e) => setFormData({ ...formData, usage_instructions: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#0d3b27] focus:bg-white resize-none text-xs"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-stone-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="rounded text-emerald-800 focus:ring-emerald-700"
                  />
                  <span className="font-semibold text-stone-800 text-xs">Publish on Website</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span className="font-semibold text-stone-800 text-xs">Feature on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.in_stock}
                    onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                    className="rounded text-emerald-800 focus:ring-emerald-700"
                  />
                  <span className="font-semibold text-stone-800 text-xs">In Stock</span>
                </label>
              </div>

              {/* Modal Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100 sticky bottom-0 bg-white pb-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-semibold hover:bg-stone-50 transition-colors text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#0d3b27] text-white font-semibold hover:bg-[#165b33] shadow-md shadow-emerald-950/20 transition-all active:scale-95 text-xs disabled:opacity-70"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{saving ? "Saving Changes..." : editingProduct ? "Save Changes" : "Create Product"}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
