"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { GraduationCap, User, Lock, Eye, EyeOff, Info } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("Attempting login with:", { email });

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log("SignIn result:", result);

      if (result?.error) {
        console.error("Login error:", result.error);
        setError(result.error === "CredentialsSignin" ? "Invalid credentials." : result.error);
      } else if (result?.ok) {
        console.log("Login successful, redirecting...");
        // Force hard redirect to ensure session loads
        window.location.href = "/dashboard";
      } else {
        console.error("Unexpected result:", result);
        setError("An unexpected error occurred. Please try again.");
      }
    } catch (err) {
      console.error("Login exception:", err);
      setError("A network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden items-center justify-center bg-gray-50">
      <div className="w-full max-w-[426px] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
        
        {/* Dark Header Zone */}
        <div className="bg-[var(--color-brand-dark)] p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-brand-teal)] flex items-center justify-center text-white shadow-sm">
              <GraduationCap size={20} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wide">Athenas</h1>
          </div>
          <p className="text-[var(--color-brand-light)] text-sm font-medium">Digital Workflow and Project Management</p>
          <div className="w-8 h-0.5 bg-[var(--color-brand-danger)] mt-4 rounded-full"></div>
        </div>

        {/* White Body Zone */}
        <div className="p-8">
          <h2 className="text-lg font-bold text-[var(--color-brand-dark)] mb-6">Sign in to your account</h2>

          {error && (
            <div className="mb-6 p-3 bg-[var(--color-brand-danger)]/10 text-[var(--color-brand-danger)] text-sm rounded-lg border border-[var(--color-brand-danger)]/20 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                Email address or matriculation number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Enter your email or mat number"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--color-brand-teal)] focus:ring-1 focus:ring-[var(--color-brand-teal)] outline-none transition-colors text-sm placeholder:text-gray-300"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                Password
              </label>
              <div className="relative mb-2">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-200 focus:border-[var(--color-brand-teal)] focus:ring-1 focus:ring-[var(--color-brand-teal)] outline-none transition-colors text-sm placeholder:text-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-sm font-semibold text-[var(--color-brand-teal)] hover:text-[var(--color-brand-slate)] transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-brand-teal)] text-white py-3 mt-2 rounded-lg text-sm font-semibold hover:bg-[var(--color-brand-teal)]/90 active:bg-[var(--color-brand-slate)] transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Info Section */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex gap-3">
            <Info size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500 leading-relaxed">
              Access is by invitation only. Contact your coordinator if you have not received your invitation email.
            </p>
          </div>
        </div>

        {/* Dark Footer Zone */}
        <div className="bg-[var(--color-brand-dark)] px-8 py-4 flex items-center justify-between mt-auto">
          <span className="text-xs text-white/50 font-medium">© 2026 Athenas</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-danger)]"></div>
        </div>
      </div>
    </div>
  );
}