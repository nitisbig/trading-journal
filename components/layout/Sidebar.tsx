"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, TrendingUp } from "lucide-react";
import { NAV_ITEMS, NAV_FOOTER_ITEMS, type NavItem } from "@/constants/nav";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-surface-muted text-ink"
          : "text-ink-muted hover:bg-surface-muted hover:text-ink",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{item.label}</span>
    </Link>
  );
}

/** Left navigation rail: brand, Add Trade CTA, primary nav, pinned Settings. */
export function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col gap-6 border-r border-border bg-surface px-4 py-5">
      <div className="flex items-center gap-2 px-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
          <TrendingUp className="h-4 w-4" />
        </span>
        <span className="text-sm font-semibold text-ink">Journal</span>
      </div>

      <Button className="w-full">
        <Plus className="h-4 w-4" />
        Add Trade
      </Button>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} item={item} active={isActive(item.href)} />
        ))}
      </nav>

      <nav className="flex flex-col gap-1 border-t border-border pt-3">
        {NAV_FOOTER_ITEMS.map((item) => (
          <NavLink key={item.href} item={item} active={isActive(item.href)} />
        ))}
      </nav>
    </aside>
  );
}
