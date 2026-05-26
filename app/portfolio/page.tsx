"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "@/components/public/Navigation";
import Footer from "@/components/public/Footer";
import { formatCurrency } from "@/lib/utils";
import { Building2, TrendingUp, Users, Globe, ExternalLink } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const companies = [
  {
    name: "NovaTech Systems",
    ticker: "NTS",
    sector: "Technology",
    description:
      "AI-powered enterprise software solutions revolutionizing how Fortune 500 companies manage operations, supply chains, and customer intelligence.",
    ownership: 67.5,
    valuation: 4200000000,
    invested: 850000000,
    status: "Active",
    employees: 2400,
    founded: 2018,
    headquarters: "San Francisco, CA",
    growth: "+142%",
    color: "amber",
  },
  {
    name: "Quantum Energy Corp",
    ticker: "QEC",
    sector: "Clean Energy",
    description:
      "Next-generation fusion and large-scale solar solutions, pioneering the transition to zero-carbon industrial energy with proprietary reactor technology.",
    ownership: 42.0,
    valuation: 8700000000,
    invested: 1200000000,
    status: "Active",
    employees: 5600,
    founded: 2015,
    headquarters: "Houston, TX",
    growth: "+89%",
    color: "sky",
  },
  {
    name: "BioNova Pharmaceuticals",
    ticker: "BNP",
    sector: "Healthcare",
    description:
      "Gene therapy and precision medicine platform developing personalized treatments for rare diseases and oncology with breakthrough clinical trial results.",
    ownership: 31.2,
    valuation: 3100000000,
    invested: 620000000,
    status: "Active",
    employees: 1800,
    founded: 2019,
    headquarters: "Boston, MA",
    growth: "+67%",
    color: "emerald",
  },
  {
    name: "MetaVerse Realty",
    ticker: "MVR",
    sector: "Real Estate",
    description:
      "Converging digital and physical real estate markets through blockchain-based property tokenization and immersive virtual property experiences.",
    ownership: 55.8,
    valuation: 1900000000,
    invested: 310000000,
    status: "Active",
    employees: 890,
    founded: 2021,
    headquarters: "Miami, FL",
    growth: "+215%",
    color: "violet",
  },
  {
    name: "Arctic Logistics",
    ticker: "ARL",
    sector: "Logistics",
    description:
      "Autonomous supply chain and last-mile delivery infrastructure operator, leveraging robotics and AI to reduce logistics costs by up to 40%.",
    ownership: 78.4,
    valuation: 2600000000,
    invested: 450000000,
    status: "Active",
    employees: 7200,
    founded: 2017,
    headquarters: "Chicago, IL",
    growth: "+54%",
    color: "orange",
  },
  {
    name: "DeepSea Mining Inc",
    ticker: "DSM",
    sector: "Resources",
    description:
      "Sustainable deep-sea mineral extraction targeting critical battery materials with proprietary low-impact technology, supporting the global energy transition.",
    ownership: 23.9,
    valuation: 950000000,
    invested: 180000000,
    status: "Developing",
    employees: 340,
    founded: 2022,
    headquarters: "Seattle, WA",
    growth: "+12%",
    color: "teal",
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  sky: { bg: "bg-sky-500/10", text: "text-sky-400", border: "border-sky-500/20" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/20" },
  orange: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20" },
  teal: { bg: "bg-teal-500/10", text: "text-teal-400", border: "border-teal-500/20" },
};

export default function PortfolioPage() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".portfolio-hero > *",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out", delay: 0.2 }
      );

      gsap.fromTo(
        ".company-card",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".companies-grid", start: "top 80%" },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  const totalValuation = companies.reduce((sum, c) => sum + c.valuation, 0);
  const totalInvested = companies.reduce((sum, c) => sum + c.invested, 0);

  return (
    <div className="animated-bg min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto portfolio-hero text-center">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-amber-400 border border-amber-500/30 mb-8">
            <Building2 size={14} />
            <span>Portfolio Companies</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
            Our <span className="gradient-text">Holdings</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
            Six high-conviction investments across transformative sectors, each
            positioned to deliver exceptional long-term value.
          </p>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="glass rounded-xl p-4 border border-slate-700/50">
              <div className="gradient-text text-2xl font-black">
                {formatCurrency(totalValuation)}
              </div>
              <div className="text-slate-500 text-xs mt-1">Total Valuation</div>
            </div>
            <div className="glass rounded-xl p-4 border border-slate-700/50">
              <div className="gradient-text text-2xl font-black">
                {formatCurrency(totalInvested)}
              </div>
              <div className="text-slate-500 text-xs mt-1">Total Invested</div>
            </div>
            <div className="glass rounded-xl p-4 border border-slate-700/50">
              <div className="gradient-text text-2xl font-black">
                {((totalValuation / totalInvested - 1) * 100).toFixed(0)}%
              </div>
              <div className="text-slate-500 text-xs mt-1">Avg. Return</div>
            </div>
          </div>
        </div>
      </section>

      {/* Companies Grid */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto companies-grid grid md:grid-cols-2 gap-6">
          {companies.map((company, i) => {
            const colors = colorMap[company.color];
            return (
              <div
                key={i}
                className={`company-card glass rounded-2xl p-7 border ${colors.border} card-hover relative overflow-hidden`}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center`}
                    >
                      <Building2 size={20} className={colors.text} />
                    </div>
                    <div>
                      <div className="text-white font-bold">{company.name}</div>
                      <div className={`text-xs font-semibold ${colors.text}`}>
                        {company.ticker} · {company.sector}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      company.status === "Active"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-amber-500/15 text-amber-400"
                    }`}
                  >
                    {company.status}
                  </span>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed mb-5">
                  {company.description}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className={`${colors.bg} rounded-lg p-3`}>
                    <div className="text-white font-bold text-lg">
                      {formatCurrency(company.valuation)}
                    </div>
                    <div className="text-slate-500 text-xs">Valuation</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-emerald-400 font-bold text-lg">
                      {company.growth}
                    </div>
                    <div className="text-slate-500 text-xs">Since Investment</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-white font-bold">
                      {company.ownership}%
                    </div>
                    <div className="text-slate-500 text-xs">Ownership Stake</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-white font-bold flex items-center gap-1">
                      <Users size={12} />
                      {company.employees.toLocaleString()}
                    </div>
                    <div className="text-slate-500 text-xs">Employees</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Globe size={12} />
                    <span>{company.headquarters}</span>
                  </div>
                  <div>Founded {company.founded}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sector Distribution */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-10">
            Sector Allocation
          </h2>
          <div className="glass rounded-2xl p-6 border border-slate-700/50">
            <div className="space-y-4">
              {companies.map((c, i) => {
                const pct = ((c.valuation / totalValuation) * 100).toFixed(1);
                const colors = colorMap[c.color];
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-slate-300 font-medium">{c.sector}</span>
                      <span className={`${colors.text} font-semibold`}>{pct}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          c.color === "amber" ? "bg-amber-400" :
                          c.color === "sky" ? "bg-sky-400" :
                          c.color === "emerald" ? "bg-emerald-400" :
                          c.color === "violet" ? "bg-violet-400" :
                          c.color === "orange" ? "bg-orange-400" : "bg-teal-400"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
