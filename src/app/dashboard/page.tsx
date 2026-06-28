"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BookOpen,
  ClipboardList,
  Users,
  UserCheck,
  Shield,
  GraduationCap,
  ChevronDown,
  RefreshCw,
} from "lucide-react";

import ComplianceSplitView from "@/components/ui/ComplianceSplitView";
import type { ComplianceData, ComplianceEntry } from "@/components/ui/ComplianceSplitView";

// ─── Types ───────────────────────────────────────────────────────────────────

type CategoryItem = Record<string, string | number | boolean | null>;

type Category = {
  count: number;
  items: CategoryItem[];
};


type DashboardData = {
  categories: {
    seminarGroups: Category;
    projectGroups: Category;
    lecturers: Category;
    students: Category;
    supervisors: Category;
    seminarPanelists: Category;
    projectPanelists: Category;
  };
  compliance: {
    students: ComplianceData;
    lecturers: ComplianceData;
    panelists: ComplianceData;
  };
};

// ─── Skeleton ────────────────────────────────────────────────────────────────

function SkeletonCard({ wide = false }: { wide?: boolean }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 p-5 animate-pulse ${wide ? "col-span-1" : ""}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="h-2.5 w-24 bg-gray-200 rounded-full" />
        <div className="w-8 h-8 bg-gray-100 rounded-lg" />
      </div>
      <div className="h-8 w-12 bg-gray-200 rounded-lg" />
    </div>
  );
}

function SkeletonComplianceCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
      <div className="h-2.5 w-20 bg-gray-200 rounded-full mb-4" />
      <div className="h-5 w-28 bg-gray-200 rounded-lg mb-2" />
      <div className="h-3 w-20 bg-gray-100 rounded-full" />
    </div>
  );
}

// ─── Metric Card ─────────────────────────────────────────────────────────────

type MetricCardProps = {
  id: string;
  label: string;
  count: number;
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
};

function MetricCard({ label, count, icon: Icon, isActive, onClick }: MetricCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-white rounded-xl border p-5 transition-all hover:shadow-sm group ${
        isActive
          ? "border-[var(--color-brand-teal)] shadow-sm"
          : "border-gray-100 hover:border-[var(--color-brand-teal)]/40"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-bold tracking-widest uppercase text-gray-400">{label}</p>
        <div
          className={`p-2 rounded-lg transition-colors ${
            isActive
              ? "bg-[var(--color-brand-teal)] text-white"
              : "bg-gray-50 text-gray-400 group-hover:bg-[var(--color-brand-teal)]/10 group-hover:text-[var(--color-brand-teal)]"
          }`}
        >
          <Icon size={15} strokeWidth={2.5} />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-extrabold text-[var(--color-brand-dark)]">{count}</span>
        <ChevronDown
          size={15}
          className={`text-gray-300 mb-1 transition-transform ${isActive ? "rotate-180 text-[var(--color-brand-teal)]" : ""}`}
        />
      </div>
    </button>
  );
}

// ─── Inline Expansion Panel ───────────────────────────────────────────────────

