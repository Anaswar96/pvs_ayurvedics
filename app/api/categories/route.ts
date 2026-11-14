import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { Category } from "@/lib/types";
import { saveCategoryToLocalStore, deleteCategoryFromLocalStore } from "@/lib/supabase/queries";
import { slugify } from "@/lib/utils";

function sanitizeCategoryPayload(body: Partial<Category>) {
  const name = body.name?.trim() || "Untitled Category";
  const slug = body.slug?.trim() || slugify(name);

  return {
    name,
    slug,
    description: body.description?.trim() || null,
    image_url: body.image_url || null,
    sort_order: typeof body.sort_order === "number" ? body.sort_order : 0,
    is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
  };
}

function purgeCaches() {
  try {
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
  } catch {
    // Non-fatal
  }
}

// POST: Create category
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sanitized = sanitizeCategoryPayload(body);

    let createdCategory: Category | null = null;
    let dbSuccess = false;

    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase.from("categories").insert([sanitized]).select().single();
      if (!error && data) {
        createdCategory = data as Category;
        dbSuccess = true;
      }
    } catch (dbErr) {
      console.warn("Supabase category insert issue:", dbErr);
    }

    if (!createdCategory) {
      createdCategory = {
        id: `cat_${Date.now()}`,
        ...sanitized,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    saveCategoryToLocalStore(createdCategory);
    purgeCaches();

    return NextResponse.json({
      success: true,
      category: createdCategory,
      persisted_to_db: dbSuccess,
      message: "Category created successfully.",
    });
  } catch (err: unknown) {
    console.error("Failed to create category:", err);
    return NextResponse.json({ error: "Failed to create category." }, { status: 500 });
  }
}

// PUT: Update category
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body.id;
    const slug = body.slug;

    if (!id && !slug) {
      return NextResponse.json({ error: "Category ID or slug is required." }, { status: 400 });
    }

    const sanitized = sanitizeCategoryPayload(body);
    let updatedCategory: Category | null = null;
    let dbSuccess = false;

    try {
      const supabase = createAdminClient();
      let query = supabase.from("categories").update({
        ...sanitized,
        updated_at: new Date().toISOString(),
      });

      const isUUID = id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (isUUID) {
        query = query.eq("id", id);
      } else if (slug) {
        query = query.eq("slug", slug);
      } else {
        query = query.eq("id", id);
      }

      const { data, error } = await query.select().single();
      if (!error && data) {
        updatedCategory = data as Category;
        dbSuccess = true;
      }
    } catch (dbErr) {
      console.warn("Supabase category update issue:", dbErr);
    }

    if (!updatedCategory) {
      updatedCategory = {
        id: id || `cat_${Date.now()}`,
        ...sanitized,
        updated_at: new Date().toISOString(),
      };
    }

    saveCategoryToLocalStore(updatedCategory);
    purgeCaches();

    return NextResponse.json({
      success: true,
      category: updatedCategory,
      persisted_to_db: dbSuccess,
      message: "Category updated successfully.",
    });
  } catch (err: unknown) {
    console.error("Failed to update category:", err);
    return NextResponse.json({ error: "Failed to update category." }, { status: 500 });
  }
}

// DELETE: Delete category
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");

    if (!id && !slug) {
      return NextResponse.json({ error: "Category ID or slug required." }, { status: 400 });
    }

    try {
      const supabase = createAdminClient();
      let query = supabase.from("categories").delete();
      const isUUID = id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (isUUID) {
        query = query.eq("id", id);
      } else if (slug) {
        query = query.eq("slug", slug);
      } else if (id) {
        query = query.eq("id", id);
      }
      await query;
    } catch (dbErr) {
      console.warn("Supabase category delete issue:", dbErr);
    }

    if (id) deleteCategoryFromLocalStore(id);
    if (slug) deleteCategoryFromLocalStore(slug);

    purgeCaches();

    return NextResponse.json({ success: true, message: "Category deleted successfully." });
  } catch (err: unknown) {
    console.error("Failed to delete category:", err);
    return NextResponse.json({ error: "Failed to delete category." }, { status: 500 });
  }
}

