"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { label: "Dashboard", href: "/dashboard", icon: "🏠" },
  { label: "Uploads", href: "/uploads", icon: "⏫" },
  { label: "Analytics", href: "/analytics", icon: "📈" },
  { label: "Schedule", href: "/scheduler", icon: "🗓️" },
  { label: "Settings", href: "/settings", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-72 flex-col border-r border-slate-800 bg-[#0d1322] p-5 lg:flex">
      {/* Logo */}
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 text-lg font-bold text-[#06121c]">
          Y
        </div>
        <div>
          <div className="text-sm text-slate-400">YouTube Ops</div>
          <div className="text-lg font-semibold">Dashboard</div>
        </div>
      </div>

      {/* Menu */}
      <div className="space-y-2">
        {menu.map((m) => {
          const active = pathname === m.href;
          return (
            <Link
              key={m.href}
              href={m.href}
              className={`group flex items-center gap-3 rounded-xl border px-3 py-2 text-sm transition ${
                active
                  ? "border-sky-500/60 bg-sky-500/10 text-sky-200 shadow-[0_0_18px_rgba(56,189,248,0.15)]"
                  : "border-slate-800 bg-[#101827] text-slate-300 hover:border-slate-700"
              }`}
            >
              <span className="text-lg">{m.icon}</span>
              {m.label}
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-auto rounded-xl border border-slate-800 bg-[#101827] p-3 text-xs text-slate-400">
        Version 1.0 • Desktop Sidebar
      </div>
    </aside>
  );
}