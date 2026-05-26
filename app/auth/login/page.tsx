"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { gsap } from "gsap";
import { Eye, EyeOff, Shield, Lock, Mail, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl") || "/portal";

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".login-card",
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    });
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
        gsap.fromTo(
          ".login-card",
          { x: -10 },
          { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" }
        );
      } else {
        gsap.to(".login-card", {
          scale: 0.98,
          opacity: 0,
          duration: 0.3,
          onComplete: () => router.push(callbackUrl),
        });
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md login-card">
      {/* Logo */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center glow-gold">
            <span className="text-slate-900 font-black text-xl">N</span>
          </div>
          <div className="text-left">
            <div className="text-white font-bold text-xl">Nova Capital</div>
            <div className="text-amber-400 text-xs tracking-widest uppercase">Holdings</div>
          </div>
        </Link>
      </div>

      {/* Card */}
      <div className="glass rounded-2xl p-8 border border-slate-700/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
            <Shield size={18} className="text-amber-400" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Secure Portal Access</h1>
            <p className="text-slate-500 text-xs">Role-based authenticated access</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-5">
            <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
            <span className="text-red-400 text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-slate-400 text-sm mb-1.5 block">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@novacapital.com"
                className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-slate-400 text-sm mb-1.5 block">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg pl-10 pr-12 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                <Shield size={16} />
                Access Portal
              </>
            )}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="mt-6 pt-5 border-t border-slate-700/50">
          <p className="text-slate-500 text-xs text-center mb-3">
            Demo Credentials
          </p>
          <div className="space-y-2">
            {[
              { role: "Admin", email: "admin@novacapital.com", pass: "admin123!" },
              { role: "Executive", email: "executive@novacapital.com", pass: "exec123!" },
              { role: "Analyst", email: "analyst@novacapital.com", pass: "analyst123!" },
            ].map((cred) => (
              <button
                key={cred.role}
                onClick={() => {
                  setEmail(cred.email);
                  setPassword(cred.pass);
                }}
                className="w-full text-left px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-all border border-slate-700/50 hover:border-amber-500/30 text-xs text-slate-400 hover:text-slate-300 flex justify-between items-center"
              >
                <span className="font-semibold text-amber-400">{cred.role}</span>
                <span>{cred.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="text-center text-slate-600 text-xs mt-6">
        <Link href="/" className="hover:text-amber-400 transition-colors">
          ← Back to public site
        </Link>
      </p>

      {/* Security indicators */}
      <div className="flex justify-center gap-6 mt-6 text-slate-600 text-xs">
        <div className="flex items-center gap-1.5">
          <Shield size={11} className="text-emerald-500" />
          <span>TLS 1.3</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Lock size={11} className="text-emerald-500" />
          <span>AES-256</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen animated-bg flex items-center justify-center px-4 py-12 relative">
      {/* Background */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/4 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-sky-500/4 rounded-full blur-3xl pointer-events-none" />

      <Suspense
        fallback={
          <div className="w-full max-w-md">
            <div className="glass rounded-2xl p-8 border border-slate-700/50 animate-pulse">
              <div className="h-8 bg-slate-700 rounded mb-4" />
              <div className="h-4 bg-slate-800 rounded mb-6" />
              <div className="space-y-4">
                <div className="h-12 bg-slate-800 rounded" />
                <div className="h-12 bg-slate-800 rounded" />
                <div className="h-12 bg-amber-500/20 rounded" />
              </div>
            </div>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
