"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, TrendingUp, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { NAV_ITEMS, NAV_FOOTER_ITEMS, type NavItem } from "@/constants/nav";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils/cn";

function NavLink({
  item,
  active,
  collapsed,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        collapsed && "justify-center px-0",
        active
          ? "bg-surface-muted text-ink"
          : "text-ink-muted hover:bg-surface-muted hover:text-ink",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
}

/** Left navigation rail: brand, Add Trade CTA, primary nav, pinned Settings. Collapses to an icon-only rail. */
export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside
      className={cn(
        "hidden h-full shrink-0 flex-col gap-6 border-r border-border bg-surface px-4 py-5 transition-[width] duration-200 lg:flex",
        collapsed ? "w-16" : "w-60",
      )}
    >
      <div
        className={cn(
          "flex items-center px-2",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        {!collapsed && (
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
              <TrendingUp className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold text-ink">Journal</span>
          </div>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>
      </div>

      <Button className={cn("w-full", collapsed && "px-0")} title="Add Trade">
        <Plus className="h-4 w-4 shrink-0" />
        {!collapsed && "Add Trade"}
      </Button>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={isActive(item.href)}
            collapsed={collapsed}
          />
        ))}
      </nav>

      <nav className="flex flex-col gap-1 border-t border-border pt-3">
        <ThemeToggle collapsed={collapsed} />
        {NAV_FOOTER_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={isActive(item.href)}
            collapsed={collapsed}
          />
        ))}
      </nav>
    </aside>
  );
}
