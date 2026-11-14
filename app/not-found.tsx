import React from "react";
import Link from "next/link";
import { ArrowLeft, Leaf } from "lucide-react";
import Logo from "@/components/public/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ayur-cream flex items-center justify-center p-6 text-center">
      <div className="max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-emerald-900/10 shadow-xl space-y-6">
        <div className="flex justify-center mb-2">
          <Logo height={64} />
        </div>

        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
          <Leaf className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold tracking-widest text-emerald-800 uppercase">
            Page Not Found (404)
          </span>
          <h1 className="text-2xl font-bold font-serif-ayur text-[#0d3b27]">
            Natural Healing Awaits
          </h1>
          <p className="text-xs text-stone-500 leading-relaxed">
            The page you are looking for might have been moved or is currently unavailable.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0d3b27] text-white text-xs font-semibold hover:bg-[#165b33] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
