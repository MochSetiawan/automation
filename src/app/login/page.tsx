"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { useRouter, useSearchParams } from "next/navigation";

const EXPIRED_MESSAGES = [
  "Masa langganan kamu sudah habis, segera perbarui agar bisa lanjut menggunakan layanan.",
  "Akun kamu sudah expired. Silakan perpanjang paket untuk kembali akses semua fitur.",
  "Langganan berakhir. Upgrade atau perpanjang paketmu untuk mengaktifkan kembali akun.",
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const expired = searchParams?.get("expired");
    if (expired === "1") {
      setMsg(EXPIRED_MESSAGES[0]);
    }
  }, [searchParams]);

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
      {msg ? (
        <div className="mt-3 rounded border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          <div className="font-semibold">Info Langganan</div>
          <div className="mt-1 text-xs text-amber-100">{msg}</div>
          <div className="mt-2 text-[11px] text-amber-200/80">
            Jika butuh bantuan, hubungi admin untuk perpanjang paket.
          </div>
        </div>
      ) : null}
      <input
        className="mt-4 w-full border p-2"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="mt-2 w-full border p-2"
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="mt-4 w-full bg-black text-white p-2" onClick={signIn}>
        Login
      </button>
      <div className="mt-2 text-sm text-red-500"></div>
    </div>
  );
}
