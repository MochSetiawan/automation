"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { createClient } from "@/lib/supabase/browser";

const CHANNELS = [
  { id: "channel-1", name: "Channel 1", views: "420K", likes: "32K", comments: "1.2K", subs: "+1.1K", shares: "2.4K", lastUpload: "2h ago", status: "Healthy" },
  { id: "channel-2", name: "Channel 2", views: "290K", likes: "18K", comments: "900", subs: "+700", shares: "1.6K", lastUpload: "4h ago", status: "Healthy" },
  { id: "channel-3", name: "Channel 3", views: "180K", likes: "9K", comments: "400", subs: "+320", shares: "900", lastUpload: "6h ago", status: "Warning" },
  { id: "channel-4", name: "Channel 4", views: "260K", likes: "14K", comments: "700", subs: "+540", shares: "1.1K", lastUpload: "1d ago", status: "Warning" },
  { id: "channel-5", name: "Channel 5", views: "135K", likes: "6K", comments: "210", subs: "+190", shares: "540", lastUpload: "2d ago", status: "Idle" },
];

const chartData = [
  { day: "Mon", views: 30 },
  { day: "Tue", views: 45 },
  { day: "Wed", views: 38 },
  { day: "Thu", views: 52 },
  { day: "Fri", views: 61 },
  { day: "Sat", views: 49 },
  { day: "Sun", views: 70 },
];

const uploads = [
  {
    id: "up-1",
    title: "Shorts: Tips Editing Cepat",
    channel: "Channel 1",
    status: "Published",
    createdAt: "2026-05-17 09:40",
    link: "https://youtube.com",
  },
  {
    id: "up-2",
    title: "Tutorial Upload Automasi",
    channel: "Channel 2",
    status: "Processing",
    createdAt: "2026-05-17 08:05",
    link: "https://youtube.com",
  },
  {
    id: "up-3",
    title: "Shorts Viral: 3 Detik",
    channel: "Channel 3",
    status: "Scheduled",
    createdAt: "2026-05-16 22:30",
    link: "https://youtube.com",
  },
  {
    id: "up-4",
    title: "Review Growth Mingguan",
    channel: "Channel 4",
    status: "Failed",
    createdAt: "2026-05-16 19:10",
    link: "https://youtube.com",
  },
];

type Profile = {
  role?: "admin" | "member" | string | null;
};

const statusStyles: Record<string, string> = {
  Healthy: "bg-emerald-500/15 text-emerald-300",
  Warning: "bg-amber-500/15 text-amber-300",
  Idle: "bg-slate-500/15 text-slate-300",
};

const uploadStatusStyles: Record<string, string> = {
  Published: "bg-emerald-500/15 text-emerald-300",
  Processing: "bg-sky-500/15 text-sky-300",
  Scheduled: "bg-indigo-500/15 text-indigo-300",
  Failed: "bg-rose-500/15 text-rose-300",
};

const statsTrend = [
  { label: "Views", delta: "+12%", tone: "text-emerald-300" },
  { label: "Likes", delta: "+8%", tone: "text-emerald-300" },
  { label: "Comments", delta: "-3%", tone: "text-rose-300" },
  { label: "Subscribers", delta: "+6%", tone: "text-emerald-300" },
  { label: "Shares", delta: "+10%", tone: "text-emerald-300" },
];

