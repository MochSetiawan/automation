const calendar = [
  { day: "Mon", date: "06", slots: ["08:00", "13:00"] },
  { day: "Tue", date: "07", slots: ["08:00"] },
  { day: "Wed", date: "08", slots: ["13:00", "19:00"] },
  { day: "Thu", date: "09", slots: ["08:00"] },
  { day: "Fri", date: "10", slots: ["13:00"] },
  { day: "Sat", date: "11", slots: ["09:00"] },
  { day: "Sun", date: "12", slots: ["19:00"] },
];

export default function SchedulerPage() {
  return (
    <div className="px-6 py-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Scheduler</h1>
          <p className="text-sm text-slate-400">Calendar view for uploads.</p>
        </div>
        <button className="rounded-lg bg-gradient-to-r from-sky-400 to-blue-600 px-4 py-2 text-sm font-semibold text-[#06121c]">
          + Add Schedule
        </button>
      </header>

      {/* Calendar */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {calendar.map((c) => (
          <div
            key={c.day}
            className="rounded-xl border border-slate-800 bg-[#121826] p-4"
          >
            <div className="text-xs text-slate-400">{c.day}</div>
            <div className="text-2xl font-bold">{c.date}</div>
            <div className="mt-3 space-y-2">
              {c.slots.map((s, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-slate-800 bg-[#0e1422] px-3 py-1 text-xs text-slate-300"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}