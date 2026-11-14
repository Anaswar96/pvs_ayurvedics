import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { SiteSettings } from "@/lib/types";
import { saveSiteSettingsToLocalStore } from "@/lib/supabase/queries";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<SiteSettings>;

    let dbSuccess = false;
    let dbErrorMsg = "";

    try {
      const supabase = createAdminClient();

      // Check if site_settings row exists, or upsert
      const payload: Record<string, unknown> = {
        business_name: body.business_name || "PVS Ayurvedics",
        tagline: body.tagline || "",
        malayalam_headline: body.malayalam_headline || "",
        malayalam_tagline: body.malayalam_tagline || "",
        phone: body.phone || "",
        whatsapp_number: body.whatsapp_number || "",
        whatsapp_sticky_enabled: body.whatsapp_sticky_enabled !== undefined ? body.whatsapp_sticky_enabled : true,
        whatsapp_default_message: body.whatsapp_default_message ?? "Hello PVS Ayurvedics, I would like to inquire about your Ayurvedic treatments and products.",
        whatsapp_button_label: body.whatsapp_button_label ?? "Chat with Us",
        email: body.email || "",
        address: body.address || "",
        working_hours: body.working_hours || "",
        google_map_embed_url: body.google_map_embed_url || "",
        google_map_directions_url: body.google_map_directions_url || "",
        facebook_url: body.facebook_url || "",
        instagram_url: body.instagram_url || "",
        youtube_url: body.youtube_url || "",
        meta_title: body.meta_title || "",
        meta_description: body.meta_description || "",
        updated_at: new Date().toISOString(),
      };

      // Try updating the first row in Supabase
      const { data: existingRows } = await supabase.from("site_settings").select("id").limit(1);
      if (existingRows && existingRows.length > 0) {
        let updateRes = await supabase
          .from("site_settings")
          .update(payload)
          .eq("id", existingRows[0].id);
        
        // If it failed possibly due to columns not in table yet, try without the new columns
        if (updateRes.error) {
          const fallbackPayload = { ...payload };
          delete fallbackPayload.whatsapp_sticky_enabled;
          delete fallbackPayload.whatsapp_default_message;
          delete fallbackPayload.whatsapp_button_label;
          updateRes = await supabase
            .from("site_settings")
            .update(fallbackPayload)
            .eq("id", existingRows[0].id);
        }

        if (!updateRes.error) dbSuccess = true;
        else dbErrorMsg = updateRes.error.message;
      } else {
        let insertRes = await supabase.from("site_settings").insert([payload]);
        if (insertRes.error) {
          const fallbackPayload = { ...payload };
          delete fallbackPayload.whatsapp_sticky_enabled;
          delete fallbackPayload.whatsapp_default_message;
          delete fallbackPayload.whatsapp_button_label;
          insertRes = await supabase.from("site_settings").insert([fallbackPayload]);
        }
        if (!insertRes.error) dbSuccess = true;
        else dbErrorMsg = insertRes.error.message;
      }
    } catch (dbErr: any) {
      dbErrorMsg = dbErr?.message || String(dbErr);
      console.warn("Supabase settings update issue:", dbErr);
    }

    // Always update local persistent fallback store
    saveSiteSettingsToLocalStore(body as SiteSettings);

    // Invalidate caches across public pages
    try {
      revalidatePath("/");
      revalidatePath("/about");
      revalidatePath("/products");
      revalidatePath("/services");
      revalidatePath("/enquiry");
      revalidatePath("/admin/settings");
    } catch {
      // Non-fatal if called without request store
    }

    return NextResponse.json({
      success: true,
      persisted_to_db: dbSuccess,
      db_warning: !dbSuccess ? dbErrorMsg : undefined,
      message: dbSuccess
        ? "Settings saved successfully in database!"
        : "Settings saved to local storage!",
    });
  } catch (err: unknown) {
    console.error("Failed to save settings:", err);
    return NextResponse.json(
      { error: "Failed to save settings." },
      { status: 500 }
    );
  }
}
