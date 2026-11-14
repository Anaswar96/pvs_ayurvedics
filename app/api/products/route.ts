import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { Product } from "@/lib/types";
import { saveProductToLocalStore, deleteProductFromLocalStore } from "@/lib/supabase/queries";
import { slugify } from "@/lib/utils";

// Helper to sanitize product payload for Supabase (stripping non-column fields like 'category')
function sanitizeProductPayload(body: Partial<Product>) {
  const name = body.name?.trim() || "Untitled Product";
  const slug = body.slug?.trim() || slugify(name);

  return {
    name,
    slug,
    category_id: body.category_id && body.category_id !== "all" && body.category_id.trim() !== "" ? body.category_id : null,
    sku: body.sku ? body.sku.trim() : null,
    short_description: body.short_description ? body.short_description.trim() : "Authentic Ayurvedic preparation.",
    full_description: body.full_description ? body.full_description.trim() : null,
    price: body.price !== undefined && body.price !== null && !isNaN(Number(body.price)) ? Number(body.price) : null,
    mrp: body.mrp !== undefined && body.mrp !== null && !isNaN(Number(body.mrp)) ? Number(body.mrp) : null,
    main_image: body.main_image || "/images/products/herbal-hair-oil.svg",
    gallery_images: Array.isArray(body.gallery_images) && body.gallery_images.length > 0
      ? body.gallery_images
      : [body.main_image || "/images/products/herbal-hair-oil.svg"],
    ingredients: Array.isArray(body.ingredients) ? body.ingredients : [],
    usage_instructions: body.usage_instructions ? body.usage_instructions.trim() : null,
    benefits: Array.isArray(body.benefits) ? body.benefits : [],
    is_featured: Boolean(body.is_featured),
    is_published: body.is_published !== undefined ? Boolean(body.is_published) : true,
    in_stock: body.in_stock !== undefined ? Boolean(body.in_stock) : true,
    sort_order: typeof body.sort_order === "number" ? body.sort_order : 0,
    meta_title: body.meta_title ? body.meta_title.trim() : null,
    meta_description: body.meta_description ? body.meta_description.trim() : null,
  };
}

function purgeCaches(slug?: string) {
  try {
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin/products");
    if (slug) {
      revalidatePath(`/products/${slug}`);
    }
  } catch {
    // Non-fatal if called in contexts without active request store
  }
}

// POST: Create a new product
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sanitized = sanitizeProductPayload(body);

    let createdProduct: Product | null = null;
    let dbSuccess = false;
    let dbErrorMsg = "";

    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("products")
        .insert([sanitized])
        .select("*, category:categories(*)")
        .single();

      if (!error && data) {
        createdProduct = data as Product;
        dbSuccess = true;
      } else if (error) {
        dbErrorMsg = error.message;
        console.warn("Supabase product insert warning:", error.message);
      }
    } catch (dbErr: any) {
      dbErrorMsg = dbErr?.message || String(dbErr);
      console.warn("Database connection issue, saving locally:", dbErr);
    }

    if (!createdProduct) {
      createdProduct = {
        id: `prod_${Date.now()}`,
        ...sanitized,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    // Always update local cache and disk store so SSR and fallback pages see it immediately
    saveProductToLocalStore(createdProduct);

    // Revalidate website static/ISR paths
    purgeCaches(createdProduct.slug);

    return NextResponse.json({
      success: true,
      product: createdProduct,
      persisted_to_db: dbSuccess,
      db_warning: !dbSuccess ? dbErrorMsg : undefined,
      message: dbSuccess
        ? "Product created successfully in database!"
        : "Product saved to local storage! Run fix_rls_permissions.sql in Supabase SQL editor to sync with cloud DB.",
    });
  } catch (err: unknown) {
    console.error("Failed to create product:", err);
    return NextResponse.json(
      { error: "Failed to create product." },
      { status: 500 }
    );
  }
}

// PUT / PATCH: Update an existing product
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body.id;
    const slug = body.slug;

    if (!id && !slug) {
      return NextResponse.json({ error: "Product ID or slug is required for updating." }, { status: 400 });
    }

    const sanitized = sanitizeProductPayload(body);
    let updatedProduct: Product | null = null;
    let dbSuccess = false;
    let dbErrorMsg = "";

    try {
      const supabase = createAdminClient();
      
      // Try updating by ID first, or by slug if ID is a fallback string
      let query = supabase.from("products").update({
        ...sanitized,
        updated_at: new Date().toISOString(),
      });

      // Check if id is a standard UUID format
      const isUUID = id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (isUUID) {
        query = query.eq("id", id);
      } else if (slug) {
        query = query.eq("slug", slug);
      } else {
        query = query.eq("id", id);
      }

      const { data, error } = await query.select("*, category:categories(*)").single();

      if (!error && data) {
        updatedProduct = data as Product;
        dbSuccess = true;
      } else if (error) {
        dbErrorMsg = error.message;
        console.warn("Supabase product update warning:", error.message);
      }
    } catch (dbErr: any) {
      dbErrorMsg = dbErr?.message || String(dbErr);
      console.warn("Database connection issue during product update:", dbErr);
    }

    if (!updatedProduct) {
      updatedProduct = {
        id: id || `prod_${Date.now()}`,
        ...sanitized,
        updated_at: new Date().toISOString(),
      };
    }

    // Always keep local runtime cache in sync
    saveProductToLocalStore(updatedProduct);

    // Revalidate website static/ISR paths
    purgeCaches(updatedProduct.slug);

    return NextResponse.json({
      success: true,
      product: updatedProduct,
      persisted_to_db: dbSuccess,
      db_warning: !dbSuccess ? dbErrorMsg : undefined,
      message: dbSuccess
        ? "Product updated successfully in database!"
        : "Product changes saved to local storage!",
    });
  } catch (err: unknown) {
    console.error("Failed to update product:", err);
    return NextResponse.json(
      { error: "Failed to update product." },
      { status: 500 }
    );
  }
}

// DELETE: Delete a product
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");

    if (!id && !slug) {
      return NextResponse.json({ error: "Product ID or slug required." }, { status: 400 });
    }

    let dbSuccess = false;

    try {
      const supabase = createAdminClient();
      let query = supabase.from("products").delete();

      const isUUID = id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (isUUID) {
        query = query.eq("id", id);
      } else if (slug) {
        query = query.eq("slug", slug);
      } else if (id) {
        query = query.eq("id", id);
      }

      const { error } = await query;
      if (!error) {
        dbSuccess = true;
      } else {
        console.warn("Supabase delete product warning:", error.message);
      }
    } catch (dbErr) {
      console.warn("Database delete error:", dbErr);
    }

    if (id) deleteProductFromLocalStore(id);
    if (slug) deleteProductFromLocalStore(slug);

    // Revalidate website static/ISR paths
    purgeCaches(slug || undefined);

    return NextResponse.json({
      success: true,
      persisted_to_db: dbSuccess,
      message: "Product deleted successfully.",
    });
  } catch (err: unknown) {
    console.error("Failed to delete product:", err);
    return NextResponse.json(
      { error: "Failed to delete product." },
      { status: 500 }
    );
  }
}
