"use client";

import { useEffect, useMemo, useState } from "react";

type Member = {
  id: string;
  role: "admin" | "member" | string;
  channel_limit: number | null;
  plan?: "free" | "pro" | "business" | string | null;
  expires_at?: string | null;
  usage?: number | null;
};

const PLAN_OPTIONS = ["free", "pro", "business"];

type Mode = "plan" | "limit" | "usage" | "expiry";

type Props = {
  mode: Mode;
  title: string;
  description: string;
};

export default function AdminSection({ mode, title, description }: Props) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/members");
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to load members");
        setMembers([]);
      } else {
        setMembers(json.members || []);
      }
    } catch (err) {
      setError("Failed to load members");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    const t = setTimeout(() => setMounted(true), 20);
    return () => clearTimeout(t);
  }, []);

  const updateLimit = async (id: string, channel_limit: number) => {
    setError(null);
    const res = await fetch("/api/admin/members", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, channel_limit }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Failed to update limit");
    } else {
      await load();
    }
  };

  const now = useMemo(() => new Date(), []);

  const getUsagePercent = (
    usage: number | null | undefined,
    limit: number | null
  ) => {
    if (!limit || limit <= 0) return 0;
    const used = usage ?? 0;
    return Math.min(100, Math.round((used / limit) * 100));
  };

  const filteredMembers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) =>
      [m.id, m.role, m.plan].filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [members, query]);

  return (
    <div
      className={`space-y-6 transition-all duration-300 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="text-xs text-slate-400">
          {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by ID, role, or plan"
          className="w-full rounded-xl border border-slate-800 bg-[#0e1422] px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 sm:max-w-sm"
        />
        <div className="text-xs text-slate-500">
          {filteredMembers.length} / {members.length} members
        </div>
      </div>

      {error ? (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-6">
          {filteredMembers.map((member) => {
            const usagePercent = getUsagePercent(
              member.usage ?? 0,
              member.channel_limit
            );
            const expiresAt = member.expires_at
              ? new Date(member.expires_at)
              : null;
            const isExpired = expiresAt ? expiresAt < now : false;

            return (
              <div
                key={member.id}
                className="rounded-2xl border border-slate-800 bg-[#0f1524] p-5 shadow-[0_0_30px_rgba(15,23,42,0.3)] transition hover:border-slate-600"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-2">
                    <div className="text-xs text-slate-500">User ID</div>
                    <div className="font-mono text-xs break-all text-slate-200">
                      {member.id}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full bg-slate-800 px-2 py-1 text-slate-300">
                        Role: {member.role}
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 ${
                          isExpired
                            ? "bg-rose-500/15 text-rose-300"
                            : "bg-emerald-500/15 text-emerald-300"
                        }`}
                      >
                        {isExpired ? "Expired" : "Active"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {mode === "plan" ? (
                    <div className="rounded-xl border border-slate-800 bg-[#121826] p-4">
                      <div className="text-xs text-slate-400">Plan</div>
                      <select
                        className="mt-2 w-full rounded border border-slate-700 bg-[#0e1422] px-2 py-2 text-sm"
                        value={member.plan ?? "free"}
                        onChange={() => {
                          setError("Update plan: backend belum dibuat.");
                        }}
                      >
                        {PLAN_OPTIONS.map((plan) => (
                          <option key={plan} value={plan}>
                            {plan}
                          </option>
                        ))}
                      </select>
                      <div className="mt-2 text-[10px] text-slate-500">
                        Backend segera dibuat
                      </div>
                    </div>
                  ) : null}

                  {mode === "limit" ? (
                    <div className="rounded-xl border border-slate-800 bg-[#121826] p-4">
                      <div className="text-xs text-slate-400">Channel Limit</div>
                      <select
                        value={member.channel_limit ?? 1}
                        onChange={(event) =>
                          updateLimit(member.id, Number(event.target.value))
                        }
                        className="mt-2 w-full rounded border border-slate-700 bg-[#0e1422] px-2 py-2 text-sm"
                      >
                        {Array.from({ length: 20 }).map((_, index) => (
                          <option key={index + 1} value={index + 1}>
                            {index + 1}
                          </option>
                        ))}
                      </select>
                      <div className="mt-2 text-[10px] text-slate-500">
                        Update langsung ke DB
                      </div>
                    </div>
                  ) : null}

                  {mode === "usage" ? (
                    <div className="rounded-xl border border-slate-800 bg-[#121826] p-4">
                      <div className="text-xs text-slate-400">Usage</div>
                      <div className="mt-3 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-2 rounded-full bg-emerald-400 transition-all"
                          style={{ width: `${usagePercent}%` }}
                        />
                      </div>
                      <div className="mt-2 text-xs text-slate-400">
                        {(member.usage ?? 0).toString()} / {member.channel_limit ?? "-"}
                      </div>
                    </div>
                  ) : null}

                  {mode === "expiry" ? (
                    <div className="rounded-xl border border-slate-800 bg-[#121826] p-4">
                      <div className="text-xs text-slate-400">Expires At</div>
                      <input
                        type="date"
                        className="mt-2 w-full rounded border border-slate-700 bg-[#0e1422] px-2 py-2 text-sm"
                        value={member.expires_at?.slice(0, 10) ?? ""}
                        onChange={() => {
                          setError("Update expiry: backend belum dibuat.");
                        }}
                      />
                      <div className="mt-2 text-[10px] text-slate-500">
                        Backend segera dibuat
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
