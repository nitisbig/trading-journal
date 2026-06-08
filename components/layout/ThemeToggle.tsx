"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/hooks/useTheme";
import { cn } from "@/lib/utils/cn";

/** Icon button that toggles between light and dark themes. */
export function ThemeToggle({
  collapsed = false,
  className,
}: {
  collapsed?: boolean;
  className?: string;
}) {
  const { theme, toggle } = useTheme();
  const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggle}
      title={label}
      aria-label={label}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink",
        collapsed && "justify-center px-0",
        className,
      )}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 shrink-0" />
      ) : (
        <Moon className="h-4 w-4 shrink-0" />
      )}
      {!collapsed && <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>}
    </button>
  );
}
