import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { redirect } from "next/navigation";
import { Users, Shield, Mail, Calendar, Building2, Crown } from "lucide-react";
import type { UserRole } from "@/app/generated/prisma";

const roleStyles: Record<UserRole, string> = {
  ADMIN: "bg-red-500/15 text-red-400 border-red-500/30",
  EXECUTIVE: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  ANALYST: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  VIEWER: "bg-slate-500/15 text-slate-400 border-slate-500/30",
};

const roleIcons: Record<UserRole, string> = {
  ADMIN: "👑",
  EXECUTIVE: "💼",
  ANALYST: "📊",
  VIEWER: "👁️",
};

export default async function UsersPage() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/portal");
  }

  const users = await prisma.user.findMany({
    orderBy: [{ role: "asc" }, { name: "asc" }],
  });

  const roleCount = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-red-400 text-sm font-semibold mb-1">
            <Shield size={14} />
            <span>Admin Only</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-1">
            User Management
          </h1>
          <p className="text-slate-400">
            {users.length} team member{users.length !== 1 ? "s" : ""} registered
          </p>
        </div>
        <button className="btn-primary px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2">
          <Users size={16} />
          Invite User
        </button>
      </div>

      {/* Role breakdown */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {(["ADMIN", "EXECUTIVE", "ANALYST", "VIEWER"] as UserRole[]).map(
          (role) => (
            <div
              key={role}
              className={`rounded-xl p-4 border ${roleStyles[role]}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{roleIcons[role]}</span>
                <span className="font-semibold text-sm">{role}</span>
              </div>
              <div className="text-2xl font-black">{roleCount[role] || 0}</div>
            </div>
          )
        )}
      </div>

      {/* Users Table */}
      <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800">
          <h2 className="text-white font-bold flex items-center gap-2">
            <Users size={16} className="text-amber-400" />
            All Team Members
          </h2>
        </div>
        <div className="divide-y divide-slate-800">
          {users.map((user) => {
            const initials = user.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase() || "??";

            return (
              <div
                key={user.id}
                className="flex items-center justify-between p-5 hover:bg-slate-800/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-500/20 flex items-center justify-center">
                    <span className="text-amber-400 font-bold text-sm">
                      {initials}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">
                      {user.name || "Unnamed User"}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-slate-500 text-xs">
                        <Mail size={11} />
                        {user.email}
                      </span>
                      {user.department && (
                        <span className="flex items-center gap-1 text-slate-500 text-xs">
                          <Building2 size={11} />
                          {user.department}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right hidden md:block">
                    <div className="text-slate-500 text-xs flex items-center gap-1 justify-end">
                      <Calendar size={11} />
                      Joined {formatDate(user.createdAt)}
                    </div>
                  </div>
                  <span
                    className={`text-xs px-3 py-1.5 rounded-lg border font-semibold ${roleStyles[user.role]}`}
                  >
                    {roleIcons[user.role]} {user.role}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
