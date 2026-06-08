import {
  LayoutDashboard,
  ListOrdered,
  Wallet,
  Wrench,
  User,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

/** Primary navigation shown in the sidebar (in order). */
export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Trades", href: "/trades", icon: ListOrdered },
  { label: "Account", href: "/account", icon: Wallet },
  { label: "Tools", href: "/tools", icon: Wrench },
  { label: "User", href: "/user", icon: User },
];

/** Pinned lower in the sidebar, separated from the main nav. */
export const NAV_FOOTER_ITEMS: NavItem[] = [
  { label: "Settings", href: "/settings", icon: Settings },
];
