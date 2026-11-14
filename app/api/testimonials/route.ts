import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { Testimonial } from "@/lib/types";
import { saveTestimonialToLocalStore, deleteTestimonialFromLocalStore } from "@/lib/supabase/queries";

function sanitizeTestimonialPayload(body: Partial<Testimonial>) {
  return {
    author_name: body.author_name?.trim() || "Patient",
    author_image: body.author_image || null,
    location: body.location?.trim() || "Manjeri, Malappuram",
    rating: typeof body.rating === "number" && body.rating >= 1 && body.rating <= 5 ? body.rating : 5,
    quote: body.quote?.trim() || "Authentic Ayurvedic care that we trust.",
    is_featured: body.is_featured !== undefined ? Boolean(body.is_featured) : true,
    is_published: body.is_published !== undefined ? Boolean(body.is_published) : true,
    sort_order: typeof body.sort_order === "number" ? body.sort_order : 0,
  };
}

function purgeCaches() {
  try {
    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    revalidatePath("/admin/content");
  } catch {
    // Non-fatal
  }
}

// POST: Create testimonial
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sanitized = sanitizeTestimonialPayload(body);

    let createdTestimonial: Testimonial | null = null;
    let dbSuccess = false;

    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase.from("testimonials").insert([sanitized]).select().single();
      if (!error && data) {
        createdTestimonial = data as Testimonial;
        dbSuccess = true;
      }
    } catch (dbErr) {
      console.warn("Supabase testimonial insert issue:", dbErr);
    }

    if (!createdTestimonial) {
      createdTestimonial = {
        id: `test_${Date.now()}`,
        ...sanitized,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    saveTestimonialToLocalStore(createdTestimonial);
    purgeCaches();

    return NextResponse.json({
      success: true,
      testimonial: createdTestimonial,
      persisted_to_db: dbSuccess,
      message: "Testimonial saved successfully.",
    });
  } catch (err: unknown) {
    console.error("Failed to create testimonial:", err);
    return NextResponse.json({ error: "Failed to create testimonial." }, { status: 500 });
  }
}

// PUT: Update testimonial
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body.id;

    if (!id) {
      return NextResponse.json({ error: "Testimonial ID is required." }, { status: 400 });
    }

    const sanitized = sanitizeTestimonialPayload(body);
    let updatedTestimonial: Testimonial | null = null;
    let dbSuccess = false;

    try {
      const supabase = createAdminClient();
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (isUUID) {
        const { data, error } = await supabase
          .from("testimonials")
          .update({ ...sanitized, updated_at: new Date().toISOString() })
          .eq("id", id)
          .select()
          .single();
        if (!error && data) {
          updatedTestimonial = data as Testimonial;
          dbSuccess = true;
        }
      }
    } catch (dbErr) {
      console.warn("Supabase testimonial update issue:", dbErr);
    }

    if (!updatedTestimonial) {
      updatedTestimonial = {
        id,
        ...sanitized,
        updated_at: new Date().toISOString(),
      };
    }

    saveTestimonialToLocalStore(updatedTestimonial);
    purgeCaches();

    return NextResponse.json({
      success: true,
      testimonial: updatedTestimonial,
      persisted_to_db: dbSuccess,
      message: "Testimonial updated successfully.",
    });
  } catch (err: unknown) {
    console.error("Failed to update testimonial:", err);
    return NextResponse.json({ error: "Failed to update testimonial." }, { status: 500 });
  }
}

// DELETE: Delete testimonial
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Testimonial ID required." }, { status: 400 });
    }

    try {
      const supabase = createAdminClient();
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (isUUID) {
        await supabase.from("testimonials").delete().eq("id", id);
      }
    } catch (dbErr) {
      console.warn("Supabase testimonial delete issue:", dbErr);
    }

    deleteTestimonialFromLocalStore(id);
    purgeCaches();

    return NextResponse.json({ success: true, message: "Testimonial deleted successfully." });
  } catch (err: unknown) {
    console.error("Failed to delete testimonial:", err);
    return NextResponse.json({ error: "Failed to delete testimonial." }, { status: 500 });
  }
}

