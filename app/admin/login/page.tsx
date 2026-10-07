"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Loader2, Lock, ShieldCheck, Compass } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClientSupabaseClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Incorrect email or password. Please try again.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#F8FAFC] text-[#111827]">
      <div className="w-full max-w-md">
        {/* Logo and Welcome */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 bg-[#059669] text-white flex items-center justify-center shadow-md">
            <Compass size={28} className="stroke-[2.2]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight mb-1.5">
            PADMA Tours Admin
          </h1>
          <p className="text-[#4B5563] text-sm">
            Sign in to manage tour packages, customer enquiries, and media
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleLogin}
          className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#E5E7EB] flex flex-col gap-5"
        >
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-2"
            >
              Email Address
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@padmatours.com"
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] transition-all shadow-sm"
              autoComplete="email"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 pr-11 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] transition-all shadow-sm"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#111827] p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div
              className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] text-xs font-semibold flex items-center gap-2"
              role="alert"
            >
              <span className="text-sm">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold text-sm text-white bg-[#059669] hover:bg-[#047857] active:bg-[#065F46] shadow-sm transition-all disabled:opacity-60 mt-1 cursor-pointer"
            id="admin-login-btn"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <Lock size={16} />
                <span>Sign In to Admin Panel</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6 flex items-center justify-center gap-1.5 text-[#6B7280] text-xs font-medium">
          <ShieldCheck size={14} className="text-[#059669]" />
          <span>Secure Admin Portal • PADMA TOURS &amp; TRAVELS</span>
        </div>
      </div>
    </div>
  );
}
