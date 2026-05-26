"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  CreditCard,
  Users,
  LogOut,
  Globe,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/app/generated/prisma";

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role: UserRole;
  };
}

const navItems = [
  {
    href: "/portal",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN", "EXECUTIVE", "ANALYST", "VIEWER"],
  },
  {
    href: "/portal/documents",
    label: "Documents",
    icon: FileText,
    roles: ["ADMIN", "EXECUTIVE", "ANALYST", "VIEWER"],
  },
  {
    href: "/portal/financials",
    label: "Financials",
    icon: BarChart3,
    roles: ["ADMIN", "EXECUTIVE", "ANALYST"],
  },
  {
    href: "/portal/banking",
    label: "Banking",
    icon: CreditCard,
    roles: ["ADMIN", "EXECUTIVE"],
  },
  {
    href: "/portal/users",
    label: "User Management",
    icon: Users,
    roles: ["ADMIN"],
  },
];

const roleColors: Record<UserRole, string> = {
  ADMIN: "bg-red-500/20 text-red-400 border-red-500/30",
  EXECUTIVE: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  ANALYST: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  VIEWER: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

export default function PortalSidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/auth/login");
  };

  const accessibleItems = navItems.filter((item) =>
    item.roles.includes(user.role)
  );

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "??";

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-40">
      {/* Logo */}
      <div className="p-5 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
            <span className="text-slate-900 font-black text-sm">N</span>
          </div>
          <div>
            <div className="text-white font-bold text-sm">Nova Capital</div>
            <div className="text-amber-400 text-xs">Internal Portal</div>
          </div>
        </Link>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/30 to-amber-600/30 border border-amber-500/20 flex items-center justify-center">
            <span className="text-amber-400 font-bold text-sm">{initials}</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-white text-sm font-semibold truncate">
              {user.name || "User"}
            </div>
            <div className="text-slate-500 text-xs truncate">{user.email}</div>
          </div>
        </div>
        <div className="mt-3">
          <span
            className={cn(
              "text-xs px-2.5 py-1 rounded-full border font-semibold",
              roleColors[user.role]
            )}
          >
            {user.role}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="text-slate-600 text-xs font-semibold tracking-widest uppercase px-3 mb-3">
          Navigation
        </div>
        {accessibleItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/portal"
              ? pathname === "/portal"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                isActive
                  ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent"
              )}
            >
              <Icon size={17} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight size={14} className="opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div className="p-3 border-t border-slate-800 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all"
        >
          <Globe size={17} />
          Public Site
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
