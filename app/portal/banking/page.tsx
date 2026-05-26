import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { redirect } from "next/navigation";
import { CreditCard, Shield, Building2, Activity, DollarSign, Globe } from "lucide-react";

const accountTypeColors: Record<string, string> = {
  Checking: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  Investment: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Savings: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export default async function BankingPage() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "EXECUTIVE") {
    redirect("/portal");
  }

  const accounts = await prisma.bankingAccount.findMany({
    orderBy: { balance: "desc" },
  });

  const totalBalance = accounts
    .filter((a) => a.currency === "USD")
    .reduce((sum, a) => sum + a.balance, 0);

  const eurBalance = accounts
    .filter((a) => a.currency === "EUR")
    .reduce((sum, a) => sum + a.balance, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold mb-1">
            <Shield size={14} />
            <span>Restricted Access</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-1">
            Banking Accounts
          </h1>
          <p className="text-slate-400">Confidential financial accounts overview</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-xl">
          <Shield size={14} className="text-amber-400" />
          <span className="text-amber-400 text-sm font-semibold">
            {session?.user?.role} Access
          </span>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        <div className="glass rounded-2xl p-5 border border-emerald-500/20">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
            <DollarSign size={15} className="text-emerald-400" />
            Total USD Balance
          </div>
          <div className="text-white text-3xl font-black">
            {formatCurrency(totalBalance)}
          </div>
          <div className="text-emerald-400 text-xs mt-1">Across all USD accounts</div>
        </div>
        <div className="glass rounded-2xl p-5 border border-sky-500/20">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
            <Globe size={15} className="text-sky-400" />
            EUR Balance
          </div>
          <div className="text-white text-3xl font-black">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "EUR",
              notation: "compact",
            }).format(eurBalance)}
          </div>
          <div className="text-sky-400 text-xs mt-1">European operations</div>
        </div>
        <div className="glass rounded-2xl p-5 border border-amber-500/20">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
            <Activity size={15} className="text-amber-400" />
            Active Accounts
          </div>
          <div className="text-white text-3xl font-black">
            {accounts.filter((a) => a.isActive).length}
          </div>
          <div className="text-amber-400 text-xs mt-1">All institutions</div>
        </div>
      </div>

      {/* Accounts */}
      <div className="space-y-4">
        <h2 className="text-white font-bold text-lg">Account Details</h2>
        {accounts.map((account) => (
          <div
            key={account.id}
            className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <CreditCard size={20} className="text-amber-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold">{account.accountName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Building2 size={13} className="text-slate-500" />
                    <span className="text-slate-400 text-sm">{account.bankName}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded border ${
                        accountTypeColors[account.accountType] ||
                        "bg-slate-800 border-slate-700 text-slate-400"
                      }`}
                    >
                      {account.accountType}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white text-2xl font-black">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: account.currency,
                    notation: "compact",
                  }).format(account.balance)}
                </div>
                <div className="text-slate-500 text-xs mt-0.5">
                  {account.currency}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
              <div>
                <div className="text-slate-500 text-xs mb-1 flex items-center gap-1">
                  <Shield size={10} />
                  Account Number
                </div>
                <div className="text-white text-sm font-mono">{account.maskedNumber}</div>
              </div>
              {account.swiftCode && (
                <div>
                  <div className="text-slate-500 text-xs mb-1">SWIFT/BIC</div>
                  <div className="text-white text-sm font-mono">{account.swiftCode}</div>
                </div>
              )}
              {account.routingNumber && (
                <div>
                  <div className="text-slate-500 text-xs mb-1">Routing Number</div>
                  <div className="text-white text-sm font-mono">{account.routingNumber}</div>
                </div>
              )}
              <div>
                <div className="text-slate-500 text-xs mb-1">Status</div>
                <div className={`text-sm font-semibold ${account.isActive ? "text-emerald-400" : "text-red-400"}`}>
                  {account.isActive ? "● Active" : "● Inactive"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Security notice */}
      <div className="mt-8 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
        <div className="flex items-start gap-3">
          <Shield size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-amber-400 font-semibold text-sm mb-1">
              Confidential Banking Information
            </div>
            <p className="text-slate-400 text-sm">
              This information is strictly confidential and restricted to ADMIN
              and EXECUTIVE roles. All access is logged for compliance and
              audit purposes. Unauthorized disclosure is prohibited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
