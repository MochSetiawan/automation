import { redirect } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import Sidebar from "@/components/Sidebar";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#0b0f18] text-slate-100 pb-20 lg:pb-0">
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
