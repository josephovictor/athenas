"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  GraduationCap,
  Home,
  Users,
  BookOpen,
  ClipboardList,
  Bell,
  MessageSquare,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const NAV_ITEMS = [
  { label: "Home", href: "/dashboard", icon: Home, exact: true },
  { label: "People", href: "/dashboard/people", icon: Users, exact: false },
  { label: "Seminar", href: "/dashboard/seminar", icon: BookOpen, exact: false },
  { label: "Project", href: "/dashboard/project", icon: ClipboardList, exact: false },
];

function ProfileMenu({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-[var(--color-brand-slate)] flex items-center justify-center text-xs font-bold text-white">
          {initials}
        </div>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-bold text-[var(--color-brand-dark)] truncate">{name}</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">Coordinator</p>
          </div>
          <Link
            href="/dashboard/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[var(--color-brand-dark)] transition-colors"
          >
            Profile settings
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-brand-danger)] hover:bg-red-50 transition-colors"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const name = (session?.user as any)?.name ?? "Coordinator";

  return (
    <div className="h-screen overflow-hidden bg-white flex text-[var(--color-brand-dark)]">
      {/* SIDEBAR */}
      <aside className="w-56 bg-[var(--color-brand-dark)] text-white flex flex-col fixed h-screen z-20 shrink-0">
        {/* Logo */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[var(--color-brand-teal)] flex items-center justify-center shadow-sm">
              <GraduationCap size={17} strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-wider">Athenas</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="px-3 flex-1 space-y-0.5 text-sm font-medium">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-[var(--color-brand-teal)] text-white"
                    : "text-white/60 hover:bg-white/8 hover:text-white"
                }`}
              >
                <item.icon size={17} strokeWidth={2} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom user strip */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[var(--color-brand-slate)] flex items-center justify-center text-xs font-bold text-white shrink-0">
              {name.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{name}</p>
              <p className="text-xs text-white/40">Coordinator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 ml-56 flex flex-col h-screen overflow-hidden">
        {/* TOP BAR */}
        <header className="shrink-0 h-14 bg-white border-b border-gray-100 flex items-center justify-end px-6 gap-2 z-10">
          {/* Notifications */}
          <Link
            href="/dashboard/notifications"
            className="relative p-2 text-gray-400 hover:text-[var(--color-brand-dark)] hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Bell size={19} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[var(--color-brand-danger)] rounded-full" />
          </Link>

          {/* Messages */}
          <Link
            href="/dashboard/messages"
            className="relative p-2 text-gray-400 hover:text-[var(--color-brand-dark)] hover:bg-gray-50 rounded-lg transition-colors"
          >
            <MessageSquare size={19} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[var(--color-brand-danger)] rounded-full" />
          </Link>

          <div className="w-px h-5 bg-gray-200 mx-1" />

          {/* Profile menu */}
          <ProfileMenu name={name} />
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
