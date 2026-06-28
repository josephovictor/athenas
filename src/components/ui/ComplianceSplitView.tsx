"use client";

import { Mail } from "lucide-react";

export type ComplianceEntry = {
  name: string;
  matNumber?: string;
  userId?: string;
  id?: string;
};

export type ComplianceData = {
  activated: number;
  notActivated: number;
  activatedList: ComplianceEntry[];
  notActivatedList: ComplianceEntry[];
};

interface ComplianceSplitViewProps {
  data: ComplianceData;
  tab: "compliant" | "not_compliant";
  onTabChange: (t: "compliant" | "not_compliant") => void;
  onResend: (userId: string) => void;
  className?: string;
}

export default function ComplianceSplitView({
  data,
  tab,
  onTabChange,
  onResend,
  className = "",
}: ComplianceSplitViewProps) {
  const list = tab === "compliant" ? data.activatedList : data.notActivatedList;

  return (
    <div
      className={`col-span-full mt-1 bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm ${className}`}
    >
      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        {(["compliant", "not_compliant"] as const).map((t) => (
          <button
            key={t}
            onClick={() => onTabChange(t)}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              tab === t
                ? "text-[var(--color-brand-teal)] border-b-2 border-[var(--color-brand-teal)]"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {t === "compliant"
              ? `Activated (${data.activated})`
              : `Not Activated (${data.notActivated})`}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="max-h-56 overflow-y-auto divide-y divide-gray-50">
        {list.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8 font-medium">No records.</p>
        ) : (
          list.map((entry, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2.5 px-5 hover:bg-gray-50"
            >
              <div>
                <p className="text-sm font-semibold text-[var(--color-brand-dark)]">{entry.name}</p>
                {entry.matNumber && (
                  <p className="text-xs text-gray-400">{entry.matNumber}</p>
                )}
              </div>
              {tab === "not_compliant" && entry.userId && (
                <button
                  onClick={() => onResend(entry.userId!)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-brand-teal)] hover:text-[var(--color-brand-slate)] transition-colors"
                >
                  <Mail size={13} />
                  Resend invitation
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
