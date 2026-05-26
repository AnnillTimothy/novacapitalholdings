import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  TrendingUp,
  Building2,
  FileText,
  Users,
  CreditCard,
  BarChart3,
  Activity,
  Shield,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default async function PortalDashboard() {
  const session = await auth();

  const [
    totalUsers,
    totalDocuments,
    totalPortfolio,
    totalReports,
    totalBanking,
    recentDocuments,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.document.count(),
    prisma.portfolioCompany.findMany({ where: { status: "Active" } }),
    prisma.financialReport.count(),
    prisma.bankingAccount.findMany({ where: { isActive: true } }),
    prisma.document.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { uploader: { select: { name: true } } },
    }),
  ]);

  const totalAUM = totalBanking.reduce((sum, a) => sum + a.balance, 0);
  const totalPortfolioValue = totalPortfolio.reduce((sum, c) => sum + c.valuation, 0);

  const isAdmin = session?.user?.role === "ADMIN";
  const isExecOrAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "EXECUTIVE";

  const stats = [
    {
      label: "Portfolio Value",
      value: formatCurrency(totalPortfolioValue),
      icon: TrendingUp,
      color: "amber",
      change: "+18.4%",
      link: null,
    },
    ...(isExecOrAdmin
      ? [
          {
            label: "Banking Balance",
            value: formatCurrency(totalAUM),
            icon: CreditCard,
            color: "emerald",
            change: "4 accounts",
            link: "/portal/banking",
          },
        ]
      : []),
    {
      label: "Portfolio Companies",
      value: totalPortfolio.length.toString(),
      icon: Building2,
      color: "sky",
      change: "Active",
      link: null,
    },
    {
      label: "Documents",
      value: totalDocuments.toString(),
      icon: FileText,
      color: "violet",
      change: "All categories",
      link: "/portal/documents",
    },
    {
      label: "Financial Reports",
      value: totalReports.toString(),
      icon: BarChart3,
      color: "orange",
      change: "Latest: Q4 2024",
      link: "/portal/financials",
    },
    ...(isAdmin
      ? [
          {
            label: "Team Members",
            value: totalUsers.toString(),
            icon: Users,
            color: "red",
            change: "Active users",
            link: "/portal/users",
          },
        ]
      : []),
  ];

  const colorMap: Record<string, { bg: string; text: string; icon: string }> = {
    amber: { bg: "bg-amber-500/10", text: "text-amber-400", icon: "bg-amber-500" },
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", icon: "bg-emerald-500" },
    sky: { bg: "bg-sky-500/10", text: "text-sky-400", icon: "bg-sky-500" },
    violet: { bg: "bg-violet-500/10", text: "text-violet-400", icon: "bg-violet-500" },
    orange: { bg: "bg-orange-500/10", text: "text-orange-400", icon: "bg-orange-500" },
    red: { bg: "bg-red-500/10", text: "text-red-400", icon: "bg-red-500" },
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold mb-2">
          <Activity size={14} />
          <span>Live Dashboard</span>
        </div>
        <h1 className="text-3xl font-black text-white mb-1">
          Welcome back, {session?.user?.name?.split(" ")[0]}
        </h1>
        <p className="text-slate-400">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          const colors = colorMap[stat.color];
          const content = (
            <div
              key={i}
              className={`${colors.bg} rounded-2xl p-5 border border-slate-700/50 relative overflow-hidden group transition-all duration-300 ${
                stat.link ? "cursor-pointer hover:border-amber-500/30" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-xl ${colors.icon} bg-opacity-20 flex items-center justify-center`}
                >
                  <Icon size={18} className="text-white" />
                </div>
                <div
                  className={`text-xs px-2 py-1 rounded-full ${colors.bg} ${colors.text} border border-current border-opacity-30`}
                >
                  {stat.change}
                </div>
              </div>
              <div className="text-white text-2xl font-black mb-1">
                {stat.value}
              </div>
              <div className="text-slate-500 text-sm">{stat.label}</div>
            </div>
          );

          return stat.link ? (
            <Link href={stat.link} key={i}>
              {content}
            </Link>
          ) : (
            content
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Documents */}
        <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-bold flex items-center gap-2">
              <FileText size={16} className="text-amber-400" />
              Recent Documents
            </h2>
            <Link
              href="/portal/documents"
              className="text-amber-400 text-xs hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {recentDocuments.length > 0 ? (
              recentDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-start justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-all"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FileText size={14} className="text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-white text-sm font-medium truncate">
                        {doc.title}
                      </div>
                      <div className="text-slate-500 text-xs">
                        {doc.category} · {doc.uploader.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0 ml-3">
                    {doc.isConfidential && (
                      <div className="flex items-center gap-1 text-xs text-amber-400">
                        <Shield size={10} />
                        <span>Conf.</span>
                      </div>
                    )}
                    <div className="text-slate-600 text-xs flex items-center gap-1">
                      <Clock size={10} />
                      {formatDate(doc.createdAt)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-500 py-6 text-sm">
                No documents yet
              </div>
            )}
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-bold flex items-center gap-2">
              <Building2 size={16} className="text-amber-400" />
              Portfolio Overview
            </h2>
          </div>
          <div className="space-y-3">
            {totalPortfolio.slice(0, 5).map((company) => {
              const roi = ((company.valuation / company.invested - 1) * 100).toFixed(0);
              return (
                <div
                  key={company.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                      <span className="text-amber-400 font-bold text-xs">
                        {company.ticker?.slice(0, 2) || company.name.slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">
                        {company.name}
                      </div>
                      <div className="text-slate-500 text-xs">{company.sector}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white text-sm font-bold">
                      {formatCurrency(company.valuation)}
                    </div>
                    <div className="text-emerald-400 text-xs font-semibold">
                      +{roi}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Role notice */}
      <div className="mt-6 p-4 rounded-xl border border-slate-700/50 bg-slate-900/30 flex items-center gap-3">
        <Shield size={16} className="text-amber-400 flex-shrink-0" />
        <p className="text-slate-400 text-sm">
          You are logged in as{" "}
          <span className="text-amber-400 font-semibold">{session?.user?.name}</span>{" "}
          with{" "}
          <span className="text-amber-400 font-semibold">{session?.user?.role}</span>{" "}
          access. Some sections may be restricted based on your role.
        </p>
      </div>
    </div>
  );
}