function ExpansionPanel({
  id,
  items,
}: {
  id: string;
  items: CategoryItem[];
}) {
  if (items.length === 0) {
    return (
      <div className="col-span-full mt-1 bg-gray-50 border border-gray-100 rounded-xl px-6 py-8 text-center">
        <p className="text-sm text-gray-400 font-medium">No records yet.</p>
      </div>
    );
  }

  // Render varies by category
  const renderRow = (item: CategoryItem, index: number) => {
    if (id === "seminarGroups") {
      return (
        <div key={index} className="flex items-center justify-between py-2.5 px-4 hover:bg-gray-50 rounded-lg">
          <span className="text-sm font-semibold text-[var(--color-brand-dark)]">{String(item.name)}</span>
          <span className="text-xs text-gray-400 font-medium">{String(item.memberCount)} members</span>
        </div>
      );
    }
    if (id === "projectGroups") {
      return (
        <div key={index} className="flex items-center justify-between py-2.5 px-4 hover:bg-gray-50 rounded-lg">
          <span className="text-sm font-semibold text-[var(--color-brand-dark)]">{String(item.name)}</span>
          <div className="text-right">
            <p className="text-xs text-gray-500 font-medium">{String(item.supervisor)}</p>
            <p className="text-xs text-gray-400">{String(item.memberCount)} members</p>
          </div>
        </div>
      );
    }
    if (id === "lecturers") {
      return (
        <div key={index} className="flex items-center justify-between py-2.5 px-4 hover:bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-semibold text-[var(--color-brand-dark)]">{String(item.name)}</p>
            <p className="text-xs text-gray-400 mt-0.5">{String(item.specialization)}</p>
          </div>
          <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
            {String(item.roles)}
          </span>
        </div>
      );
    }
    if (id === "students") {
      return (
        <div key={index} className="flex items-center justify-between py-2.5 px-4 hover:bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-semibold text-[var(--color-brand-dark)]">{String(item.name)}</p>
            <p className="text-xs text-gray-400">{String(item.matNumber)}</p>
          </div>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              item.activated
                ? "bg-green-50 text-green-700"
                : "bg-amber-50 text-amber-600"
            }`}
          >
            {item.activated ? "Activated" : "Pending"}
          </span>
        </div>
      );
    }
    if (id === "supervisors") {
      return (
        <div key={index} className="flex items-center justify-between py-2.5 px-4 hover:bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-semibold text-[var(--color-brand-dark)]">{String(item.name)}</p>
            <p className="text-xs text-gray-400 mt-0.5">{String(item.specialization)}</p>
          </div>
          <span className="text-xs text-gray-500 font-medium">{String(item.projectGroup)}</span>
        </div>
      );
    }
    if (id === "seminarPanelists" || id === "projectPanelists") {
      return (
        <div key={index} className="flex items-center justify-between py-2.5 px-4 hover:bg-gray-50 rounded-lg">
          <p className="text-sm font-semibold text-[var(--color-brand-dark)]">{String(item.name)}</p>
          {item.type && (
            <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-medium">
              {String(item.type)}
            </span>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="col-span-full mt-1 bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
      <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
        {items.map((item, i) => renderRow(item, i))}
      </div>
    </div>
  );
}

// ─── Compliance Card ──────────────────────────────────────────────────────────

type ComplianceCardProps = {
  id: string;
  label: string;
  data: ComplianceData;
  isActive: boolean;
  onClick: () => void;
};

function ComplianceCard({ label, data, isActive, onClick }: ComplianceCardProps) {
  const total = data.activated + data.notActivated;
  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-white rounded-xl border p-5 transition-all hover:shadow-sm ${
        isActive ? "border-[var(--color-brand-teal)] shadow-sm" : "border-gray-100 hover:border-gray-200"
      }`}
    >
      <p className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-3">{label}</p>
      <div className="space-y-1">
        <p className="text-sm font-bold text-[var(--color-brand-dark)]">
          {data.activated}{" "}
          <span className="font-normal text-gray-400">activated</span>
        </p>
        {data.notActivated > 0 && (
          <p className="text-sm font-bold text-amber-600">
            {data.notActivated}{" "}
            <span className="font-normal text-amber-500">not activated</span>
          </p>
        )}
        {data.notActivated === 0 && total > 0 && (
          <p className="text-xs text-green-600 font-semibold">All activated ✓</p>
        )}
      </div>
      <ChevronDown
        size={14}
        className={`mt-3 text-gray-300 transition-transform ${isActive ? "rotate-180 text-[var(--color-brand-teal)]" : ""}`}
      />
    </button>
  );
}

// ─── Compliance Split View ────────────────────────────────────────────────────


// ─── Row config ──────────────────────────────────────────────────────────────