export default function DashboardPage() {
  const [selectedId, setSelectedId] = useState(CHANNELS[0].id);
  const [loggingOut, setLoggingOut] = useState(false);
  const [role, setRole] = useState<Profile["role"]>(null);
  const channel = useMemo(
    () => CHANNELS.find((c) => c.id === selectedId) ?? CHANNELS[0],
    [selectedId]
  );

  const stats = [
    { label: "Views", value: channel.views },
    { label: "Likes", value: channel.likes },
    { label: "Comments", value: channel.comments },
    { label: "Subscribers", value: channel.subs },
    { label: "Shares", value: channel.shares },
  ];

  useEffect(() => {
    const loadRole = async () => {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userData.user.id)
        .maybeSingle();

      setRole(profile?.role ?? null);
    };

    void loadRole();
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="px-6 py-10">
      <header className="mb-8 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-slate-400">
              Monitoring Shorts • {channel.name}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://studio.youtube.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-100 transition hover:border-slate-500"
            >
              Lihat Dashboard YouTube
            </a>
            {role === "admin" ? (
              <a
                href="/admin"
                className="rounded-lg bg-sky-500/20 px-4 py-2 text-sm font-semibold text-sky-200 transition hover:bg-sky-500/30"
              >
                Admin
              </a>
            ) : null}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-100 hover:border-slate-500"
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <button className="group rounded-2xl border border-slate-800 bg-[#121826] p-4 text-left transition hover:-translate-y-0.5 hover:border-sky-500/60 hover:shadow-[0_12px_30px_rgba(56,189,248,0.15)]">
            <div className="text-xs text-slate-400">Quick Action</div>
            <div className="mt-1 text-lg font-semibold text-slate-100">
              Upload Video
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Mulai upload baru ke channel terpilih.
            </p>
            <div className="mt-3 text-xs font-semibold text-sky-300 group-hover:text-sky-200">
              + Upload Baru
            </div>
          </button>

          <button className="group rounded-2xl border border-slate-800 bg-[#121826] p-4 text-left transition hover:-translate-y-0.5 hover:border-emerald-500/60 hover:shadow-[0_12px_30px_rgba(16,185,129,0.15)]">
            <div className="text-xs text-slate-400">Quick Action</div>
            <div className="mt-1 text-lg font-semibold text-slate-100">
              Sync Analytics
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Tarik data terbaru dari YouTube Studio.
            </p>
            <div className="mt-3 text-xs font-semibold text-emerald-300 group-hover:text-emerald-200">
              Jalankan Sync
            </div>
          </button>

          <button className="group rounded-2xl border border-slate-800 bg-[#121826] p-4 text-left transition hover:-translate-y-0.5 hover:border-indigo-500/60 hover:shadow-[0_12px_30px_rgba(99,102,241,0.15)]">
            <div className="text-xs text-slate-400">Quick Action</div>
            <div className="mt-1 text-lg font-semibold text-slate-100">
              Connect Channel
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Hubungkan channel baru ke akun kamu.
            </p>
            <div className="mt-3 text-xs font-semibold text-indigo-300 group-hover:text-indigo-200">
              Tambah Channel
            </div>
          </button>
        </div>
      </header>

      <section className="mb-6 space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Channel Switcher</h2>
            <p className="text-xs text-slate-500">
              Pilih channel untuk melihat performa dan upload.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Channel aktif:</span>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-200">
              {channel.name}
            </span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {CHANNELS.map((c) => {
            const isActive = c.id === selectedId;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`rounded-2xl border p-4 text-left transition ${
                  isActive
                    ? "border-sky-500/60 bg-sky-500/10"
                    : "border-slate-800 bg-[#121826] hover:border-slate-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-100">
                      {c.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      Last upload {c.lastUpload}
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-[10px] ${
                      statusStyles[c.status] ?? "bg-slate-500/15 text-slate-300"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-slate-400">
                  <span>Views: {c.views}</span>
                  <span>Likes: {c.likes}</span>
                  <span>Subs: {c.subs}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => {
          const trend = statsTrend.find((t) => t.label === s.label);
          return (
            <div
              key={s.label}
              className="rounded-2xl border border-slate-800 bg-[#121826] p-4 transition hover:-translate-y-0.5 hover:border-slate-600"
            >
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400">{s.label}</div>
                {trend ? (
                  <span
                    className={`rounded-full bg-slate-800 px-2 py-0.5 text-[10px] ${
                      trend.tone
                    }`}
                  >
                    {trend.delta}
                  </span>
                ) : null}
              </div>
              <div className="mt-2 text-xl font-bold">{s.value}</div>
              <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800">
                <div
                  className="h-1.5 rounded-full bg-sky-400"
                  style={{ width: "70%" }}
                />
              </div>
              <div className="mt-2 text-[10px] text-slate-500">
                Update 7 hari terakhir
              </div>
            </div>
          );
        })}
      </section>

      <section className="mt-6 rounded-xl border border-slate-800 bg-[#121826] p-4">
        <div className="mb-3 font-semibold">Performance (7 Days)</div>
        <div className="h-56 w-full min-h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", color: "#e2e8f0" }} />
              <Line type="monotone" dataKey="views" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-slate-800 bg-[#121826] p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Upload History</h2>
            <p className="text-xs text-slate-500">
              Riwayat upload terakhir dari semua channel.
            </p>
          </div>
          <button className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-200 hover:border-slate-500">
            Lihat Semua
          </button>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-slate-800">
          <div className="grid grid-cols-12 gap-2 bg-[#0f1524] px-4 py-3 text-[11px] uppercase tracking-wide text-slate-500">
            <div className="col-span-5">Video</div>
            <div className="col-span-2">Channel</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Upload</div>
            <div className="col-span-1 text-right">Link</div>
          </div>
          <div className="divide-y divide-slate-800">
            {uploads.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 items-center gap-2 px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-900/40"
              >
                <div className="col-span-5">
                  <div className="font-medium text-slate-100">
                    {item.title}
                  </div>
                  <div className="text-xs text-slate-500">{item.id}</div>
                </div>
                <div className="col-span-2 text-xs text-slate-300">
                  {item.channel}
                </div>
                <div className="col-span-2">
                  <span
                    className={`rounded-full px-2 py-1 text-[10px] ${
                      uploadStatusStyles[item.status] ??
                      "bg-slate-500/15 text-slate-300"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="col-span-2 text-xs text-slate-400">
                  {item.createdAt}
                </div>
                <div className="col-span-1 text-right">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-sky-300 hover:text-sky-200"
                  >
                    View
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
