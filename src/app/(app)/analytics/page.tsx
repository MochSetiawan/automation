"use client";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const viewsData = [
  { day: "Mon", views: 30, likes: 12, subs: 5 },
  { day: "Tue", views: 45, likes: 20, subs: 7 },
  { day: "Wed", views: 38, likes: 15, subs: 6 },
  { day: "Thu", views: 52, likes: 23, subs: 10 },
  { day: "Fri", views: 61, likes: 28, subs: 12 },
  { day: "Sat", views: 49, likes: 19, subs: 9 },
  { day: "Sun", views: 70, likes: 30, subs: 14 },
];

const shortsData = [
  { day: "Mon", shorts: 2 },
  { day: "Tue", shorts: 1 },
  { day: "Wed", shorts: 3 },
  { day: "Thu", shorts: 2 },
  { day: "Fri", shorts: 4 },
  { day: "Sat", shorts: 1 },
  { day: "Sun", shorts: 5 },
];

const stats = [
  { label: "Total Views", value: "1.9M", delta: "+8.2%" },
  { label: "Avg Watch Time", value: "00:41", delta: "+3.1%" },
  { label: "Engagement", value: "6.4%", delta: "+1.4%" },
  { label: "New Subs", value: "+2.1K", delta: "+12.6%" },
];

export default function AnalyticsPage() {
  return (
    <div className="px-6 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-slate-400">
          Performance overview across all channels.
        </p>
      </header>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-slate-800 bg-[#121826] p-4"
          >
            <div className="text-xs text-slate-400">{s.label}</div>
            <div className="mt-2 text-2xl font-bold">{s.value}</div>
            <div className="mt-1 text-xs text-emerald-300">{s.delta}</div>
          </div>
        ))}
      </section>

      {/* Charts */}
      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-[#121826] p-4">
          <div className="mb-3 font-semibold">Views • Likes • Subs (7 Days)</div>
          <div className="h-60 w-full min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={viewsData}>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid #1e293b",
                    color: "#e2e8f0",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="views" stroke="#38bdf8" strokeWidth={3} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="likes" stroke="#f472b6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="subs" stroke="#34d399" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#121826] p-4">
          <div className="mb-3 font-semibold">Shorts Uploaded</div>
          <div className="h-60 w-full min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shortsData}>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid #1e293b",
                    color: "#e2e8f0",
                  }}
                />
                <Bar dataKey="shorts" fill="#22d3ee" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}