const ROW_DEFINITIONS = [
  {
    row: 1,
    cols: "grid-cols-3",
    cards: [
      { id: "seminarGroups", label: "Seminar Groups", icon: BookOpen },
      { id: "projectGroups", label: "Project Groups", icon: ClipboardList },
      { id: "lecturers", label: "Lecturers", icon: GraduationCap },
    ],
  },
  {
    row: 2,
    cols: "grid-cols-2",
    cards: [
      { id: "students", label: "Students", icon: Users },
      { id: "supervisors", label: "Supervisors", icon: UserCheck },
    ],
  },
  {
    row: 3,
    cols: "grid-cols-2",
    cards: [
      { id: "seminarPanelists", label: "Seminar Panelists", icon: Shield },
      { id: "projectPanelists", label: "Project Panelists", icon: Shield },
    ],
  },
] as const;

const COMPLIANCE_CARDS = [
  { id: "students", label: "Students" },
  { id: "lecturers", label: "Lecturers" },
  { id: "panelists", label: "External Panelists" },
] as const;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardHome() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [expandedCompliance, setExpandedCompliance] = useState<string | null>(null);
  const [complianceTab, setComplianceTab] = useState<"compliant" | "not_compliant">("not_compliant");

  const fetchData = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const res = await fetch("/api/coordinator/dashboard", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      // fail silently
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleCard = (id: string) => {
    setExpandedCard((prev) => (prev === id ? null : id));
    setExpandedCompliance(null);
  };

  const toggleCompliance = (id: string) => {
    setExpandedCompliance((prev) => (prev === id ? null : id));
    setExpandedCard(null);
    setComplianceTab("not_compliant");
  };

  const handleResend = async (userId: string) => {
    // Wire up to resend invitation API in Phase 7
    console.log("Resend invitation for user:", userId);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-brand-dark)]">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">Cohort overview</p>
        </div>
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-[var(--color-brand-dark)] transition-colors font-medium"
        >
          <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* ── METRIC CARDS ── */}
      <section className="space-y-3">
        {loading
          ? ROW_DEFINITIONS.map(({ row, cols, cards }) => (
              <div key={row} className={`grid ${cols} gap-3`}>
                {cards.map((c) => <SkeletonCard key={c.id} />)}
              </div>
            ))
          : ROW_DEFINITIONS.map(({ row, cols, cards }) => (
              <div key={row}>
                <div className={`grid ${cols} gap-3`}>
                  {cards.map((card) => {
                    const cat = data?.categories[card.id as keyof typeof data.categories];
                    return (
                      <MetricCard
                        key={card.id}
                        id={card.id}
                        label={card.label}
                        count={cat?.count ?? 0}
                        icon={card.icon}
                        isActive={expandedCard === card.id}
                        onClick={() => toggleCard(card.id)}
                      />
                    );
                  })}

                  {/* Inline expansion for this row */}
                  {cards.some((c) => c.id === expandedCard) && data && (
                    <ExpansionPanel
                      id={expandedCard!}
                      items={
                        data.categories[expandedCard as keyof typeof data.categories]?.items ?? []
                      }
                    />
                  )}
                </div>
              </div>
            ))}
      </section>

      {/* ── COMPLIANCE CARDS ── */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4 rounded-full bg-[var(--color-brand-teal)]" />
          <h2 className="text-sm font-bold text-gray-500 tracking-wide uppercase text-[11px]">
            Account activation
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {loading
            ? COMPLIANCE_CARDS.map((c) => <SkeletonComplianceCard key={c.id} />)
            : COMPLIANCE_CARDS.map((card) => {
                const comp = data?.compliance[card.id as keyof typeof data.compliance];
                if (!comp) return null;
                return (
                  <ComplianceCard
                    key={card.id}
                    id={card.id}
                    label={card.label}
                    data={comp}
                    isActive={expandedCompliance === card.id}
                    onClick={() => toggleCompliance(card.id)}
                  />
                );
              })}

          {/* Compliance split view */}
          {expandedCompliance && data && (
            <ComplianceSplitView
              data={data.compliance[expandedCompliance as keyof typeof data.compliance]}
              tab={complianceTab}
              onTabChange={setComplianceTab}
              onResend={handleResend}
            />
          )}
        </div>
      </section>
    </div>
  );
}
