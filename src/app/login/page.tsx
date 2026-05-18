"use client";

import { useMemo, useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const expiredMessage = useMemo(() => EXPIRED_MESSAGES[0], []);

  useMemo(() => {
    const expired = searchParams?.get("expired");
    if (expired === "1") {
      setMsg(expiredMessage);
    }
  }, [searchParams, expiredMessage]);

  const signIn = async () => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMsg(error.message);
      setLoading(false);
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      router.push("/");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0f18] text-slate-100 flex items-center justify-center p-6">
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-sky-500/30 via-indigo-500/30 to-emerald-500/30 blur-xl" />
        <div className="relative rounded-3xl border border-slate-800 bg-[#0f1524]/80 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600" />
            <h1 className="text-2xl font-bold">Login</h1>
            <p className="text-sm text-slate-400">
              Masuk untuk mengelola akun dan upload kamu.
            </p>
          </div>

          {msg ? (
            <div className="mb-5 rounded-2xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              <div className="font-semibold text-amber-200">Info Langganan</div>
              <div className="mt-1 text-xs text-amber-100/90">{msg}</div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-amber-200/80">
                <span>Butuh bantuan? Hubungi admin untuk perpanjang.</span>
                <button
                  type="button"
                  className="rounded-full border border-amber-300/40 px-3 py-1 text-[11px] font-semibold text-amber-200 transition hover:border-amber-200 hover:bg-amber-400/10"
                >
                  Hubungi admin
                </button>
              </div>
            </div>
          ) : null}

          <div className="space-y-4">
            <label className="block text-xs text-slate-400">Email</label>
            <div className="relative">
              <input
                className="w-full rounded-xl border border-slate-700 bg-[#0b1220] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                placeholder="you@email.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <label className="block text-xs text-slate-400">Password</label>
            <div className="relative">
              <input
                className="w-full rounded-xl border border-slate-700 bg-[#0b1220] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                placeholder="••••••••"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 px-4 py-3 text-sm font-semibold text-[#06121c] shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5 hover:shadow-sky-500/40 disabled:cursor-not-allowed disabled:opacity-70"
            onClick={signIn}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="mt-6 text-center text-xs text-slate-500">
            Dengan login, kamu setuju dengan ketentuan layanan.
          </div>
        </div>
      </div>
    </div>
  );
}
