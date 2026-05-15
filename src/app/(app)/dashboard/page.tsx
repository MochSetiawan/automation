"use client";

import { useMemo, useState } from "react";
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

export default function DashboardPage() {
  const [selectedId, setSelectedId] = useState(CHANNELS[0].id);
  const [loggingOut, setLoggingOut] = useState(false);
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

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="px-6 py-10">
      <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-slate-400">Monitoring Shorts • {channel.name}</p>
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-100 hover:border-slate-500"
        >
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </header>

      <div className="mb-6 flex gap-3">
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="rounded-lg border border-slate-800 bg-[#0e1422] px-3 py-2 text-sm text-slate-100 outline-none"
        >
          {CHANNELS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button className="rounded-lg bg-gradient-to-r from-sky-400 to-blue-600 px-4 py-2 text-sm font-semibold text-[#06121c]">
          + Upload Baru
        </button>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-800 bg-[#121826] p-4">
            <div className="text-xs text-slate-400">{s.label}</div>
            <div className="mt-2 text-xl font-bold">{s.value}</div>
          </div>
        ))}
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
    </div>
  );
}
