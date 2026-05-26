import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { redirect } from "next/navigation";
import { BarChart3, TrendingUp, TrendingDown, Calendar, Download } from "lucide-react";

export default async function FinancialsPage() {
  const session = await auth();

  if (session?.user?.role === "VIEWER") {
    redirect("/portal");
  }

  const reports = await prisma.financialReport.findMany({
    orderBy: { createdAt: "desc" },
  });

  const latest = reports[0];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">
            Financial Reports
          </h1>
          <p className="text-slate-400">
            Internal financial performance & analytics
          </p>
        </div>
        <button className="btn-secondary px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2">
          <Download size={16} />
          Export Data
        </button>
      </div>

      {/* Latest Report Summary */}
      {latest && (
        <div className="glass rounded-2xl p-7 border border-amber-500/20 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="text-amber-400 text-sm font-semibold mb-1">
                Latest Report
              </div>
              <h2 className="text-white text-2xl font-black">{latest.title}</h2>
              <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm">
                <Calendar size={14} />
                <span>{formatDate(latest.createdAt)}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-xs font-semibold">
                  {latest.type}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="bg-slate-800/50 rounded-xl p-5">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                <TrendingUp size={16} className="text-emerald-400" />
                Total Assets
              </div>
              <div className="text-white text-2xl font-black">
                {formatCurrency(latest.totalAssets)}
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                <BarChart3 size={16} className="text-sky-400" />
                Total Revenue
              </div>
              <div className="text-white text-2xl font-black">
                {formatCurrency(latest.totalRevenue)}
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                <TrendingUp size={16} className="text-amber-400" />
                Net Income
              </div>
              <div className="text-white text-2xl font-black">
                {formatCurrency(latest.netIncome)}
              </div>
              <div className="text-emerald-400 text-sm mt-1">
                {((latest.netIncome / latest.totalRevenue) * 100).toFixed(1)}%
                margin
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Reports */}
      <div className="space-y-4">
        <h2 className="text-white font-bold text-lg">All Reports</h2>
        {reports.map((report) => {
          const margin = (
            (report.netIncome / report.totalRevenue) *
            100
          ).toFixed(1);
          const isPositive = report.netIncome > 0;
          return (
            <div
              key={report.id}
              className="bg-slate-900/50 rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <BarChart3 size={18} className="text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{report.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-slate-500 text-sm">
                        {report.period}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-xs">
                        {report.type}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">
                    {formatCurrency(report.totalRevenue)}
                  </div>
                  <div className="text-slate-500 text-xs">Revenue</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800">
                <div>
                  <div className="text-slate-500 text-xs mb-0.5">Assets</div>
                  <div className="text-white text-sm font-semibold">
                    {formatCurrency(report.totalAssets)}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 text-xs mb-0.5">Revenue</div>
                  <div className="text-white text-sm font-semibold">
                    {formatCurrency(report.totalRevenue)}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 text-xs mb-0.5">Net Income</div>
                  <div
                    className={`text-sm font-semibold ${
                      isPositive ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {formatCurrency(report.netIncome)}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 text-xs mb-0.5">Margin</div>
                  <div
                    className={`text-sm font-semibold flex items-center gap-1 ${
                      isPositive ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp size={13} />
                    ) : (
                      <TrendingDown size={13} />
                    )}
                    {margin}%
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
