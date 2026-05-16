"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

type Member = {
  id: string;
  role: "admin" | "member" | string;
  expires_at?: string | null;
  plan?: string | null;
};

const adminMenu = [
  { label: "Plan", href: "/admin/plan", key: "plan" as const },
  { label: "Limit", href: "/admin/limit", key: "limit" as const },
  { label: "Usage", href: "/admin/usage", key: "usage" as const },
  { label: "Expiry", href: "/admin/expiry", key: "expiry" as const },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/members");
        const json = await res.json();
        if (res.ok) setMembers(json.members || []);
        else setMembers([]);
      } catch {
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const { totalMembers, expiredCount } = useMemo(() => {
    const now = new Date();
    const expired = members.filter((m) => {
      if (!m.expires_at) return false;
      return new Date(m.expires_at) < now;
    }).length;

    return {
      totalMembers: members.length,
      expiredCount: expired,
    };
  }, [members]);

  const badgeFor = (key: "plan" | "limit" | "usage" | "expiry") => {
    if (loading) return "…";
    if (key === "expiry") return expiredCount.toString();
    return totalMembers.toString();
  };

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
              className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm transition ${
                active
                  ? "border-sky-500/60 bg-sky-500/10 text-sky-200"
                  : "border-slate-800 bg-[#101827] text-slate-300 hover:border-slate-700"
              }`}
            >
              <span>{item.label}</span>
              <span className="ml-2 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                {badgeFor(item.key)}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
