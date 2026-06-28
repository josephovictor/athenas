"use client";

import { useState } from "react";

export default function DeveloperResetPage() {
  const [secret, setSecret] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("Wiping database...");

    try {
      const res = await fetch("/api/dev-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setStatus("✅ " + data.message);
        setSecret("");
      } else {
        setStatus("❌ " + data.error);
      }
    } catch (err) {
      setStatus("❌ An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-red-100">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Developer Reset</h1>
        <p className="text-sm text-gray-500 mb-6">
          Warning: This action is immediate and irreversible. All platform data will be destroyed.
        </p>

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reset Secret</label>
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
              placeholder="Enter RESET_SECRET"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 text-white font-semibold rounded-lg p-3 hover:bg-red-700 disabled:opacity-50 transition-all"
          >
            {isLoading ? "Executing Reset..." : "Wipe Database"}
          </button>
        </form>

        {status && (
          <div className="mt-6 p-4 rounded-lg bg-gray-100 text-sm font-medium text-center">
            {status}
          </div>
        )}
      </div>
    </div>
  );
}