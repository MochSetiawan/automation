import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, role, channel_limit, plan, expires_at, usage");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ members: data ?? [] });
}

export async function PATCH(req: Request) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { id, channel_limit, plan, expires_at, usage } = body as {
    id?: string;
    channel_limit?: number;
    plan?: "pro" | "business" | string | null;
    expires_at?: string | null;
    usage?: number | null;
  };

  if (!id) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const update: Record<string, unknown> = {};
  if (typeof channel_limit === "number") update.channel_limit = channel_limit;
  if (typeof plan === "string" || plan === null) update.plan = plan;
  if (typeof expires_at === "string" || expires_at === null) {
    update.expires_at = expires_at;
  }
  if (typeof usage === "number" || usage === null) update.usage = usage;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "no updates" }, { status: 400 });
  }

  const { error } = await supabase.from("profiles").update(update).eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from("admin_audit_logs").insert({
    admin_id: userData.user.id,
    target_user_id: id,
    action: "update_profile",
    meta: update,
  });

  return NextResponse.json({ ok: true });
}
