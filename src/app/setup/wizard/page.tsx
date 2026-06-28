"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, ChevronRight, SkipForward, BookOpen, Users, UserCheck, Layers } from "lucide-react";

const STEPS = [
  { id: 1, label: "Cohort details", description: "Name your cohort and set the academic year.", icon: BookOpen },
  { id: 2, label: "Upload students", description: "Import your student list via CSV.", icon: Users },
  { id: 3, label: "Upload lecturers", description: "Import your lecturer list via CSV.", icon: UserCheck },
  { id: 4, label: "Assign roles", description: "Assign supervisors and panelists.", icon: UserCheck },
  { id: 5, label: "Create groups", description: "Create seminar and project groups.", icon: Layers },
];

export default function SetupWizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1 state
  const [cohort, setCohort] = useState({ name: "", academicYear: "" });

  const skipToDashboard = () => router.push("/dashboard");

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/coordinator/cohorts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cohort.name,
          academic_year: cohort.academicYear,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create cohort.");
        return;
      }
      setCurrentStep(2);
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel — step tracker */}
      <aside className="w-72 bg-[var(--color-brand-dark)] text-white flex flex-col p-8 shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-brand-teal)] flex items-center justify-center">
            <GraduationCap size={18} strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold tracking-wide">Athenas</span>
        </div>

        <p className="text-xs font-bold tracking-widest uppercase text-white/40 mb-5">
          Setup wizard
        </p>

        <div className="space-y-1">
          {STEPS.map((step) => {
            const isDone = step.id < currentStep;
            const isActive = step.id === currentStep;
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                  isActive
                    ? "bg-[var(--color-brand-teal)]/20 text-white"
                    : isDone
                    ? "text-white/60"
                    : "text-white/30"
                }`}
              >
                <div
                  className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isDone
                      ? "bg-[var(--color-brand-teal)] text-white"
                      : isActive
                      ? "border-2 border-[var(--color-brand-teal)] text-[var(--color-brand-teal)]"
                      : "border border-white/20 text-white/30"
                  }`}
                >
                  {isDone ? "✓" : step.id}
                </div>
                <div>
                  <p className="text-sm font-semibold leading-tight">{step.label}</p>
                  {isActive && (
                    <p className="text-xs text-white/50 mt-0.5 leading-relaxed">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-auto pt-8 border-t border-white/10">
          <button
            onClick={skipToDashboard}
            className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors font-medium"
          >
            <SkipForward size={15} />
            Skip wizard, go to dashboard
          </button>
          <p className="text-xs text-white/25 mt-2 leading-relaxed">
            You can complete setup from the dashboard at any time.
          </p>
        </div>
      </aside>

      {/* Right panel — step content */}
      <main className="flex-1 flex items-center justify-center p-10">
        <div className="w-full max-w-md">

          {/* Step 1: Cohort Details */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-brand-dark)] mb-1">
                Name your cohort
              </h2>
              <p className="text-sm text-gray-500 mb-8">
                This identifies the academic session you are setting up.
              </p>

              {error && (
                <div className="mb-5 p-3 bg-[var(--color-brand-danger)]/10 text-[var(--color-brand-danger)] text-sm rounded-lg border border-[var(--color-brand-danger)]/20 font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleStep1Submit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                    Cohort name
                  </label>
                  <input
                    type="text"
                    required
                    value={cohort.name}
                    onChange={(e) => setCohort((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. 2024/2025 Final Year"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--color-brand-teal)] focus:ring-1 focus:ring-[var(--color-brand-teal)] outline-none transition-colors text-sm placeholder:text-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                    Academic year
                  </label>
                  <input
                    type="text"
                    required
                    value={cohort.academicYear}
                    onChange={(e) => setCohort((p) => ({ ...p, academicYear: e.target.value }))}
                    placeholder="e.g. 2024/2025"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--color-brand-teal)] focus:ring-1 focus:ring-[var(--color-brand-teal)] outline-none transition-colors text-sm placeholder:text-gray-300"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={skipToDashboard}
                    className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Skip for now
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[var(--color-brand-teal)] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[var(--color-brand-teal)]/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? "Saving…" : (
                      <>Continue <ChevronRight size={16} /></>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Steps 2–5: placeholder until Phase 3 */}
          {currentStep >= 2 && (
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-brand-dark)] mb-1">
                {STEPS[currentStep - 1]?.label}
              </h2>
              <p className="text-sm text-gray-500 mb-8">
                {STEPS[currentStep - 1]?.description}
              </p>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center mb-6">
                <p className="text-sm text-gray-500 font-medium">
                  This step can be completed from the dashboard under the{" "}
                  <span className="font-bold text-[var(--color-brand-dark)]">People</span> section.
                </p>
              </div>

              <div className="flex gap-3">
                {currentStep < 5 && (
                  <button
                    onClick={() => setCurrentStep((s) => s + 1)}
                    className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    Next step <ChevronRight size={16} />
                  </button>
                )}
                <button
                  onClick={skipToDashboard}
                  className="flex-1 bg-[var(--color-brand-teal)] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[var(--color-brand-teal)]/90 transition-colors"
                >
                  Go to dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
