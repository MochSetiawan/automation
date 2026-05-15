"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(false);
  const [autoUpload, setAutoUpload] = useState(true);

  const Toggle = ({
    enabled,
    onToggle,
  }: {
    enabled: boolean;
    onToggle: () => void;
  }) => (
    <button
      onClick={onToggle}
      className={`relative h-6 w-11 rounded-full transition ${
        enabled ? "bg-emerald-400" : "bg-slate-600"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
          enabled ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );

  return (
    <div className="px-6 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-slate-400">
          Manage preferences and integrations.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-[#121826] p-4">
          <div className="mb-2 font-semibold">Channel Preferences</div>
          <div className="text-sm text-slate-400">
            Default upload channel, thumbnail style, and tags.
          </div>
          <button className="mt-3 rounded-lg border border-slate-700 px-3 py-2 text-sm">
            Configure
          </button>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#121826] p-4">
          <div className="mb-2 font-semibold">Integrations</div>
          <div className="text-sm text-slate-400">
            Connect YouTube API, Google Drive, and automation tools.
          </div>
          <button className="mt-3 rounded-lg border border-slate-700 px-3 py-2 text-sm">
            Manage
          </button>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-slate-800 bg-[#121826] p-4">
        <div className="mb-4 font-semibold">Notifications</div>

        <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-[#0e1422] px-3 py-2">
          <span>Email alerts</span>
          <Toggle enabled={emailAlerts} onToggle={() => setEmailAlerts(!emailAlerts)} />
        </div>

        <div className="mt-3 flex items-center justify-between rounded-lg border border-slate-800 bg-[#0e1422] px-3 py-2">
          <span>Slack alerts</span>
          <Toggle enabled={slackAlerts} onToggle={() => setSlackAlerts(!slackAlerts)} />
        </div>

        <div className="mt-3 flex items-center justify-between rounded-lg border border-slate-800 bg-[#0e1422] px-3 py-2">
          <span>Auto Upload</span>
          <Toggle enabled={autoUpload} onToggle={() => setAutoUpload(!autoUpload)} />
        </div>
      </section>
    </div>
  );
}