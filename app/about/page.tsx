"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "@/components/public/Navigation";
import Footer from "@/components/public/Footer";
import { Target, Eye, Heart, Users, Award, TrendingUp } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const leadership = [
  {
    name: "Alexander Nova",
    title: "Founder & CEO",
    description:
      "Former Goldman Sachs Managing Director with 20+ years of global investment experience.",
    initials: "AN",
    color: "from-amber-400 to-orange-500",
  },
  {
    name: "Sarah Chen",
    title: "Chief Investment Officer",
    description:
      "PhD in Quantitative Finance, previously led $12B portfolio at Bridgewater Associates.",
    initials: "SC",
    color: "from-sky-400 to-blue-600",
  },
  {
    name: "Marcus Williams",
    title: "Chief Risk Officer",
    description:
      "Former Federal Reserve economist specializing in systemic risk and macro strategy.",
    initials: "MW",
    color: "from-violet-400 to-purple-600",
  },
  {
    name: "Elena Reyes",
    title: "Head of Technology Investments",
    description:
      "Ex-Google VP, serial entrepreneur with 4 successful exits in AI and enterprise SaaS.",
    initials: "ER",
    color: "from-emerald-400 to-teal-600",
  },
];

const values = [
  {
    icon: Target,
    title: "Precision",
    description:
      "Every investment decision is backed by rigorous quantitative analysis and qualitative due diligence.",
  },
  {
    icon: Eye,
    title: "Vision",
    description:
      "We identify structural shifts before they become consensus, positioning capital ahead of the curve.",
  },
  {
    icon: Heart,
    title: "Integrity",
    description:
      "Transparent communication and ethical conduct are non-negotiable pillars of our operation.",
  },
  {
    icon: TrendingUp,
    title: "Excellence",
    description:
      "We hold ourselves and our portfolio companies to the highest standards of performance.",
  },
];

const milestones = [
  { year: "2015", event: "Nova Capital Holdings founded with $500M seed capital" },
  { year: "2017", event: "First major acquisition: Arctic Logistics for $280M" },
  { year: "2018", event: "Crossed $5B AUM; opened Singapore office" },
  { year: "2020", event: "Launched clean energy vertical; invested in Quantum Energy" },
  { year: "2022", event: "AUM surpassed $15B; expanded to 18 countries" },
  { year: "2024", event: "AUM reaches $24.5B; 6 portfolio companies, 3 unicorns" },
];

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-hero-content > *",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.2,
        }
      );

      gsap.fromTo(
        ".value-card",
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".values-section", start: "top 75%" },
        }
      );

      gsap.fromTo(
        ".team-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: ".team-section", start: "top 75%" },
        }
      );

      gsap.fromTo(
        ".milestone-item",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".milestones-section", start: "top 75%" },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="animated-bg min-h-screen">
      <Navigation />

      {/* Hero */}
      <section
        ref={heroRef}
        className="pt-32 pb-20 px-6 relative overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/3 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto text-center about-hero-content relative z-10">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-amber-400 border border-amber-500/30 mb-8">
            <Award size={14} />
            <span>About Nova Capital Holdings</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Architecting
            <br />
            <span className="gradient-text">Generational Wealth</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Founded in 2015, Nova Capital Holdings is a global investment holding
            company that deploys capital into transformative industries with
            enduring competitive advantages.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="glass rounded-2xl p-8 border border-amber-500/20">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-5">
              <Target size={22} className="text-white" />
            </div>
            <h3 className="text-white text-2xl font-bold mb-3">Our Mission</h3>
            <p className="text-slate-400 leading-relaxed">
              To identify and invest in businesses that are reshaping industries,
              creating lasting value for stakeholders while generating exceptional
              risk-adjusted returns for our partners and investors.
            </p>
          </div>
          <div className="glass rounded-2xl p-8 border border-sky-500/20">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center mb-5">
              <Eye size={22} className="text-white" />
            </div>
            <h3 className="text-white text-2xl font-bold mb-3">Our Vision</h3>
            <p className="text-slate-400 leading-relaxed">
              To be recognized as the world&apos;s most forward-thinking holding
              company—one that bridges the gap between today&apos;s capital markets
              and tomorrow&apos;s transformative economy.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="values-section py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">
              Core Principles
            </div>
            <h2 className="text-4xl font-black text-white">Our Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <div
                  key={i}
                  className="value-card glass rounded-2xl p-6 border border-slate-700/50 text-center card-hover"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
                    <Icon size={20} className="text-amber-400" />
                  </div>
                  <h3 className="text-white font-bold mb-2">{value.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="team-section py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">
              Leadership
            </div>
            <h2 className="text-4xl font-black text-white">
              World-Class Team
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {leadership.map((member, i) => (
              <div
                key={i}
                className="team-card glass rounded-2xl p-6 border border-slate-700/50 card-hover"
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-white font-black text-xl mb-4`}
                >
                  {member.initials}
                </div>
                <h3 className="text-white font-bold mb-1">{member.name}</h3>
                <div className="text-amber-400 text-xs font-semibold mb-3">
                  {member.title}
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="milestones-section py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">
              Our Journey
            </div>
            <h2 className="text-4xl font-black text-white">Key Milestones</h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500/50 to-transparent" />
            <div className="space-y-6">
              {milestones.map((m, i) => (
                <div
                  key={i}
                  className="milestone-item flex items-start gap-6 pl-4"
                >
                  <div className="relative z-10 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 font-black text-xs flex-shrink-0 mt-1">
                    {i + 1}
                  </div>
                  <div className="glass rounded-xl p-4 flex-1 border border-slate-700/50">
                    <div className="text-amber-400 font-bold text-sm mb-1">
                      {m.year}
                    </div>
                    <div className="text-slate-300 text-sm">{m.event}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[
            { value: "$24.5B", label: "Assets Under Management" },
            { value: "9 Years", label: "Of Investment Excellence" },
            { value: "18+", label: "Global Markets" },
          ].map((stat, i) => (
            <div key={i} className="glass rounded-xl p-6 border border-slate-700/50">
              <div className="gradient-text text-3xl font-black mb-2">
                {stat.value}
              </div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
