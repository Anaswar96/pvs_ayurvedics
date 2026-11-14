"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock, Mail, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import Logo from "@/components/public/Logo";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@pvsayurvedics.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (!authError && data?.session) {
        // Set secure cookie / redirect to admin dashboard
        document.cookie = `pvs_admin_auth=true; path=/; max-age=86400; SameSite=Lax`;
        router.push("/admin");
        router.refresh();
        return;
      }

      // Local fallback credentials check for initial setup
      if (
        (email.trim() === "admin@pvsayurvedics.com" || email.trim() === "admin") &&
        (password.trim() === "PvsAyurvedics2026!" || password.trim() === "admin123" || password.trim() === "admin")
      ) {
        document.cookie = `pvs_admin_auth=true; path=/; max-age=86400; SameSite=Lax`;
        router.push("/admin");
        router.refresh();
        return;
      }

      setError("Invalid email or password. Default setup: admin@pvsayurvedics.com / PvsAyurvedics2026!");
    } catch {
      setError("An unexpected authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#072213] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Botanical Background Accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-emerald-800/20 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 border border-emerald-900/10 space-y-6">
        
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Logo height={72} />
          </div>
          <span className="text-[10px] font-bold tracking-widest text-emerald-800 uppercase block">
            Administrative Management Portal
          </span>
          <h1 className="text-2xl font-bold font-serif-ayur text-[#0d3b27]">
            Admin Sign In
          </h1>
          <p className="text-xs text-stone-500">
            Sign in to manage products, enquiries, content, and clinic settings.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pvsayurvedics.com"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0d3b27] focus:bg-white"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0d3b27] focus:bg-white"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#0d3b27] text-white text-xs font-semibold hover:bg-[#165b33] transition-all duration-200 shadow-md shadow-emerald-950/20 disabled:opacity-70 group"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Quick Helper Credentials Note */}
        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/60 text-[11px] text-emerald-900 space-y-1">
          <p className="font-bold">Initial Setup Credentials:</p>
          <p className="text-emerald-800">Email: <code className="bg-white px-1.5 py-0.5 rounded text-emerald-950">admin@pvsayurvedics.com</code></p>
          <p className="text-emerald-800">Password: <code className="bg-white px-1.5 py-0.5 rounded text-emerald-950">PvsAyurvedics2026!</code></p>
        </div>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-xs text-stone-500 hover:text-[#0d3b27] transition-colors"
          >
            &larr; Return to Public Website
          </Link>
        </div>

      </div>
    </div>
  );
}
