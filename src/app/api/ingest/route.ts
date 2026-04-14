import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface IngestPayload {
  model: string;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens?: number;
  costUSD: number;
  date: string;
  projectName?: string;
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing API key" }, { status: 401 });
  }

  const apiKey = authHeader.slice(7);

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", apiKey)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  }

  const userId = profile.id;

  let body: IngestPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.model || body.inputTokens == null || body.outputTokens == null || body.costUSD == null || !body.date) {
    return NextResponse.json(
      { error: "Missing required fields: model, inputTokens, outputTokens, costUSD, date" },
      { status: 400 }
    );
  }

  let projectId: string | null = null;
  if (body.projectName) {
    const { data: existing } = await supabase
      .from("projects")
      .select("id")
      .eq("user_id", userId)
      .eq("name", body.projectName)
      .single();

    if (existing) {
      projectId = existing.id;
    } else {
      const { data: created } = await supabase
        .from("projects")
        .insert({ user_id: userId, name: body.projectName })
        .select("id")
        .single();
      projectId = created?.id ?? null;
    }
  }

  const costCents = Math.round(body.costUSD * 100);

  const { error } = await supabase.from("sessions").insert({
    user_id: userId,
    project_id: projectId,
    model: body.model,
    input_tokens: body.inputTokens,
    output_tokens: body.outputTokens,
    cost_cents: costCents,
    duration_seconds: 0,
    started_at: body.date,
  });

  if (error) {
    return NextResponse.json({ error: "Failed to save session" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
