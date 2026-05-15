"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TestSupabasePage() {
  const [msg, setMsg] = useState("");

  const signIn = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/test-supabase`,
    },
  });

  if (error) setMsg(error.message);
};

  const insertChannel = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      setMsg("Belum login. Login dulu.");
      return;
    }

    const { error } = await supabase.from("channels").insert({
      user_id: user.id,
      name: "Channel Test",
    });

    if (error) setMsg(error.message);
    else setMsg("✅ Insert sukses");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Test Supabase</h1>

      <div className="mt-4 space-x-2">
        <button
          onClick={signIn}
          className="rounded bg-sky-500 px-3 py-2 text-sm"
        >
          Login Google
        </button>
        <button
          onClick={insertChannel}
          className="rounded bg-emerald-500 px-3 py-2 text-sm"
        >
          Insert Channel
        </button>
      </div>

      <div className="mt-4 text-sm text-slate-300">{msg}</div>
    </div>
  );
}