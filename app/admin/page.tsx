import React from "react";
import Link from "next/link";
import {
  Package,
  Inbox,
  Layers,
  Stethoscope,
  MessageSquareQuote,
  Megaphone,
  PlusCircle,
  ArrowRight,
  Clock,
  Phone,
  MessageCircle,
} from "lucide-react";
import {
  getAdminStats,
  getEnquiries,
  getAllProductsAdmin,
} from "@/lib/supabase/queries";
import { formatDateTime, getWhatsAppLink } from "@/lib/utils";

export const metadata = {
  title: "Admin Dashboard | PVS Ayurvedics",
};

export default async function AdminDashboardPage() {
  const [stats, enquiries, products] = await Promise.all([
    getAdminStats(),
    getEnquiries(),
    getAllProductsAdmin(),
  ]);

  const recentEnquiries = enquiries.slice(0, 5);
  const recentProducts = products.slice(0, 4);

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      subvalue: `${stats.publishedProductsCount} Published`,
      href: "/admin/products",
      icon: Package,
      color: "bg-emerald-50 text-emerald-800",
    },
    {
      title: "Consultation Enquiries",
      value: stats.totalEnquiries,
      subvalue: `${stats.newEnquiriesCount} New / Pending`,
      href: "/admin/enquiries",
      icon: Inbox,
      color: "bg-amber-50 text-amber-800",
      highlight: stats.newEnquiriesCount > 0,
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      subvalue: "Active Classifications",
      href: "/admin/categories",
      icon: Layers,
      color: "bg-blue-50 text-blue-800",
    },
    {
      title: "Clinic Services",
      value: stats.totalServices,
      subvalue: "Therapies & Packages",
      href: "/admin/services",
      icon: Stethoscope,
      color: "bg-purple-50 text-purple-800",
    },
    {
      title: "Testimonials",
      value: stats.totalTestimonials,
      subvalue: "Patient Reviews",
      href: "/admin/testimonials",
      icon: MessageSquareQuote,
      color: "bg-teal-50 text-teal-800",
    },
    {
      title: "Banners & Alerts",
      value: stats.totalBanners,
      subvalue: "Promotions & Bar",
      href: "/admin/banners",
      icon: Megaphone,
      color: "bg-rose-50 text-rose-800",
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-[#0d3b27] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <span className="text-xs font-bold tracking-widest text-emerald-300 uppercase">
            PVS Ayurvedics Admin System
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-ayur">
            Welcome back, Administrator
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl">
            Manage your Ayurvedic clinic product inventory, patient consultations, homepage announcements, and website content dynamically.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 z-10">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white text-[#0d3b27] text-xs font-bold hover:bg-emerald-50 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Product</span>
          </Link>

          <Link
            href="/admin/enquiries"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-emerald-800/80 border border-emerald-400/30 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors"
          >
            <Inbox className="w-4 h-4" />
            <span>View Enquiries ({stats.newEnquiriesCount})</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card, idx) => {
          const IconComp = card.icon;
          return (
            <Link
              key={idx}
              href={card.href}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:border-emerald-700/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl ${card.color}`}>
                  <IconComp className="w-4 h-4" />
                </div>
                {card.highlight && (
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                )}
              </div>

              <div>
                <p className="text-2xl font-bold text-stone-900 font-serif-ayur">
                  {card.value}
                </p>
                <h4 className="text-xs font-bold text-stone-700 mt-0.5">{card.title}</h4>
                <p className="text-[11px] text-stone-400 mt-1">{card.subvalue}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Enquiries & Quick CRM Section */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold font-serif-ayur text-[#0d3b27]">
              Recent Consultation Enquiries
            </h3>
            <p className="text-xs text-stone-500">
              Latest requests submitted from the public website and product inquiry forms.
            </p>
          </div>

          <Link
            href="/admin/enquiries"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0d3b27] hover:underline"
          >
            <span>Manage All ({enquiries.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentEnquiries.length === 0 ? (
          <div className="py-8 text-center text-stone-400 text-xs">
            No incoming consultation enquiries yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-100">
                <tr>
                  <th className="py-3 px-4">Patient / Customer</th>
                  <th className="py-3 px-4">Interest / Query</th>
                  <th className="py-3 px-4">Preferred Slot</th>
                  <th className="py-3 px-4">Date Submitted</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-stone-900">{enq.full_name}</p>
                      <p className="text-stone-500 text-[11px]">{enq.phone}</p>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-stone-700 max-w-xs truncate">
                      {enq.product_interest || "General Consultation"}
                    </td>

                    <td className="py-3.5 px-4 text-stone-600">
                      {enq.preferred_date ? `${enq.preferred_date}` : "Any Date"}
                    </td>

                    <td className="py-3.5 px-4 text-stone-500">
                      {formatDateTime(enq.created_at)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          enq.status === "New"
                            ? "bg-amber-100 text-amber-900"
                            : enq.status === "Contacted"
                            ? "bg-blue-100 text-blue-900"
                            : enq.status === "Completed"
                            ? "bg-emerald-100 text-emerald-900"
                            : "bg-stone-100 text-stone-700"
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <a
                          href={getWhatsAppLink(
                            enq.phone,
                            `Hello ${enq.full_name}, this is from PVS Ayurvedics Manjeri regarding your consultation enquiry.`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                          title="Reply on WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`tel:${enq.phone}`}
                          className="p-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200"
                          title="Call Customer"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
