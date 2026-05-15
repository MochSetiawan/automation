"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  role: "admin" | "member" | string;
  channel_limit: number | null;
};

type Status = {
  userId: string | null;
  email: string | null;
  role: string | null;
  channelLimit: number | null;
  channelCount: number | null;
  canCreate: boolean | null;
};

export default function TestSupabasePage() {
  const [msg, setMsg] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>({
    userId: null,
    email: null,
    role: null,
    channelLimit: null,
    channelCount: null,
    canCreate: null,
  });

  const loadStatus = async () => {
    setLoading(true);
    setMsg("");

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setStatus({
        userId: null,
        email: null,
        role: null,
        channelLimit: null,
        channelCount: null,
        canCreate: null,
      });
      setLoading(false);
      return;
    }

    const profileRes = await supabase
      .from("profiles")
      .select("id, role, channel_limit")
      .eq("id", user.id)
      .single();

    const countRes = await supabase
      .from("channels")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    const canCreateRes = await supabase.rpc("can_create_channel", {
      uid: user.id,
    });

    const profile = profileRes.data as Profile | null;

    setStatus({
      userId: user.id,
      email: user.email ?? null,
      role: profile?.role ?? null,
      channelLimit: profile?.channel_limit ?? null,
      channelCount: countRes.count ?? null,
      canCreate: (canCreateRes.data as boolean | null) ?? null,
    });

    if (profileRes.error) setMsg(profileRes.error.message);
    if (countRes.error) setMsg(countRes.error.message);
    if (canCreateRes.error) setMsg(canCreateRes.error.message);

    setLoading(false);
  };

  useEffect(() => {
    void loadStatus();
  }, []);

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/test-supabase`,
      },
    });

    if (error) setMsg(error.message);
  };

  const signOut = async () => {
    setMsg("");
    await supabase.auth.signOut();
    await loadStatus();
  };

  const insertChannel = async () => {
    setMsg("");
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      setMsg("Belum login. Login dulu.");
      return;
    }

    const { error } = await supabase.from("channels").insert({
      user_id: user.id,
      name: `Channel Test ${new Date().toLocaleTimeString()}`,
    });

    if (error) setMsg(error.message);
    else setMsg("✅ Insert sukses");

    await loadStatus();
  };

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-xl font-bold">Test Supabase</h1>
        <p className="text-sm text-slate-400">
          Debug status login, profile, limit, dan insert channel.
        </p>
      </div>

      <div className="space-x-2">
        <button
          onClick={signIn}
          className="rounded bg-sky-500 px-3 py-2 text-sm"
        >
          Login Google
        </button>
        <button
          onClick={signOut}
          className="rounded bg-slate-700 px-3 py-2 text-sm"
        >
          Logout
        </button>
        <button
          onClick={loadStatus}
          className="rounded bg-indigo-500 px-3 py-2 text-sm"
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh Status"}
        </button>
        <button
          onClick={insertChannel}
          className="rounded bg-emerald-500 px-3 py-2 text-sm"
        >
          Insert Channel
        </button>
      </div>

      <div className="rounded border border-slate-800 bg-[#0e1422] p-4 text-sm space-y-1">
        <div>User ID: {status.userId ?? "-"}</div>
        <div>Email: {status.email ?? "-"}</div>
        <div>Role: {status.role ?? "-"}</div>
        <div>Channel limit: {status.channelLimit ?? "-"}</div>
        <div>Channel count: {status.channelCount ?? "-"}</div>
        <div>Can create: {String(status.canCreate ?? "-")}</div>
      </div>

      {msg ? <div className="text-sm text-amber-300">{msg}</div> : null}
    </div>
  );
}
