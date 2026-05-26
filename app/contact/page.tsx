"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Navigation from "@/components/public/Navigation";
import Footer from "@/components/public/Footer";
import { Mail, Phone, MapPin, Globe, Send, Building2 } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-hero > *",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out", delay: 0.2 }
      );
      gsap.fromTo(
        ".contact-form, .contact-info",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power3.out", delay: 0.5 }
      );
    });
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="animated-bg min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto contact-hero text-center">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-amber-400 border border-amber-500/30 mb-8">
            <Mail size={14} />
            <span>Contact Us</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-5">
            Let&apos;s <span className="gradient-text">Connect</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Whether you&apos;re exploring investment opportunities, partnership
            discussions, or media inquiries—we&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 px-6 pb-24">
        <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-8">
          {/* Contact Info */}
          <div className="contact-info md:col-span-2 space-y-5">
            <div className="glass rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-white font-bold mb-5">Get in Touch</h3>
              <div className="space-y-4">
                {[
                  { icon: Building2, label: "Headquarters", value: "One Nova Plaza, 55th Floor\nNew York, NY 10004" },
                  { icon: Mail, label: "Email", value: "invest@novacapital.com" },
                  { icon: Phone, label: "Phone", value: "+1 (212) 555-0100" },
                  { icon: Globe, label: "Global Offices", value: "New York · London · Singapore · Dubai" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                        <Icon size={16} className="text-amber-400" />
                      </div>
                      <div>
                        <div className="text-slate-500 text-xs mb-0.5">{item.label}</div>
                        <div className="text-slate-300 text-sm whitespace-pre-line">{item.value}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass rounded-2xl p-6 border border-amber-500/20">
              <h4 className="text-amber-400 font-semibold text-sm mb-2">Investment Inquiries</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                For institutional investors and qualified accredited investors
                interested in co-investment opportunities, please contact our
                investor relations team.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form md:col-span-3">
            {submitted ? (
              <div className="glass rounded-2xl p-10 border border-emerald-500/30 text-center h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-5">
                  <Send size={24} className="text-emerald-400" />
                </div>
                <h3 className="text-white text-2xl font-bold mb-3">Message Sent!</h3>
                <p className="text-slate-400">
                  Thank you for reaching out. Our team will respond within 1-2
                  business days.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="glass rounded-2xl p-7 border border-slate-700/50 space-y-5"
              >
                <h3 className="text-white font-bold text-lg mb-2">Send a Message</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { name: "name", label: "Full Name", placeholder: "John Smith", type: "text" },
                    { name: "email", label: "Email Address", placeholder: "john@company.com", type: "email" },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="text-slate-400 text-sm mb-1.5 block">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={formData[field.name as keyof typeof formData]}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            [field.name]: e.target.value,
                          }))
                        }
                        className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
                        required
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-1.5 block">Company (Optional)</label>
                  <input
                    type="text"
                    placeholder="Your organization"
                    value={formData.company}
                    onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                    className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-1.5 block">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                    className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-all"
                    required
                  >
                    <option value="" className="bg-slate-900">Select a subject</option>
                    <option value="investment" className="bg-slate-900">Investment Inquiry</option>
                    <option value="partnership" className="bg-slate-900">Partnership Opportunity</option>
                    <option value="media" className="bg-slate-900">Media & Press</option>
                    <option value="other" className="bg-slate-900">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-1.5 block">Message</label>
                  <textarea
                    rows={5}
                    placeholder="Tell us about your inquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                    className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
