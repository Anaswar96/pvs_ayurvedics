import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { WebsiteSection, TrustPoint } from "@/lib/types";
import {
  saveWebsiteSectionsToLocalStore,
  saveTrustPointsToLocalStore,
} from "@/lib/supabase/queries";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sections = (body.sections || []) as WebsiteSection[];
    const trustPoints = (body.trustPoints || []) as TrustPoint[];

    let dbSuccess = false;
    let dbErrorMsg = "";

    try {
      const supabase = createAdminClient();

      // Upsert sections
      if (sections.length > 0) {
        for (const s of sections) {
          const payload = {
            section_key: s.section_key,
            section_name: s.section_name,
            title: s.title || null,
            subtitle: s.subtitle || null,
            content: s.content || null,
            cta_text: s.cta_text || null,
            cta_url: s.cta_url || null,
            secondary_cta_text: s.secondary_cta_text || null,
            secondary_cta_url: s.secondary_cta_url || null,
            image_url: s.image_url || null,
            mobile_image_url: s.mobile_image_url || null,
            is_visible: s.is_visible !== undefined ? Boolean(s.is_visible) : true,
            sort_order: typeof s.sort_order === "number" ? s.sort_order : 0,
            meta_data: s.meta_data || {},
            updated_at: new Date().toISOString(),
          };

          const { error } = await supabase
            .from("website_sections")
            .upsert(payload, { onConflict: "section_key" });

          if (error) {
            console.warn(`Error updating section ${s.section_key}:`, error.message);
            dbErrorMsg = error.message;
          }
        }
      }

      // Update trust points if provided
      if (trustPoints.length > 0) {
        for (const tp of trustPoints) {
          // Check if valid UUID, if not generate or let Supabase insert
          const isUUID =
            tp.id &&
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
              tp.id
            );

          const payload = {
            ...(isUUID ? { id: tp.id } : {}),
            title: tp.title,
            subtitle: tp.subtitle || null,
            icon_name: tp.icon_name || "Leaf",
            is_active: tp.is_active !== undefined ? Boolean(tp.is_active) : true,
            sort_order: typeof tp.sort_order === "number" ? tp.sort_order : 0,
          };

          await supabase.from("trust_points").upsert(payload);
        }
      }

      dbSuccess = !dbErrorMsg;
    } catch (dbErr: any) {
      dbErrorMsg = dbErr?.message || String(dbErr);
      console.warn("Supabase content save issue:", dbErr);
    }

    // Always update local cache & disk store
    if (sections.length > 0) {
      saveWebsiteSectionsToLocalStore(sections);
    }
    if (trustPoints.length > 0) {
      saveTrustPointsToLocalStore(trustPoints);
    }

    // Purge caches on home and content manager
    try {
      revalidatePath("/");
      revalidatePath("/admin/content");
    } catch {
      // Non-fatal if called without request store
    }

    return NextResponse.json({
      success: true,
      persisted_to_db: dbSuccess,
      db_warning: !dbSuccess ? dbErrorMsg : undefined,
      message: dbSuccess
        ? "Website content saved successfully in database!"
        : "Website content saved to local storage!",
    });
  } catch (err: unknown) {
    console.error("Failed to save website content:", err);
    return NextResponse.json(
      { error: "Failed to save website content." },
      { status: 500 }
    );
  }
}
