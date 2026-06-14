"use client";

import { useState } from "react";
import SubmissionProgress from "@/components/SubmissionProgress";
import { ChevronDown, Bell, MessageSquare, Send } from "lucide-react";

export default function DashboardOverview() {
  const [viewMode, setViewMode] = useState("Project View");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    // We use h-full to take up the full height of the layout's main container
    <div className="flex flex-col h-full">
      
      {/* 1. THE MISSING HEADER (Rectangles & Icons - Only on Home Page) */}
      <header className="shrink-0 bg-white/90 backdrop-blur-md px-6 md:px-10 py-6 border-b border-[var(--color-brand-light)]/70">
        <div className="flex flex-col md:flex-row items-center gap-6 w-full">
          
          {/* 90% ZONE: The Data Grid */}
          <div className="w-full md:w-[90%] order-2 md:order-1 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white px-5 py-3 rounded-xl border border-[var(--color-brand-light)] shadow-sm">
              <p className="text-gray-500 text-[10px] font-bold tracking-wider uppercase mb-0.5">Students</p>
              <p className="text-3xl font-bold text-[var(--color-brand-dark)]">120</p>
            </div>
            <div className="bg-white px-5 py-3 rounded-xl border border-[var(--color-brand-light)] shadow-sm">
              <p className="text-gray-500 text-[10px] font-bold tracking-wider uppercase mb-0.5">Supervisors</p>
              <p className="text-3xl font-bold text-[var(--color-brand-dark)]">18</p>
            </div>
            <div className="bg-white px-5 py-3 rounded-xl border border-[var(--color-brand-light)] shadow-sm">
              <p className="text-gray-500 text-[10px] font-bold tracking-wider uppercase mb-0.5">Panelists</p>
              <p className="text-3xl font-bold text-[var(--color-brand-dark)]">6</p>
            </div>
            <div className="bg-white px-5 py-3 rounded-xl border border-[var(--color-brand-light)] shadow-sm">
              <p className="text-gray-500 text-[10px] font-bold tracking-wider uppercase mb-0.5">Groups</p>
              <p className="text-3xl font-bold text-[var(--color-brand-dark)]">12</p>
            </div>
          </div>

          {/* 10% ZONE: The Icons */}
          <div className="w-full md:w-[10%] order-1 md:order-2 flex justify-end md:justify-center items-center gap-4 pb-4 md:pb-0 border-b md:border-b-0 md:border-l border-[var(--color-brand-light)]/70">
            <button className="relative p-2 text-[var(--color-brand-dark)]/70 hover:text-[var(--color-brand-dark)] transition-colors">
              <MessageSquare size={22} />
            </button>
            <button className="relative p-2 text-[var(--color-brand-dark)]/70 hover:text-[var(--color-brand-dark)] transition-colors">
              <Bell size={22} />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-[var(--color-brand-danger)] rounded-full border border-white"></span>
            </button>
          </div>
          
        </div>
      </header>

      {/* 2. THE MAIN CONTENT AREA (Progress Trackers) */}
      <div className="flex-1 overflow-hidden flex flex-col w-[95%] mx-auto pt-8">
        
        {/* TOP CONTROLS (Pinned) */}
        <div className="shrink-0 flex justify-end items-center gap-3 mb-6">
          <div className="relative">
            <button 
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
              className="flex items-center justify-between w-40 bg-white border border-[var(--color-brand-light)] text-[var(--color-brand-dark)] text-sm font-medium py-2.5 px-4 rounded-lg outline-none focus:border-[var(--color-brand-teal)] focus:ring-1 focus:ring-[var(--color-brand-teal)] transition-all shadow-sm cursor-pointer"
            >
              <span>{viewMode}</span>
              <ChevronDown size={16} className={`text-gray-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 w-full bg-white border border-[var(--color-brand-light)] rounded-lg shadow-lg overflow-hidden z-20 py-1">
                <div 
                  onClick={() => { setViewMode("Project View"); setIsDropdownOpen(false); }}
                  className="px-4 py-2.5 text-sm text-[var(--color-brand-dark)] hover:bg-[var(--color-brand-teal)] hover:text-white transition-colors cursor-pointer"
                >
                  Project View
                </div>
                <div 
                  onClick={() => { setViewMode("Panel View"); setIsDropdownOpen(false); }}
                  className="px-4 py-2.5 text-sm text-[var(--color-brand-dark)] hover:bg-[var(--color-brand-teal)] hover:text-white transition-colors cursor-pointer"
                >
                  Panel View
                </div>
              </div>
            )}
          </div>
          
          <button className="bg-[var(--color-brand-teal)] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--color-brand-teal)]/90 active:bg-[var(--color-brand-slate)] transition-colors shadow-sm flex items-center gap-2">
            Apply View
          </button>
        </div>

        {/* PROGRESS TRACKERS (Independent Scrollable Zone) */}
        <div className="flex-1 overflow-y-auto pr-3 space-y-4 pb-2">
          <SubmissionProgress groupName="Group A" submitted={8} total={12} />
          <SubmissionProgress groupName="Group B" submitted={12} total={12} />
          <SubmissionProgress groupName="Group C" submitted={4} total={12} />
          <SubmissionProgress groupName="Group D" submitted={12} total={12} />
          <SubmissionProgress groupName="Group E" submitted={9} total={12} />
          <SubmissionProgress groupName="Group F" submitted={12} total={12} />
          <SubmissionProgress groupName="Group G" submitted={1} total={12} />
          <SubmissionProgress groupName="Group H" submitted={11} total={12} />
          <SubmissionProgress groupName="Group I" submitted={6} total={12} />
          <SubmissionProgress groupName="Group J" submitted={12} total={12} />
          <SubmissionProgress groupName="Group K" submitted={7} total={12} />
          <SubmissionProgress groupName="Group L" submitted={3} total={12} />
        </div>

        {/* FIXED FOOTER AREA */}
        <div className="shrink-0 mt-4 bg-white pt-2 pb-6">
          <div className="w-full border-t border-[var(--color-brand-light)] mb-5"></div>

          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <button disabled={true} className="bg-gray-100 text-gray-400 border border-gray-200 px-6 py-2.5 rounded-lg text-sm font-medium cursor-not-allowed">
                Open files to panelists
              </button>
              
              <button className="bg-[var(--color-brand-teal)] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--color-brand-teal)]/90 flex items-center gap-2 transition-colors shadow-sm">
              <Send size={16} />
              Send broadcast
            </button>
            </div>

            <div className="text-xs text-[var(--color-brand-dark)]/60 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--color-brand-accent)]"></span>
              2023/2024 cohort · single active cohort
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}