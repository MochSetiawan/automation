"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const signIn = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setMsg(error.message);
    else router.push("/");
  };

  return (
    <div className="p-6 max-w-sm">
      <h1 className="text-xl font-bold">Login</h1>
      <input className="mt-4 w-full border p-2" placeholder="Email" onChange={e=>setEmail(e.target.value)} />
      <input className="mt-2 w-full border p-2" placeholder="Password" type="password" onChange={e=>setPassword(e.target.value)} />
      <button className="mt-4 w-full bg-black text-white p-2" onClick={signIn}>Login</button>
      <div className="mt-2 text-sm text-red-500">{msg}</div>
    </div>
  );
}