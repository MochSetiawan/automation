"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminMenu = [
  { label: "Plan", href: "/admin/plan" },
  { label: "Limit", href: "/admin/limit" },
  { label: "Usage", href: "/admin/usage" },
  { label: "Expiry", href: "/admin/expiry" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-slate-800 bg-[#0d1322] p-4 md:h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="mb-4">
        <div className="text-xs uppercase tracking-wide text-slate-500">
          Admin
        </div>
        <div className="text-lg font-semibold text-slate-100">Control</div>
      </div>

      <nav className="flex gap-2 md:flex-col">
        {adminMenu.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl border px-3 py-2 text-sm transition ${
                active
                  ? "border-sky-500/60 bg-sky-500/10 text-sky-200"
                  : "border-slate-800 bg-[#101827] text-slate-300 hover:border-slate-700"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
