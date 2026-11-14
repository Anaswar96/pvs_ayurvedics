"use client";

import React from "react";
import Link from "next/link";
import { Menu, ExternalLink, UserCircle, Bell } from "lucide-react";

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
  title?: string;
}

export default function AdminHeader({
  onToggleSidebar,
  title = "PVS Ayurvedics Admin Portal",
}: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-30 px-4 sm:px-6 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-base sm:text-lg font-bold text-[#0d3b27] font-serif-ayur truncate">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-200 text-stone-600 hover:text-[#0d3b27] hover:bg-stone-50 text-xs font-semibold transition-colors"
        >
          <span>Live Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* User indicator */}
        <div className="flex items-center gap-2 pl-2 border-l border-stone-200 text-xs text-stone-600">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            A
          </div>
          <div className="hidden md:block">
            <p className="font-bold text-stone-800 leading-tight">Clinic Admin</p>
            <p className="text-[10px] text-stone-400">admin@pvsayurvedics.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}
