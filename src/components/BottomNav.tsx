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

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-slate-800 bg-[#0f172a] py-3 text-xs lg:hidden">
      {menu.map((m) => {
        const active = pathname === m.href;
        return (
          <Link
            key={m.href}
            href={m.href}
            className={`flex flex-col items-center gap-1 ${
              active ? "text-sky-300" : "text-slate-400"
            }`}
          >
            <span className="text-lg">{m.icon}</span>
            {m.label}
          </Link>
        );
      })}
    </nav>
  );
}