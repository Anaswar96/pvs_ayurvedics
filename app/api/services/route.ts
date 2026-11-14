import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { Service } from "@/lib/types";
import { saveServiceToLocalStore, deleteServiceFromLocalStore } from "@/lib/supabase/queries";
import { slugify } from "@/lib/utils";

function sanitizeServicePayload(body: Partial<Service>) {
  const title = body.title?.trim() || "Untitled Treatment";
  const slug = body.slug?.trim() || slugify(title);

  return {
    title,
    slug,
    short_description: body.short_description?.trim() || "Personalized Ayurvedic therapy.",
    full_description: body.full_description?.trim() || null,
    icon_name: body.icon_name || "Stethoscope",
    image_url: body.image_url || null,
    benefits: Array.isArray(body.benefits) ? body.benefits : [],
    sort_order: typeof body.sort_order === "number" ? body.sort_order : 0,
    is_published: body.is_published !== undefined ? Boolean(body.is_published) : true,
  };
}

function purgeCaches() {
  try {
    revalidatePath("/");
    revalidatePath("/services");
    revalidatePath("/admin/services");
    revalidatePath("/admin/content");
  } catch {
    // Non-fatal outside request lifecycle
  }
}

// POST: Create a new service
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sanitized = sanitizeServicePayload(body);

    let createdService: Service | null = null;
    let dbSuccess = false;

    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("services")
        .insert([sanitized])
        .select()
        .single();

      if (!error && data) {
        createdService = data as Service;
        dbSuccess = true;
      }
    } catch (dbErr) {
      console.warn("Supabase service insert issue:", dbErr);
    }

    if (!createdService) {
      createdService = {
        id: `srv_${Date.now()}`,
        ...sanitized,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    saveServiceToLocalStore(createdService);
    purgeCaches();

    return NextResponse.json({
      success: true,
      service: createdService,
      persisted_to_db: dbSuccess,
      message: "Treatment service saved successfully.",
    });
  } catch (err: unknown) {
    console.error("Failed to create service:", err);
    return NextResponse.json({ error: "Failed to create service." }, { status: 500 });
  }
}

// PUT: Update an existing service
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body.id;
    const slug = body.slug;

    if (!id && !slug) {
      return NextResponse.json({ error: "Service ID or slug required for updating." }, { status: 400 });
    }

    const sanitized = sanitizeServicePayload(body);
    let updatedService: Service | null = null;
    let dbSuccess = false;

    try {
      const supabase = createAdminClient();
      let query = supabase.from("services").update({
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
        updatedService = data as Service;
        dbSuccess = true;
      }
    } catch (dbErr) {
      console.warn("Supabase service update issue:", dbErr);
    }

    if (!updatedService) {
      updatedService = {
        id: id || `srv_${Date.now()}`,
        ...sanitized,
        updated_at: new Date().toISOString(),
      };
    }

    saveServiceToLocalStore(updatedService);
    purgeCaches();

    return NextResponse.json({
      success: true,
      service: updatedService,
      persisted_to_db: dbSuccess,
      message: "Treatment service updated successfully.",
    });
  } catch (err: unknown) {
    console.error("Failed to update service:", err);
    return NextResponse.json({ error: "Failed to update service." }, { status: 500 });
  }
}

// DELETE: Delete a service
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");

    if (!id && !slug) {
      return NextResponse.json({ error: "Service ID or slug required." }, { status: 400 });
    }

    try {
      const supabase = createAdminClient();
      let query = supabase.from("services").delete();
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
      console.warn("Supabase service delete issue:", dbErr);
    }

    if (id) deleteServiceFromLocalStore(id);
    if (slug) deleteServiceFromLocalStore(slug);

    purgeCaches();

    return NextResponse.json({ success: true, message: "Service deleted successfully." });
  } catch (err: unknown) {
    console.error("Failed to delete service:", err);
    return NextResponse.json({ error: "Failed to delete service." }, { status: 500 });
  }
}

