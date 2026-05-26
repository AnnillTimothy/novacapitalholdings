import Link from "next/link";
import { ExternalLink, Link2, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <span className="text-slate-900 font-black text-lg">N</span>
              </div>
              <div>
                <div className="text-white font-bold text-lg leading-tight">
                  Nova Capital
                </div>
                <div className="text-amber-400 text-xs tracking-widest uppercase">
                  Holdings
                </div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Building tomorrow&apos;s legacy through strategic investments in
              transformative technologies and industries worldwide.
            </p>
            <div className="flex gap-4 mt-4">
              <a
                href="#"
                className="text-slate-500 hover:text-amber-400 transition-colors"
                aria-label="X (Twitter)"
              >
                <ExternalLink size={18} />
              </a>
              <a
                href="#"
                className="text-slate-500 hover:text-amber-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Link2 size={18} />
              </a>
              <a
                href="#"
                className="text-slate-500 hover:text-amber-400 transition-colors"
                aria-label="Website"
              >
                <Globe size={18} />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">
              Company
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/about", label: "About Us" },
                { href: "/portfolio", label: "Portfolio" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-amber-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">
              Legal
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Privacy Policy" },
                { label: "Terms of Service" },
                { label: "Disclosures" },
              ].map((item) => (
                <li key={item.label}>
                  <span className="text-slate-400 hover:text-amber-400 text-sm transition-colors cursor-pointer">
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} Nova Capital Holdings. All rights
            reserved.
          </p>
          <p className="text-slate-600 text-xs">
            Investment involves risk. Past performance is not indicative of
            future results.
          </p>
        </div>
      </div>
    </footer>
  );
}
