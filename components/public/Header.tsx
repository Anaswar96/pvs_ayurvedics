"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Phone, MessageCircle, Menu, X, Search } from "lucide-react";
import Logo from "./Logo";
import { SiteSettings, NavigationItem } from "@/lib/types";
import { getWhatsAppLink } from "@/lib/utils";

interface HeaderProps {
  settings: SiteSettings;
  navigationItems: NavigationItem[];
}

export default function Header({ settings, navigationItems }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = navigationItems.length > 0
    ? navigationItems
    : [
        { id: "1", label: "Home", path: "/", sort_order: 1, is_active: true },
        { id: "2", label: "About Us", path: "/about", sort_order: 2, is_active: true },
        { id: "3", label: "Products", path: "/products", sort_order: 3, is_active: true },
        { id: "4", label: "Services", path: "/services", sort_order: 4, is_active: true },
        { id: "5", label: "Our Approach", path: "/about#approach", sort_order: 5, is_active: true },
        { id: "6", label: "Contact", path: "/contact", sort_order: 6, is_active: true },
      ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      {/* Top Contact Strip (Desktop View) */}
      <div className="hidden lg:block bg-[#0a2e1e] text-emerald-100 text-xs py-2 px-6 border-b border-emerald-900/40">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-200/90 font-medium">
            <span>Natural Care for a Healthier Tomorrow</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-emerald-200/80 hover:text-white transition-colors">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{settings.address || "Manjeri, Malappuram, Kerala"}</span>
            </div>

            <a
              href={`tel:${settings.phone}`}
              className="flex items-center gap-1.5 text-emerald-200 hover:text-white transition-colors font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{settings.phone || "+91 9061-853-542"}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-emerald-950/5 py-2.5"
            : "bg-ayur-cream/90 backdrop-blur-sm border-b border-emerald-900/10 py-3.5"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0 py-1 ml-4 sm:ml-6 lg:ml-10">
              <Logo height={56} />
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((item) => {
                const isActive =
                  pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    className={`text-sm font-medium transition-colors relative py-1 ${
                      isActive
                        ? "text-[#0d3b27] font-semibold"
                        : "text-stone-700 hover:text-[#0d3b27]"
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#0d3b27] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Search Trigger */}
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-stone-600 hover:text-[#0d3b27] hover:bg-emerald-50 rounded-full transition-colors"
                aria-label="Search products"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* WhatsApp CTA */}
              <a
                href={getWhatsAppLink(settings.whatsapp_number)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-700/30 text-[#0d3b27] text-xs font-semibold hover:bg-emerald-50 transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600/20" />
                <span>WhatsApp</span>
              </a>

              {/* Call CTA */}
              <a
                href={`tel:${settings.phone}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0d3b27] text-white text-xs font-semibold hover:bg-[#165b33] transition-all duration-200 shadow-sm shadow-emerald-950/20"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>
            </div>

            {/* Mobile Header Actions (Compact 390px layout) */}
            <div className="flex lg:hidden items-center gap-2">
              <a
                href={getWhatsAppLink(settings.whatsapp_number)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-emerald-100 text-emerald-800"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-emerald-700" />
              </a>

              <a
                href={`tel:${settings.phone}`}
                className="p-2 rounded-full bg-[#0d3b27] text-white"
                aria-label="Call"
              >
                <Phone className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-stone-700 hover:text-[#0d3b27] rounded-lg"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Collapsible Search Input (Desktop) */}
          {searchOpen && (
            <div className="mt-3 pt-3 border-t border-emerald-900/10 animate-in fade-in slide-in-from-top-2 duration-200">
              <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto flex items-center">
                <input
                  type="text"
                  placeholder="Search pure Ayurvedic products (e.g. Hair Oil, Immunity, Pain Relief)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-24 py-2 text-sm bg-white border border-emerald-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0d3b27] focus:border-transparent"
                  autoFocus
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5" />
                <button
                  type="submit"
                  className="absolute right-1.5 px-4 py-1.5 bg-[#0d3b27] text-white text-xs font-semibold rounded-full hover:bg-[#165b33]"
                >
                  Search
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Drawer Navigation (390px View) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative ml-auto w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <Logo height={44} />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-stone-500 hover:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="p-4 border-b border-stone-100">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0d3b27]"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
              </form>
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto py-3 px-4 space-y-1">
              {navLinks.map((item) => {
                const isActive =
                  pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-emerald-50 text-[#0d3b27] font-semibold"
                        : "text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <div className="pt-4 border-t border-stone-100 space-y-2">
                <Link
                  href="/enquiry"
                  className="block w-full py-2.5 text-center text-xs font-semibold rounded-lg bg-[#0d3b27] text-white shadow-sm"
                >
                  Book Consultation
                </Link>
                <a
                  href={getWhatsAppLink(settings.whatsapp_number)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-center text-xs font-semibold rounded-lg border border-emerald-600 text-emerald-800 bg-emerald-50"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Mobile Footer Info */}
            <div className="p-4 bg-stone-50 border-t border-stone-100 text-xs text-stone-500 space-y-1.5">
              <div className="flex items-center gap-1.5 text-stone-700 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#0d3b27]" />
                <span>Manjeri, Malappuram, Kerala</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#0d3b27]" />
                <span>{settings.phone}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
