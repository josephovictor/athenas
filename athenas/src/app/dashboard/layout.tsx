"use client";

import Link from "next/link";
import { 
  Bell, 
  MessageSquare, 
  GraduationCap, 
  Home, 
  Users, 
  BookOpen, 
  ClipboardList 
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden bg-white flex text-[var(--color-brand-dark)]">
      {/* SIDEBAR ONLY */}
      <aside className="w-64 bg-[var(--color-brand-dark)] text-white flex flex-col z-20 fixed h-screen">
        <div className="p-6 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-brand-teal)] flex items-center justify-center text-white shadow-sm">
              <GraduationCap size={20} strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-bold tracking-wider">Athenas</h2>
          </div>
        </div>

        <nav className="px-4 pb-6 space-y-2 text-sm font-medium border-b border-white/10">
          <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors">
            <Home size={18} /> Home
          </Link>
          <Link href="/dashboard/people" className="flex items-center gap-3 p-3 rounded-lg text-[var(--color-brand-light)] hover:bg-white/10 transition-colors">
            <Users size={18} /> Users
          </Link>
          <Link href="/dashboard/seminar" className="flex items-center gap-3 p-3 rounded-lg text-[var(--color-brand-light)] hover:bg-white/10 transition-colors">
            <BookOpen size={18} /> Seminar
          </Link>
          <Link href="/dashboard/project" className="flex items-center gap-3 p-3 rounded-lg text-[var(--color-brand-light)] hover:bg-white/10 transition-colors">
            <ClipboardList size={18} /> Project
          </Link>
        </nav>

        <div className="flex-1"></div>

        <Link href="/dashboard/profile" className="p-6 pt-5 flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer border-t border-white/10">
          <div className="w-10 h-10 rounded-full bg-[var(--color-brand-slate)] flex items-center justify-center text-xs font-bold text-white shadow-sm">
            CO
          </div>
          <div>
            <p className="text-sm font-bold text-white">Coordinator</p>
            <p className="text-xs text-[var(--color-brand-light)]/70 font-normal">Admin</p>
          </div>
        </Link>
      </aside>

      {/* BLANK MAIN CANVAS FOR PAGES */}
      <main className="flex-1 ml-64 flex flex-col h-screen">
        {children}
      </main>
    </div>
  );
}