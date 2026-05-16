import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { video_title, video_url, channel_name } = body as {
    video_title?: string;
    video_url?: string;
    channel_name?: string;
  };

  if (!video_title) {
    return NextResponse.json({ error: "video_title required" }, { status: 400 });
  }

  const { error } = await supabase.from("upload_logs").insert({
    user_id: userData.user.id,
    video_title,
    video_url: video_url ?? null,
    channel_name: channel_name ?? null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("upload_logs")
    .select("id, user_id, video_title, video_url, channel_name, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ logs: data ?? [] });
}
