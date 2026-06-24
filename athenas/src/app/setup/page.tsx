"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Coordinator Details
  const [coordinatorData, setCoordinatorData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });

  // Step 2: Cohort Details
  const [cohortData, setCohortData] = useState({
    name: "",
    academicYear: "",
  });

  const handleCoordinatorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear error before submitting

    try {
      const res = await fetch("/api/coordinator/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: coordinatorData.fullName,
          email: coordinatorData.email,
          password: coordinatorData.password,
          phone: coordinatorData.phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create coordinator account");
        return;
      }

      // Clear error and move to step 2
      setError("");
      setStep(2);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

 const handleCohortSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const res = await fetch("/api/coordinator/cohorts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: cohortData.name,
        academic_year: cohortData.academicYear,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to create cohort");
      return;
    }

    // ✅ AUTO-LOGIN after successful setup
    const signInResult = await signIn("credentials", {
      email: coordinatorData.email,
      password: coordinatorData.password,
      redirect: false, // Don't redirect yet
    });

    if (signInResult?.error) {
      console.error("Auto-login failed:", signInResult.error);
      // If auto-login fails, just redirect to login page
      router.push("/login");
    } else {
      // Successfully logged in - redirect to dashboard
      router.push("/dashboard/users");
    }
  } catch (err) {
    setError("An error occurred. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-brand-dark)] mb-2">
            Welcome to Athenas
          </h1>
          <p className="text-gray-600">System Setup Wizard</p>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className={`w-3 h-3 rounded-full ${step >= 1 ? "bg-[var(--color-brand-teal)]" : "bg-gray-300"}`} />
            <div className={`w-8 h-0.5 ${step >= 2 ? "bg-[var(--color-brand-teal)]" : "bg-gray-300"}`} />
            <div className={`w-3 h-3 rounded-full ${step >= 2 ? "bg-[var(--color-brand-teal)]" : "bg-gray-300"}`} />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        {/* Step 1: Create Coordinator Account */}
        {step === 1 && (
          <form onSubmit={handleCoordinatorSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Step 1: Create Coordinator Account
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={coordinatorData.fullName}
                onChange={(e) => setCoordinatorData({ ...coordinatorData, fullName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-teal)] focus:border-transparent"
                placeholder="Dr. John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={coordinatorData.email}
                onChange={(e) => setCoordinatorData({ ...coordinatorData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-teal)] focus:border-transparent"
                placeholder="coordinator@university.edu"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={coordinatorData.password}
                onChange={(e) => setCoordinatorData({ ...coordinatorData, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-teal)] focus:border-transparent"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={coordinatorData.phone}
                onChange={(e) => setCoordinatorData({ ...coordinatorData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-teal)] focus:border-transparent"
                placeholder="+234 801 234 5678"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-brand-teal)] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Continue to Step 2"}
            </button>
          </form>
        )}

        {/* Step 2: Create Cohort */}
        {step === 2 && (
          <form onSubmit={handleCohortSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Step 2: Setup Academic Session
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cohort Name
              </label>
              <input
                type="text"
                required
                value={cohortData.name}
                onChange={(e) => setCohortData({ ...cohortData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-teal)] focus:border-transparent"
                placeholder="2024/2025 Academic Session"
              />
              <p className="text-xs text-gray-500 mt-1">
                e.g., "2024/2025 Academic Session" or "Fall 2024 Cohort"
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Academic Year
              </label>
              <input
                type="text"
                required
                value={cohortData.academicYear}
                onChange={(e) => setCohortData({ ...cohortData, academicYear: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-teal)] focus:border-transparent"
                placeholder="2024/2025"
              />
              <p className="text-xs text-gray-500 mt-1">
                e.g., "2024/2025" or "2024"
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setError(""); // Clear error when going back
                  setStep(1);
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[var(--color-brand-teal)] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Setting Up..." : "Complete Setup"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}