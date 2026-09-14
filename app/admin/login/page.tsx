"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import type { Metadata } from "next";

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
      setError("Invalid email or password. Please try again.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#0a0d14" }}
    >
      {/* Background glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(212,92,51,0.08) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl"
            style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))" }}>
            <Lock size={22} className="text-white" />
          </div>
          <h1 className="font-serif text-2xl text-white mb-1">Admin Access</h1>
          <p className="text-white/40 text-sm">Sign in to manage ENJOY Holidays</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="rounded-2xl p-6 flex flex-col gap-4"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div>
            <label htmlFor="admin-email" className="block text-xs text-white/50 font-medium mb-1.5">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@enjoyholidays.in"
              className="w-full px-4 py-3 rounded-xl bg-white/6 border border-white/10 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-xs text-white/50 font-medium mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 rounded-xl bg-white/6 border border-white/10 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-xs px-1" role="alert">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-200 disabled:opacity-60 mt-2"
            style={{
              background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
            }}
            id="admin-login-btn"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : "Sign In"}
          </button>
        </form>

        <p className="text-center text-white/20 text-xs mt-6">
          Restricted access. Authorised personnel only.
        </p>
      </div>
    </div>
  );
}
