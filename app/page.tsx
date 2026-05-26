"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "@/components/public/Navigation";
import Footer from "@/components/public/Footer";
import { formatCurrency } from "@/lib/utils";
import {
  TrendingUp,
  Globe,
  Shield,
  Zap,
  BarChart3,
  Building2,
  Users,
  Award,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { label: "Assets Under Management", value: 24500000000, prefix: "$", suffix: "+" },
  { label: "Portfolio Companies", value: 6, suffix: "" },
  { label: "Countries Invested", value: 18, suffix: "+" },
  { label: "Annual Growth", value: 34, suffix: "%" },
];

const features = [
  {
    icon: TrendingUp,
    title: "Strategic Investments",
    description:
      "Data-driven portfolio construction across high-growth sectors including AI, clean energy, and biotech.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "Investments spanning 18 countries, capturing value in emerging and developed markets alike.",
    color: "from-sky-500 to-blue-600",
  },
  {
    icon: Shield,
    title: "Risk Excellence",
    description:
      "Proprietary risk frameworks ensuring capital preservation while maximizing asymmetric returns.",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: Zap,
    title: "Decisive Execution",
    description:
      "Agile deal-making capabilities allowing rapid deployment of capital in time-sensitive opportunities.",
    color: "from-emerald-500 to-teal-600",
  },
];

