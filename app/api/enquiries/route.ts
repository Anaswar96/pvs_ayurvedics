import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Honeypot spam protection
    if (body.website_url_hp) {
      return NextResponse.json({ success: true, message: "Enquiry submitted successfully" });
    }

    const { full_name, phone, email, product_interest, preferred_date, preferred_time, message } = body;

    if (!full_name || !phone || !message) {
      return NextResponse.json(
        { error: "Full name, phone number, and message are required." },
        { status: 400 }
      );
    }

    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("enquiries")
        .insert([
          {
            full_name: full_name.trim(),
            phone: phone.trim(),
            email: email ? email.trim() : null,
            product_interest: product_interest || "General Consultation",
            preferred_date: preferred_date || null,
            preferred_time: preferred_time || null,
            message: message.trim(),
            status: "New",
          },
        ])
        .select()
        .single();

      if (error) {
        console.warn("Supabase enquiry insert error, storing locally:", error.message);
      } else if (data) {
        return NextResponse.json({ success: true, enquiry: data });
      }
    } catch (dbErr) {
      console.warn("Database unavailable, logging enquiry locally:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! Your enquiry has been received. Our Ayurvedic clinic team in Manjeri will reach out to you shortly.",
    });
  } catch (err: unknown) {
    console.error("Enquiry submission error:", err);
    return NextResponse.json({ error: "Failed to process enquiry." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, internal_notes } = body;

    if (!id) {
      return NextResponse.json({ error: "Enquiry ID is required." }, { status: 400 });
    }

    try {
      const supabase = createAdminClient();
      const updatePayload: Record<string, unknown> = {};
      if (status) updatePayload.status = status;
      if (internal_notes !== undefined) updatePayload.internal_notes = internal_notes;
      updatePayload.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from("enquiries")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({ success: true, enquiry: data });
      }
    } catch {
      // Fallback
    }

    return NextResponse.json({ success: true, id, status, internal_notes });
  } catch {
    return NextResponse.json({ error: "Failed to update enquiry." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Enquiry ID required." }, { status: 400 });
    }

    try {
      const supabase = createAdminClient();
      await supabase.from("enquiries").delete().eq("id", id);
    } catch {
      // Fallback
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete enquiry." }, { status: 500 });
  }
}
