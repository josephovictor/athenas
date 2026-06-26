"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SubmissionProgress from "@/components/SubmissionProgress";
import BroadcastModal from "@/components/broadcast/BroadcastModal";

import { 
  ChevronDown, Bell, MessageSquare, Send, CheckCircle2, Search, 
  Users, UserCheck, Shield, Layers 
} from "lucide-react";


export default function DashboardOverview() {
  const router = useRouter();
  const [coordinatorData, setCoordinatorData] = useState(null);
  // =========================================================================
  // 1. UI STATE MANAGEMENT
  // =========================================================================
  const [viewMode, setViewMode] = useState("Project View");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [broadcastContext, setBroadcastContext] = useState("");

  // =========================================================================
  // 2. DATA STATE (Now fetched from API)
  // =========================================================================
  const [metricsData, setMetricsData] = useState<Record<string, any>>({
    "Project View": {
      students: { assigned: 0, total: 0 },
      supervisors: { assigned: 0, total: 0 },
      panelists: 0,
      activeGroups: 0
    },
    "Seminar View": {
      students: { assigned: 0, total: 0 },
      supervisors: { assigned: 0, total: 0 },
      panelists: 0,
      activeGroups: 0
    }
  });

  const [projectProgressData, setProjectProgressData] = useState<any[]>([]);
  const [seminarProgressData, setSeminarProgressData] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // Fetch data from API
  const fetchDashboardData = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/coordinator/dashboard", {
        // Add cache-busting to get fresh data
        cache: "no-store"
      });
      const data = await res.json();
      
      if (res.ok) {
        // Map API data to UI structure
        setMetricsData({
          "Project View": {
            students: { 
              assigned: data.metrics.studentsAssignedToProject, 
              total: data.metrics.totalStudents 
            },
            supervisors: { 
              assigned: data.metrics.supervisorsAssigned, 
              total: data.metrics.totalLecturers 
            },
            panelists: data.metrics.totalExternalPanelists,
            activeGroups: data.metrics.totalProjectGroups
          },
          "Seminar View": {
            students: { 
              assigned: data.metrics.studentsAssignedToSeminar, 
              total: data.metrics.totalStudents 
            },
            supervisors: { assigned: 0, total: 0 },
            panelists: data.metrics.totalExternalPanelists,
            activeGroups: data.metrics.totalSeminarGroups
          }
        });

        setProjectProgressData(data.projectProgress || []);
        setSeminarProgressData(data.seminarProgress || []);
        setHasLoadedOnce(true);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const currentMetrics = metricsData[viewMode];
  const currentProgressDataset = viewMode === "Project View" ? projectProgressData : seminarProgressData;

  // Feature Flag: Determines if supervisors exist in the current view
  const isSupervisorActive = viewMode === "Project View";

  // =========================================================================
  // 3. ROUTING LOGIC
  // =========================================================================
  const handleCardClick = (cardType: "students" | "supervisors" | "panelists" | "groups") => {
    if (cardType === "students") {
      router.push("/dashboard/users?tab=Students");
      return;
    }

    if (cardType === "supervisors" && !isSupervisorActive) {
      return;
    }

    const destinationPage = viewMode === "Project View" ? "project" : "seminar";
    
    switch (cardType) {
      case "supervisors":
        router.push(`/dashboard/${destinationPage}?tab=Supervisors`);
        break;
      case "panelists":
        router.push(`/dashboard/${destinationPage}?tab=Panelists`);
        break;
      case "groups":
        router.push(`/dashboard/${destinationPage}?tab=Groups`);
        break;
    }
  };



  // Show minimal loading only on FIRST load
  if (!hasLoadedOnce) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-5 h-5 border-2 border-[var(--color-brand-teal)] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium">Loading dashboard...</p>        
        </div>
      </div>
    );
  }

  

  

  {/*MAIN RENDER*/}
  return (
    <div className="flex flex-col h-full w-full bg-white overflow-hidden relative">
      
      {/* Refresh indicator (subtle) */}
      {isRefreshing && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 z-50">
          <div className="h-full bg-[var(--color-brand-teal)] animate-pulse w-1/3"></div>
        </div>
      )}
      
      {/* THE HEADER */}
      <header className="shrink-0 bg-white border-b border-[var(--color-brand-light)]/70 px-6 md:px-10 py-6">
        <div className="flex flex-col md:flex-row items-center gap-6 w-full">
          
          <div className="w-full md:w-[90%] order-2 md:order-1 grid grid-cols-2 md:grid-cols-4 gap-5">
            {/* Card 1: Students */}
            <div onClick={() => handleCardClick("students")} className="relative bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#417676]/30 transition-all overflow-hidden group cursor-pointer">
              <div className="absolute -right-3 -bottom-3 text-[var(--color-brand-teal)] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <Users size={90} />
              </div>
              <div className="relative z-10 flex justify-between items-start mb-3">
                <p className="text-gray-500 text-[11px] font-bold tracking-wider uppercase">Assigned Students</p>
                <div className="bg-[#EEF5F4] text-[#417676] p-2 rounded-lg shadow-sm"><Users size={16} strokeWidth={2.5} /></div>
              </div>
              <p className="relative z-10 text-3xl font-extrabold text-[var(--color-brand-dark)]">
                {currentMetrics.students.assigned} <span className="text-lg text-gray-400 font-bold tracking-normal">/ {currentMetrics.students.total}</span>
              </p>
            </div>

            {/* Card 2: Supervisors (DYNAMIC STATE) */}
            <div 
              onClick={() => handleCardClick("supervisors")} 
              className={`relative bg-white p-5 rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all ${
                isSupervisorActive 
                  ? "hover:shadow-md hover:border-[#417676]/30 cursor-pointer group" 
                  : "opacity-60 cursor-not-allowed bg-gray-50/50"
              }`}
            >
              <div className="absolute -right-3 -bottom-3 text-[var(--color-brand-teal)] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <UserCheck size={90} />
              </div>
              <div className="relative z-10 flex justify-between items-start mb-3">
                <p className="text-gray-500 text-[11px] font-bold tracking-wider uppercase">Assigned Supervisors</p>
                <div className={`p-2 rounded-lg shadow-sm ${isSupervisorActive ? "bg-[#EEF5F4] text-[#417676]" : "bg-gray-100 text-gray-400"}`}>
                  <UserCheck size={16} strokeWidth={2.5} />
                </div>
              </div>
              <p className="relative z-10 text-3xl font-extrabold text-[var(--color-brand-dark)]">
                {isSupervisorActive ? (
                  <>
                    {currentMetrics.supervisors.assigned} <span className="text-lg text-gray-400 font-bold tracking-normal">/ {currentMetrics.supervisors.total}</span>
                  </>
                ) : (
                  <span className="text-gray-400 tracking-wide text-2xl">NIL</span>
                )}
              </p>
            </div>

            {/* Card 3: Panelists */}
            <div onClick={() => handleCardClick("panelists")} className="relative bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#417676]/30 transition-all overflow-hidden group cursor-pointer">
              <div className="absolute -right-3 -bottom-3 text-[var(--color-brand-teal)] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <Shield size={90} />
              </div>
              <div className="relative z-10 flex justify-between items-start mb-3">
                <p className="text-gray-500 text-[11px] font-bold tracking-wider uppercase">Panelists</p>
                <div className="bg-[#EEF5F4] text-[#417676] p-2 rounded-lg shadow-sm"><Shield size={16} strokeWidth={2.5} /></div>
              </div>
              <p className="relative z-10 text-3xl font-extrabold text-[var(--color-brand-dark)]">{currentMetrics.panelists}</p>
            </div>

            {/* Card 4: Groups */}
            <div onClick={() => handleCardClick("groups")} className="relative bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#417676]/30 transition-all overflow-hidden group cursor-pointer">
              <div className="absolute -right-3 -bottom-3 text-[var(--color-brand-teal)] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <Layers size={90} />
              </div>
              <div className="relative z-10 flex justify-between items-start mb-3">
                <p className="text-gray-500 text-[11px] font-bold tracking-wider uppercase">Active Groups</p>
                <div className="bg-[#EEF5F4] text-[#417676] p-2 rounded-lg shadow-sm"><Layers size={16} strokeWidth={2.5} /></div>
              </div>
              <p className="relative z-10 text-3xl font-extrabold text-[var(--color-brand-dark)]">{currentMetrics.activeGroups}</p>
            </div>
          </div>

          <div className="w-full md:w-[10%] order-1 md:order-2 flex justify-end md:justify-center items-center gap-4 pb-4 md:pb-0 border-b md:border-b-0 border-[var(--color-brand-light)]/70">
  
            {/* MESSAGES BUTTON */}
            <button 
              type="button"
              onMouseDown={() => router.push("/dashboard/messages")} 
              className="relative p-2 text-gray-500 hover:bg-gray-50 hover:text-[var(--color-brand-dark)] transition-colors rounded-lg"
            >
              <MessageSquare size={22} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#A32A2A] rounded-full border-2 border-white box-content"></span>
            </button>

            {/* VERTICAL DIVIDER BETWEEN ICONS */}
            <div className="h-6 w-px bg-gray-200"></div>

            {/* NOTIFICATIONS BUTTON */}
            <button 
              type="button"
              onMouseDown={() => router.push("/dashboard/notifications")} 
              className="relative p-2 text-gray-500 hover:bg-gray-50 hover:text-[var(--color-brand-dark)] transition-colors rounded-lg"
            >
              <Bell size={22} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#A32A2A] rounded-full border-2 border-white box-content"></span>
            </button>

          </div>
        </div>
      </header>

      {/* WORKSPACE ZONE */}
      <div className="flex-1 overflow-hidden flex flex-col w-[95%] mx-auto pt-8">
      
        {/* RE-DESIGNED TOP CONTROLS */}
        <div className="shrink-0 flex items-center gap-4 mb-6 pr-3">
          <div className="relative flex-1 shadow-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder={`Search submission tracking within ${viewMode}...`} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 h-10 bg-white border border-gray-200 rounded-lg text-sm text-[var(--color-brand-dark)] focus:outline-none focus:border-[var(--color-brand-teal)] transition-shadow"
            />
          </div>

          <div className="relative shrink-0">
            <button 
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
              className="flex items-center justify-between w-52 bg-white border border-gray-200 text-[var(--color-brand-dark)] text-sm font-bold py-2 px-4 rounded-lg outline-none hover:border-gray-300 focus:border-[var(--color-brand-teal)] shadow-sm cursor-pointer transition-all h-10"
            >
              <span>{viewMode}</span>
              <ChevronDown size={16} className={`text-gray-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-full bg-white border border-gray-100 rounded-lg shadow-xl overflow-hidden z-20 py-1 origin-top-right animate-in fade-in zoom-in-95 duration-100">
                <div 
                  onMouseDown={() => { 
                    setViewMode("Project View"); 
                    setSearchQuery(""); 
                    setIsDropdownOpen(false); 
                  }}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[var(--color-brand-teal)] cursor-pointer transition-colors"
                >
                  Project View
                </div>
                <div 
                  onMouseDown={() => { 
                    setViewMode("Seminar View"); 
                    setSearchQuery(""); 
                    setIsDropdownOpen(false); 
                  }}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[var(--color-brand-teal)] cursor-pointer transition-colors"
                >
                  Seminar View
                </div>
              </div>
            )}
          </div>
        </div>

        {/* WORKFLOW TRACKERS */}
        <div className="flex-1 overflow-y-auto pr-3 space-y-4 pb-2 custom-scrollbar">
          {currentProgressDataset
            .filter(item => item.groupName.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((track) => (
              <SubmissionProgress 
                key={track.groupName}
                groupName={track.groupName} 
                submitted={track.submitted} 
                total={track.total} 
              />
          ))}
          
          {currentProgressDataset.filter(item => item.groupName.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
            <div className="flex items-center justify-center p-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
              <p className="text-sm text-gray-500 font-medium">No tracking data matches your search.</p>
            </div>
          )}
        </div>

        

        {/* BOTTOM ACTION PANEL */}
        <div className="shrink-0 mt-4 bg-white pt-2 pb-6">
          <div className="w-full border-t border-[var(--color-brand-light)] mb-5"></div>
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <button disabled className="bg-gray-100 text-gray-400 border border-gray-200 px-6 py-2.5 rounded-lg text-sm font-medium cursor-not-allowed shadow-sm">
                Open files to panelists
              </button>
              
              <button 
                onClick={() => { 
                  setBroadcastContext(viewMode === "Project View" ? "@project-all" : "@seminar-all"); 
                  setIsBroadcastOpen(true); 
                }}
                className="bg-[var(--color-brand-teal)] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-95 flex items-center gap-2 shadow-sm transition-all"
              >
                <Send size={16} />
                Send broadcast
              </button>
            </div>

            <div className="text-sm text-gray-400 flex items-center gap-2 font-medium">
              <CheckCircle2 size={16} className="text-[#417676]" />
              All records synchronised
            </div>
          </div>
        </div>

      </div>

      <BroadcastModal 
        isOpen={isBroadcastOpen} 
        onClose={() => setIsBroadcastOpen(false)} 
        defaultTarget={broadcastContext} 
      />

    </div>
  );
}