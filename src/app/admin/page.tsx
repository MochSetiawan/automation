"use client";

import { useEffect, useState } from "react";

type Member = {
  id: string;
  role: "admin" | "member";
  channel_limit: number | null;
};

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

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">
          Manage member roles and channel limits.
        </p>
      </div>

      {error ? (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-2">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex flex-col gap-2 rounded border p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="font-mono text-xs break-all">{member.id}</div>
                <div className="text-sm">Role: {member.role}</div>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm">Channel limit</label>
                <select
                  value={member.channel_limit ?? 1}
                  onChange={(event) =>
                    updateLimit(member.id, Number(event.target.value))
                  }
                  className="rounded border px-2 py-1"
                >
                  {Array.from({ length: 10 }).map((_, index) => (
                    <option key={index + 1} value={index + 1}>
                      {index + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
