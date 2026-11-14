import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { Banner } from "@/lib/types";
import { saveBannerToLocalStore, deleteBannerFromLocalStore } from "@/lib/supabase/queries";

function sanitizeBannerPayload(body: Partial<Banner>) {
  return {
    title: body.title?.trim() || "Promotional Banner",
    subtitle: body.subtitle?.trim() || null,
    cta_text: body.cta_text?.trim() || "Explore Products",
    cta_url: body.cta_url?.trim() || "/products",
    desktop_image: body.desktop_image || "/images/banners/promo-banner.svg",
    mobile_image: body.mobile_image || null,
    placement: body.placement || "home_sidebar",
    features: Array.isArray(body.features) ? body.features : [],
    start_date: body.start_date || null,
    end_date: body.end_date || null,
    is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
    sort_order: typeof body.sort_order === "number" ? body.sort_order : 0,
  };
}

function purgeCaches() {
  try {
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin/banners");
    revalidatePath("/admin/content");
  } catch {
    // Non-fatal
  }
}

// POST: Create banner
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sanitized = sanitizeBannerPayload(body);

    let createdBanner: Banner | null = null;
    let dbSuccess = false;

    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase.from("banners").insert([sanitized]).select().single();
      if (!error && data) {
        createdBanner = data as Banner;
        dbSuccess = true;
      }
    } catch (dbErr) {
      console.warn("Supabase banner insert issue:", dbErr);
    }

    if (!createdBanner) {
      createdBanner = {
        id: `ban_${Date.now()}`,
        ...sanitized,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    saveBannerToLocalStore(createdBanner);
    purgeCaches();

    return NextResponse.json({
      success: true,
      banner: createdBanner,
      persisted_to_db: dbSuccess,
      message: "Banner created successfully.",
    });
  } catch (err: unknown) {
    console.error("Failed to create banner:", err);
    return NextResponse.json({ error: "Failed to create banner." }, { status: 500 });
  }
}

// PUT: Update banner
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body.id;

    if (!id) {
      return NextResponse.json({ error: "Banner ID is required." }, { status: 400 });
    }

    const sanitized = sanitizeBannerPayload(body);
    let updatedBanner: Banner | null = null;
    let dbSuccess = false;

    try {
      const supabase = createAdminClient();
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (isUUID) {
        const { data, error } = await supabase
          .from("banners")
          .update({ ...sanitized, updated_at: new Date().toISOString() })
          .eq("id", id)
          .select()
          .single();
        if (!error && data) {
          updatedBanner = data as Banner;
          dbSuccess = true;
        }
      }
    } catch (dbErr) {
      console.warn("Supabase banner update issue:", dbErr);
    }

    if (!updatedBanner) {
      updatedBanner = {
        id,
        ...sanitized,
        updated_at: new Date().toISOString(),
      };
    }

    saveBannerToLocalStore(updatedBanner);
    purgeCaches();

    return NextResponse.json({
      success: true,
      banner: updatedBanner,
      persisted_to_db: dbSuccess,
      message: "Banner updated successfully.",
    });
  } catch (err: unknown) {
    console.error("Failed to update banner:", err);
    return NextResponse.json({ error: "Failed to update banner." }, { status: 500 });
  }
}

// DELETE: Delete banner
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Banner ID required." }, { status: 400 });
    }

    try {
      const supabase = createAdminClient();
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (isUUID) {
        await supabase.from("banners").delete().eq("id", id);
      }
    } catch (dbErr) {
      console.warn("Supabase banner delete issue:", dbErr);
    }

    deleteBannerFromLocalStore(id);
    purgeCaches();

    return NextResponse.json({ success: true, message: "Banner deleted successfully." });
  } catch (err: unknown) {
    console.error("Failed to delete banner:", err);
    return NextResponse.json({ error: "Failed to delete banner." }, { status: 500 });
  }
}

