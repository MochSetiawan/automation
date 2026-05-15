import BottomNav from "@/components/BottomNav";
import Sidebar from "@/components/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#0b0f18] text-slate-100">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 px-6 py-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}