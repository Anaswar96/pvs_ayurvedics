"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageCircle,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle2,
  Leaf,
} from "lucide-react";
import Logo from "./Logo";
import { SiteSettings } from "@/lib/types";
import { getWhatsAppLink } from "@/lib/utils";

interface FooterProps {
  settings: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubscribed(true);
        setEmail("");
      }
    } catch {
      // Graceful
      setSubscribed(true);
    } finally {
      setLoading(false);
    }
  };

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "Services", href: "/services" },
    { label: "Our Approach", href: "/about#approach" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <footer className="bg-[#092619] text-emerald-100 border-t border-emerald-950/40 pt-14 pb-8">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-emerald-900/40">
          
          {/* Col 1: Brand & Malayalam Tagline */}
          <div className="lg:col-span-4 space-y-4">
            <Logo variant="light" height={60} logoUrl={settings.logo_url} />
            
            <p className="text-sm font-semibold text-emerald-200 malayalam-text">
              {settings.malayalam_headline || "ആരോഗ്യത്തിന് ആയുർവേദത്തിന്റെ കരുതൽ"}
            </p>
            <p className="text-xs text-emerald-300/80 leading-relaxed max-w-sm">
              Traditional care for a healthier tomorrow. Bringing authentic Kerala Ayurveda closer to your everyday life.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings.facebook_url || "https://facebook.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-emerald-900/60 hover:bg-emerald-700 text-emerald-200 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href={settings.instagram_url || "https://instagram.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-emerald-900/60 hover:bg-emerald-700 text-emerald-200 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href={settings.youtube_url || "https://youtube.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-emerald-900/60 hover:bg-emerald-700 text-emerald-200 flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href={getWhatsAppLink(settings.whatsapp_number)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-emerald-900/60 hover:bg-emerald-700 text-emerald-200 flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              {quickLinks.map((lnk, idx) => (
                <li key={idx}>
                  <Link
                    href={lnk.href}
                    className="text-emerald-200/80 hover:text-white transition-colors block py-0.5"
                  >
                    {lnk.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact Us */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
              Contact Us
            </h4>
            <ul className="space-y-2.5 text-xs text-emerald-200/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{settings.address || "Manjeri, Malappuram, Kerala"}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">
                  {settings.phone || "+91 9061-853-542"}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a
                  href={getWhatsAppLink(settings.whatsapp_number)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Chat on WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                  {settings.email || "info@pvsayurvedics.com"}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
              Newsletter
            </h4>
            <p className="text-xs text-emerald-300/80 leading-relaxed">
              Get updates on new products and wellness tips.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-emerald-900/60 text-emerald-200 text-xs flex items-center gap-2 border border-emerald-700/40">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative mt-2">
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-3.5 pr-12 py-2.5 text-xs bg-white text-stone-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-stone-400"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-1 top-1 bottom-1 px-3 bg-[#0d3b27] text-white rounded-lg hover:bg-[#165b33] transition-colors flex items-center justify-center"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            <div className="pt-2">
              <Link
                href="/admin/login"
                className="text-[11px] text-emerald-400/60 hover:text-emerald-300 transition-colors"
              >
                Admin Portal Login &rarr;
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Tagline Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-400/70">
          <p>© {new Date().getFullYear()} PVS Ayurvedics. All rights reserved.</p>

          <div className="flex items-center gap-2 text-emerald-300/90 font-medium">
            <span>Care</span>
            <span>|</span>
            <span>Balance</span>
            <span>|</span>
            <span>Natural Living</span>
            <Leaf className="w-3.5 h-3.5 text-emerald-400 ml-0.5" />
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/privacy-policy" className="hover:text-emerald-200 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-emerald-200 transition-colors">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
