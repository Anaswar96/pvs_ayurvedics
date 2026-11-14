import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    try {
      const supabase = createAdminClient();
      await supabase.from("newsletter_subscribers").insert([{ email: email.trim().toLowerCase() }]);
    } catch {
      // Ignore duplicate errors gracefully
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for subscribing to PVS Ayurvedics wellness updates!",
    });
  } catch {
    return NextResponse.json({ error: "Subscription failed." }, { status: 500 });
  }
}