const portfolioHighlights = [
  {
    name: "NovaTech Systems",
    sector: "Technology",
    valuation: 4200000000,
    growth: "+142%",
    color: "amber",
  },
  {
    name: "Quantum Energy Corp",
    sector: "Clean Energy",
    valuation: 8700000000,
    growth: "+89%",
    color: "sky",
  },
  {
    name: "BioNova Pharma",
    sector: "Healthcare",
    valuation: 3100000000,
    growth: "+67%",
    color: "emerald",
  },
];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero timeline
      const tl = gsap.timeline({ delay: 0.3 });

      tl.fromTo(
        ".hero-badge",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      )
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 50, skewY: 3 },
          { opacity: 1, y: 0, skewY: 0, duration: 1.2, ease: "power4.out" },
          "-=0.4"
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.6"
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.4"
        );

      // Floating particles
      gsap.utils.toArray<Element>(".particle").forEach((particle, i) => {
        gsap.fromTo(
          particle,
          { opacity: 0 },
          {
            opacity: Math.random() * 0.6 + 0.2,
            duration: Math.random() * 2 + 1,
            delay: i * 0.1,
          }
        );
        gsap.to(particle, {
          y: `${Math.random() * 60 - 30}px`,
          x: `${Math.random() * 40 - 20}px`,
          rotation: Math.random() * 360,
          duration: Math.random() * 6 + 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      // Stats counter animation
      gsap.fromTo(
        ".stat-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
          },
        }
      );

      // Features animation
      gsap.fromTo(
        ".feature-card",
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 75%",
          },
        }
      );

      // Portfolio highlights animation
      gsap.fromTo(
        ".portfolio-card",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: portfolioRef.current,
            start: "top 75%",
          },
        }
      );

      // Section titles animation
      gsap.fromTo(
        ".section-title",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".section-title",
            start: "top 80%",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="animated-bg min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      >
        {/* Background grid */}
        <div className="absolute inset-0 opacity-5">
          <div
            style={{
              backgroundImage:
                "linear-gradient(rgba(245,158,11,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.3) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
            className="w-full h-full"
          />
        </div>

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle absolute rounded-full opacity-0"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background:
                i % 3 === 0
                  ? "#f59e0b"
                  : i % 3 === 1
                  ? "#0ea5e9"
                  : "#8b5cf6",
            }}
          />
        ))}

        {/* Hero glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="hero-badge inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-amber-400 border border-amber-500/30 mb-8">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Strategic Holdings · Global Vision</span>
          </div>

          {/* Main title */}
          <h1
            ref={titleRef}
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-6"
          >
            <span className="text-white">Building</span>
            <br />
            <span className="gradient-text">Tomorrow&apos;s</span>
            <br />
            <span className="text-white">Legacy</span>
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Nova Capital Holdings is a next-generation investment firm
            deploying strategic capital across transformative technologies,
            sustainable energy, and emerging global markets.
          </p>

          {/* CTA Buttons */}
          <div
            ref={ctaRef}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/portfolio"
              className="btn-primary px-8 py-4 rounded-xl text-base font-bold flex items-center gap-2 group"
            >
              Explore Portfolio
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              href="/about"
              className="btn-secondary px-8 py-4 rounded-xl text-base font-medium"
            >
              Our Strategy
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 text-xs">
          <span className="tracking-widest uppercase">Scroll</span>
          <ChevronDown size={16} className="animate-bounce" />
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="stat-card glass rounded-2xl p-6 text-center border border-slate-700/50 card-hover"
              >
                <div className="gradient-text text-3xl md:text-4xl font-black mb-2">
                  {stat.prefix}
                  {stat.label === "Assets Under Management"
                    ? formatCurrency(stat.value).replace("$", "")
                    : stat.value}
                  {stat.suffix}
                </div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="section-title text-center mb-14">
            <div className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">
              Our Approach
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Why Nova Capital?
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto">
              A disciplined, forward-thinking investment philosophy combining
              quantitative rigor with qualitative vision.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="feature-card glass rounded-2xl p-7 border border-slate-700/50 card-hover"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5`}
                  >
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="text-white text-xl font-bold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Portfolio Highlights */}
      <section ref={portfolioRef} className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">
                Portfolio
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-5">
                Invested in
                <br />
                the Future
              </h2>
              <p className="text-slate-400 leading-relaxed mb-8">
                Our portfolio spans six high-conviction sectors with a combined
                valuation exceeding $24 billion. Each investment reflects a
                thesis built on long-term structural shifts.
              </p>
              <Link
                href="/portfolio"
                className="btn-primary px-6 py-3 rounded-xl text-sm font-bold inline-flex items-center gap-2 group"
              >
                View All Holdings
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>

            <div className="space-y-4">
              {portfolioHighlights.map((item, i) => (
                <div
                  key={i}
                  className="portfolio-card glass rounded-xl p-5 border border-slate-700/50 flex items-center justify-between card-hover"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        item.color === "amber"
                          ? "bg-amber-500/20"
                          : item.color === "sky"
                          ? "bg-sky-500/20"
                          : "bg-emerald-500/20"
                      }`}
                    >
                      <Building2
                        size={18}
                        className={
                          item.color === "amber"
                            ? "text-amber-400"
                            : item.color === "sky"
                            ? "text-sky-400"
                            : "text-emerald-400"
                        }
                      />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">
                        {item.name}
                      </div>
                      <div className="text-slate-500 text-xs">{item.sector}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-sm">
                      {formatCurrency(item.valuation)}
                    </div>
                    <div className="text-emerald-400 text-xs font-semibold">
                      {item.growth}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="glass rounded-3xl p-12 border border-amber-500/20 relative overflow-hidden scan-line-animation"
            style={{
              background:
                "linear-gradient(135deg, rgba(245,158,11,0.05), rgba(15,23,42,0.8))",
            }}
          >
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 mb-6">
                <Award size={16} className="text-amber-400" />
                <span className="text-amber-400 text-sm font-semibold tracking-wider uppercase">
                  Internal Portal
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-5">
                Secure Access for
                <br />
                <span className="gradient-text">Team Members</span>
              </h2>
              <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                Access financial reports, legal documents, banking details, and
                portfolio analytics through our encrypted internal portal.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/login"
                  className="btn-primary px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 group"
                >
                  <Shield size={18} />
                  Access Portal
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
              <div className="mt-6 flex items-center justify-center gap-6 text-slate-500 text-xs">
                <div className="flex items-center gap-1.5">
                  <Shield size={12} className="text-emerald-400" />
                  <span>256-bit Encryption</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={12} className="text-sky-400" />
                  <span>Role-Based Access</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BarChart3 size={12} className="text-amber-400" />
                  <span>Real-Time Data</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
