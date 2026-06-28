"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { GraduationCap, User, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function SetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/coordinator/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create coordinator account.");
        return;
      }

      // Auto-login after setup
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        // Setup succeeded but login failed — send to login
        router.push("/login");
      } else {
        // Go to setup wizard for cohort + group configuration
        router.push("/setup/wizard");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden items-center justify-center bg-gray-50">
      <div className="w-full max-w-[460px] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">

        {/* Header */}
        <div className="bg-[var(--color-brand-dark)] p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-brand-teal)] flex items-center justify-center text-white shadow-sm">
              <GraduationCap size={20} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wide">Athenas</h1>
          </div>
          <p className="text-[var(--color-brand-light)] text-sm font-medium">
            Digital Workflow and Project Management
          </p>
          <div className="w-8 h-0.5 bg-[var(--color-brand-danger)] mt-4 rounded-full" />
        </div>

        {/* Body */}
        <div className="p-8">
          <h2 className="text-lg font-bold text-[var(--color-brand-dark)] mb-1">
            Initialization
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Set up your coordinator account. These credentials will be used to log in from now on.
          </p>

          {error && (
            <div className="mb-5 p-3 bg-[var(--color-brand-danger)]/10 text-[var(--color-brand-danger)] text-sm rounded-lg border border-[var(--color-brand-danger)]/20 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                Full name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User size={17} />
                </div>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="Dr. Ada Okonkwo"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--color-brand-teal)] focus:ring-1 focus:ring-[var(--color-brand-teal)] outline-none transition-colors text-sm placeholder:text-gray-300"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail size={17} />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="coordinator@university.edu.ng"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--color-brand-teal)] focus:ring-1 focus:ring-[var(--color-brand-teal)] outline-none transition-colors text-sm placeholder:text-gray-300"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                Set a password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock size={17} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  minLength={8}
                  className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-200 focus:border-[var(--color-brand-teal)] focus:ring-1 focus:ring-[var(--color-brand-teal)] outline-none transition-colors text-sm placeholder:text-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock size={17} />
                </div>
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  required
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-200 focus:border-[var(--color-brand-teal)] focus:ring-1 focus:ring-[var(--color-brand-teal)] outline-none transition-colors text-sm placeholder:text-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-brand-teal)] text-white py-3 mt-2 rounded-lg text-sm font-semibold hover:bg-[var(--color-brand-teal)]/90 active:bg-[var(--color-brand-slate)] transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-[var(--color-brand-dark)] px-8 py-4 flex items-center justify-between mt-auto">
          <span className="text-xs text-white/50 font-medium">© 2026 Athenas</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-danger)]" />
        </div>
      </div>
    </div>
  );
}
