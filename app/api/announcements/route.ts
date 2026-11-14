import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { Announcement } from "@/lib/types";
import { saveAnnouncementToLocalStore, deleteAnnouncementFromLocalStore } from "@/lib/supabase/queries";

function sanitizeAnnouncementPayload(body: Partial<Announcement>) {
  return {
    text: body.text?.trim() || "Ayurvedic consultation and natural products available.",
    link_url: body.link_url?.trim() || null,
    bg_color: body.bg_color?.trim() || "#0d3b27",
    text_color: body.text_color?.trim() || "#ffffff",
    priority: typeof body.priority === "number" ? body.priority : 1,
    start_date: body.start_date || null,
    end_date: body.end_date || null,
    is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
  };
}

function purgeCaches() {
  try {
    revalidatePath("/");
    revalidatePath("/admin/announcements");
    revalidatePath("/admin/content");
  } catch {
    // Non-fatal
  }
}

// POST: Create announcement
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sanitized = sanitizeAnnouncementPayload(body);

    let createdAnnouncement: Announcement | null = null;
    let dbSuccess = false;

    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase.from("announcements").insert([sanitized]).select().single();
      if (!error && data) {
        createdAnnouncement = data as Announcement;
        dbSuccess = true;
      }
    } catch (dbErr) {
      console.warn("Supabase announcement insert issue:", dbErr);
    }

    if (!createdAnnouncement) {
      createdAnnouncement = {
        id: `ann_${Date.now()}`,
        ...sanitized,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    saveAnnouncementToLocalStore(createdAnnouncement);
    purgeCaches();

    return NextResponse.json({
      success: true,
      announcement: createdAnnouncement,
      persisted_to_db: dbSuccess,
      message: "Announcement created successfully.",
    });
  } catch (err: unknown) {
    console.error("Failed to create announcement:", err);
    return NextResponse.json({ error: "Failed to create announcement." }, { status: 500 });
  }
}

// PUT: Update announcement
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body.id;

    if (!id) {
      return NextResponse.json({ error: "Announcement ID is required." }, { status: 400 });
    }

    const sanitized = sanitizeAnnouncementPayload(body);
    let updatedAnnouncement: Announcement | null = null;
    let dbSuccess = false;

    try {
      const supabase = createAdminClient();
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (isUUID) {
        const { data, error } = await supabase
          .from("announcements")
          .update({ ...sanitized, updated_at: new Date().toISOString() })
          .eq("id", id)
          .select()
          .single();
        if (!error && data) {
          updatedAnnouncement = data as Announcement;
          dbSuccess = true;
        }
      }
    } catch (dbErr) {
      console.warn("Supabase announcement update issue:", dbErr);
    }

    if (!updatedAnnouncement) {
      updatedAnnouncement = {
        id,
        ...sanitized,
        updated_at: new Date().toISOString(),
      };
    }

    saveAnnouncementToLocalStore(updatedAnnouncement);
    purgeCaches();

    return NextResponse.json({
      success: true,
      announcement: updatedAnnouncement,
      persisted_to_db: dbSuccess,
      message: "Announcement updated successfully.",
    });
  } catch (err: unknown) {
    console.error("Failed to update announcement:", err);
    return NextResponse.json({ error: "Failed to update announcement." }, { status: 500 });
  }
}

// DELETE: Delete announcement
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Announcement ID required." }, { status: 400 });
    }

    try {
      const supabase = createAdminClient();
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (isUUID) {
        await supabase.from("announcements").delete().eq("id", id);
      }
    } catch (dbErr) {
      console.warn("Supabase announcement delete issue:", dbErr);
    }

    deleteAnnouncementFromLocalStore(id);
    purgeCaches();

    return NextResponse.json({ success: true, message: "Announcement deleted successfully." });
  } catch (err: unknown) {
    console.error("Failed to delete announcement:", err);
    return NextResponse.json({ error: "Failed to delete announcement." }, { status: 500 });
  }
}

