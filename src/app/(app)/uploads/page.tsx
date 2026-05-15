export default function UploadsPage() {
  const stats = [
    { label: "Queued", value: "12", color: "text-sky-300" },
    { label: "Uploading", value: "3", color: "text-amber-300" },
    { label: "Failed", value: "1", color: "text-rose-300" },
    { label: "Completed", value: "98", color: "text-emerald-300" },
  ];

  const uploads = [
    { title: "Shorts: AI Tip #1", channel: "Channel 1", status: "Uploading", time: "2m ago" },
    { title: "Shorts: Workflow Hack", channel: "Channel 2", status: "Queued", time: "10m ago" },
    { title: "Shorts: Morning Routine", channel: "Channel 4", status: "Failed", time: "30m ago" },
    { title: "Shorts: Daily Recap", channel: "Channel 3", status: "Completed", time: "1h ago" },
  ];

  const statusStyle = (status: string) => {
    if (status === "Completed") return "bg-emerald-400/10 text-emerald-300 border-emerald-400/40";
    if (status === "Uploading") return "bg-amber-400/10 text-amber-300 border-amber-400/40";
    if (status === "Failed") return "bg-rose-400/10 text-rose-300 border-rose-400/40";
    return "bg-sky-400/10 text-sky-300 border-sky-400/40";
  };

  return (
    <div className="px-6 py-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Uploads</h1>
          <p className="text-sm text-slate-400">Queue & status upload video.</p>
        </div>
        <button className="rounded-lg bg-gradient-to-r from-sky-400 to-blue-600 px-4 py-2 text-sm font-semibold text-[#06121c]">
          + New Upload
        </button>
      </header>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-800 bg-[#121826] p-4">
            <div className="text-xs text-slate-400">{s.label}</div>
            <div className={`mt-2 text-2xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </section>

      {/* Upload Queue */}
      <section className="mt-6 rounded-xl border border-slate-800 bg-[#121826] p-4">
        <div className="mb-3 font-semibold">Upload Queue</div>

        <div className="space-y-3">
          {uploads.map((u, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-[#0e1422] p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="font-medium">{u.title}</div>
                <div className="text-xs text-slate-400">{u.channel} • {u.time}</div>
              </div>
              <span className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle(u.status)}`}>
                {u.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* History Table */}
      <section className="mt-6 rounded-xl border border-slate-800 bg-[#121826] p-4">
        <div className="mb-3 font-semibold">Upload History</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="py-2">Title</th>
                <th className="py-2">Channel</th>
                <th className="py-2">Status</th>
                <th className="py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {uploads.map((u, i) => (
                <tr key={i} className="border-t border-slate-800">
                  <td className="py-2">{u.title}</td>
                  <td className="py-2">{u.channel}</td>
                  <td className="py-2">
                    <span className={`rounded-full border px-2 py-1 text-xs ${statusStyle(u.status)}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-2 text-slate-400">{u.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}