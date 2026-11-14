"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  Image as ImageIcon,
  Megaphone,
  Stethoscope,
  MessageSquareQuote,
  Inbox,
  FileEdit,
  Settings,
  Images,
  LogOut,
  ExternalLink,
  X,
} from "lucide-react";
import Logo from "@/components/public/Logo";

interface AdminSidebarProps {
  onCloseMobile?: () => void;
  newEnquiriesCount?: number;
}

export default function AdminSidebar({
  onCloseMobile,
  newEnquiriesCount = 0,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Categories", href: "/admin/categories", icon: Layers },
    { label: "Banners", href: "/admin/banners", icon: ImageIcon },
    { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
    { label: "Services", href: "/admin/services", icon: Stethoscope },
    { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
    {
      label: "Enquiries",
      href: "/admin/enquiries",
      icon: Inbox,
      badge: newEnquiriesCount > 0 ? newEnquiriesCount : undefined,
    },
    { label: "Website Content", href: "/admin/content", icon: FileEdit },
    { label: "Site Settings", href: "/admin/settings", icon: Settings },
    { label: "Media Library", href: "/admin/media", icon: Images },
  ];

  const handleLogout = () => {
    document.cookie = "pvs_admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="w-64 bg-[#092619] text-emerald-100 flex flex-col h-full border-r border-emerald-950/40 select-none">
      {/* Brand Header */}
      <div className="p-4 sm:p-5 border-b border-emerald-900/40 flex items-center justify-between">
        <Logo variant="light" height={44} />
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-900/60 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-400/60">
          Management
        </div>

        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          const IconComp = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-emerald-800 text-white shadow-sm"
                  : "text-emerald-200/80 hover:bg-emerald-900/50 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <IconComp className={`w-4 h-4 ${isActive ? "text-white" : "text-emerald-400"}`} />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-emerald-950 text-[10px] font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer Quick Links & Logout */}
      <div className="p-3 border-t border-emerald-900/40 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-emerald-300 hover:bg-emerald-900/50 transition-colors"
        >
          <ExternalLink className="w-4 h-4 text-emerald-400" />
          <span>View Live Site</span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-red-300 hover:bg-red-950/40 hover:text-red-200 transition-colors text-left"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
