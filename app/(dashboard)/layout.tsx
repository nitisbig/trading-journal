import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileTopBar } from "@/components/layout/MobileTopBar";
import { BottomNav } from "@/components/layout/BottomNav";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <MobileTopBar />
        {/* pb clears the fixed bottom nav on mobile */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
