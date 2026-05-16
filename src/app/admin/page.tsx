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

export default function AdminPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const totalMembers = members.length;
  const totalAdmins = members.filter((m) => m.role === "admin").length;
  const totalPro = members.filter((m) => m.plan === "pro").length;
  const totalBusiness = members.filter((m) => m.plan === "business").length;

  const now = useMemo(() => new Date(), []);

  const getUsagePercent = (usage: number | null | undefined, limit: number | null) => {
    if (!limit || limit <= 0) return 0;
    const used = usage ?? 0;
    return Math.min(100, Math.round((used / limit) * 100));
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">
          Kelola paket, limit channel, expiry, dan usage member.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-[#121826] p-4">
          <div className="text-xs text-slate-400">Total Members</div>
          <div className="mt-2 text-2xl font-bold text-slate-100">
            {totalMembers}
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-[#121826] p-4">
          <div className="text-xs text-slate-400">Admins</div>
          <div className="mt-2 text-2xl font-bold text-slate-100">
            {totalAdmins}
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-[#121826] p-4">
          <div className="text-xs text-slate-400">Pro Plans</div>
          <div className="mt-2 text-2xl font-bold text-slate-100">
            {totalPro}
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-[#121826] p-4">
          <div className="text-xs text-slate-400">Business Plans</div>
          <div className="mt-2 text-2xl font-bold text-slate-100">
            {totalBusiness}
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-4">
          {members.map((member) => {
            const usagePercent = getUsagePercent(
              member.usage ?? 0,
              member.channel_limit
            );
            const expiresAt = member.expires_at ? new Date(member.expires_at) : null;
            const isExpired = expiresAt ? expiresAt < now : false;

            return (
              <div
                key={member.id}
                className="rounded-xl border border-slate-800 bg-[#121826] p-4"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-1">
                    <div className="text-xs text-slate-500">User ID</div>
                    <div className="font-mono text-xs break-all text-slate-200">
                      {member.id}
                    </div>
                    <div className="text-sm text-slate-300">
                      Role: <span className="font-semibold">{member.role}</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Status: {isExpired ? "Expired" : "Active"}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
                    <div>
                      <label className="text-xs text-slate-400">Plan</label>
                      <select
                        className="mt-1 w-full rounded border border-slate-700 bg-[#0e1422] px-2 py-1 text-sm"
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
                      <div className="mt-1 text-[10px] text-slate-500">
                        Backend segera dibuat
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-400">Channel limit</label>
                      <select
                        value={member.channel_limit ?? 1}
                        onChange={(event) =>
                          updateLimit(member.id, Number(event.target.value))
                        }
                        className="mt-1 w-full rounded border border-slate-700 bg-[#0e1422] px-2 py-1 text-sm"
                      >
                        {Array.from({ length: 20 }).map((_, index) => (
                          <option key={index + 1} value={index + 1}>
                            {index + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-slate-400">Usage</label>
                      <div className="mt-2 h-2 w-full rounded-full bg-slate-800">
                        <div
                          className="h-2 rounded-full bg-emerald-400"
                          style={{ width: `${usagePercent}%` }}
                        />
                      </div>
                      <div className="mt-1 text-xs text-slate-400">
                        {(member.usage ?? 0).toString()} / {member.channel_limit ?? "-"}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-400">Expires at</label>
                      <input
                        type="date"
                        className="mt-1 w-full rounded border border-slate-700 bg-[#0e1422] px-2 py-1 text-sm"
                        value={member.expires_at?.slice(0, 10) ?? ""}
                        onChange={() => {
                          setError("Update expiry: backend belum dibuat.");
                        }}
                      />
                      <div className="mt-1 text-[10px] text-slate-500">
                        Backend segera dibuat
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
