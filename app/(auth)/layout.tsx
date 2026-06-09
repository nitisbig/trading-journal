import type { ReactNode } from "react";
import { TrendingUp } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-app px-4 py-10">
      <div className="mb-8 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
          <TrendingUp className="h-5 w-5" />
        </span>
        <span className="text-lg font-semibold text-ink">Trading Journal</span>
      </div>
      {children}
    </div>
  );
}
