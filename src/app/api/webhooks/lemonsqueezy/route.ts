import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createHmac, timingSafeEqual } from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function verifySignature(rawBody: string, signature: string, secret: string): boolean {
  const hmac = createHmac("sha256", secret);
  const digest = hmac.update(rawBody).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-signature") ?? "";

  if (!verifySignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: { meta: { event_name: string; custom_data?: Record<string, string> }; data: { attributes: { user_email?: string; first_order_item?: { product_id?: number } } } };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventName = payload.meta?.event_name;
  if (eventName !== "order_created" && eventName !== "subscription_created") {
    return NextResponse.json({ ok: true });
  }

  const email = payload.data?.attributes?.user_email;
  if (!email) {
    return NextResponse.json({ error: "No email in payload" }, { status: 400 });
  }

  const { error } = await supabase
    .from("profiles")
    .update({ plan: "pro" })
    .eq("email", email);

  if (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
