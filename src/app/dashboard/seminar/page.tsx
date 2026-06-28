"use client";

/* ========================================= */
/* 1. IMPORTS                                */
/* ========================================= */
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation"; 
import { Bell, MessageSquare, Search, Plus, Minus, Users, X, Send, ChevronDown, CheckCircle2, XCircle, Mail, ShieldAlert } from "lucide-react";

import CreateGroupModal from "@/components/groups/CreateGroupModal";
import AddCriterionModal from "@/components/defence/AddCriterionModal";
import BroadcastModal from "@/components/broadcast/BroadcastModal";
import GroupDetailView from "@/components/groups/GroupDetailView";

import AssignLecturerModal, { AssignmentRole, Lecturer } from "@/components/Assign/AssignLecturerModal";

// Add these to your states:

/* ========================================= */
/* 2. INTERNAL COMPONENT                     */
/* ========================================= */
function SeminarPortalContent() {
  // --- URL & PARAMS ---
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlTab = searchParams.get("tab"); 

  // --- USE STATES ---
  const [activeCard, setActiveCard] = useState(urlTab || "Proposals");
  const [searchQuery, setSearchQuery] = useState("");
  const [batchSize, setBatchSize] = useState(3);
  const [isAddCriterionOpen, setIsAddCriterionOpen] = useState(false);

  //Assign Modal States -- For supervisor, panellist etc.
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignmentRole, setAssignmentRole] = useState<AssignmentRole | null>(null);
  const [targetGroup, setTargetGroup] = useState<{ id: string; name: string } | null>(null);
  
  // Broadcast Modal State
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [broadcastContext, setBroadcastContext] = useState("");
  
  // Interactive Detail States
  const [selectedGroupDetail, setSelectedGroupDetail] = useState<any | null>(null);
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<any | null>(null);
  
  // Foldable States for Submission Tab
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  
  // Create group modal state
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

  // Defence Tab Rubric
  const [rubric, setRubric] = useState([
    { id: "1", label: "Presentation Quality", score: 10 },
    { id: "2", label: "Content Depth", score: 15 },
    { id: "3", label: "Clarity of Delivery", score: 10 },
    { id: "4", label: "Response to Questions", score: 15 },
  ]);

  // Main Groups State
  const [groups, setGroups] = useState([
    {
      id: "A", name: "Group A", membersCount: 3,
      panelists: [
        { name: "Dr. Okonkwo, Adaeze", initials: "OA", spec: "Computer Science" },
        { name: "Prof. Eze, Bartholomew", initials: "EB", spec: "Software Engineering" },
      ],
      students: [
        { name: "Adeyemi, Chisom", matNo: "2023/001", initials: "CA" },
        { name: "Okafor, Emeka", matNo: "2023/005", initials: "OE" },
        { name: "Abubakar, Zainab", matNo: "2023/008", initials: "AZ" },
      ]
    },
    {
      id: "B", name: "Group B", membersCount: 2,
      panelists: [{ name: "Dr. Abubakar, Ibrahim", initials: "AI", spec: "Information Systems" }], 
      students: [
        { name: "Nwosu, Chidi", matNo: "2023/002", initials: "NC" },
        { name: "Musa, Fatima", matNo: "2023/006", initials: "MF" },
      ]
    }
  ]);

  // --- EFFECTS ---
  // Force update if the URL changes while already on the page
  useEffect(() => {
    if (urlTab) {
      setActiveCard(urlTab);
    }
  }, [urlTab]);

  // --- FUNCTIONS ---
  const handleAddCriterion = (newCriterion: { label: string; maxScore: number }) => {
    const formattedCriterion = {
      id: Date.now().toString(),
      label: newCriterion.label, 
      score: newCriterion.maxScore 
    };
    setRubric(prev => [...prev, formattedCriterion]);
  };

  const handleRemoveCriterion = (idToRemove: string) => {
    setRubric(prev => prev.filter(item => item.id !== idToRemove));
  };

  const toggleSubmissionGroup = (name: string) => {
    setExpandedGroups(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };

  const getPillStyle = (status: string) => {
    switch (status) {
      case "Approved": return { bg: "#EEF5F4", color: "#417676" };
      case "Pending": return { bg: "#FFF6E6", color: "#D7962B" };
      case "Declined": return { bg: "#FAECEC", color: "#B22A36" };
      case "Not submitted": return { bg: "#F3F4F6", color: "#8F9196" };
      default: return { bg: "#F3F4F6", color: "#8F9196" };
    }
  };

  const getDotColor = (status: string) => {
    switch (status) {
      case "Approved": return "#417676";
      case "Pending": return "#D7962B";
      case "Declined": return "#B22A36";
      case "Not submitted": return "#D1D5DB";
      default: return "#D1D5DB";
    }
  };

  // --- ARRAYS & DUMMY DATA ---
  const navCards = ["Proposals", "Groups", "Panelists", "Submission", "Defence"];

  const students = [
    { id: "S1", name: "Adeyemi, Chisom", matNo: "2023/001", status: "Approved" },
    { id: "S2", name: "Nwosu, Chidi", matNo: "2023/002", status: "Pending" },
    { id: "S3", name: "Bello, Aisha", matNo: "2023/003", status: "Declined" },
    { id: "S4", name: "Eze, Tobechukwu", matNo: "2023/004", status: "Not submitted" },
    { id: "S5", name: "Okafor, Emeka", matNo: "2023/005", status: "Approved" },
    { id: "S6", name: "Musa, Fatima", matNo: "2023/006", status: "Pending" },
  ];

  const panelists = [
    { name: "Dr. Okonkwo, Adaeze", initials: "OA", spec: "Computer Science", group: "Group A" },
    { name: "Prof. Eze, Bartholomew", initials: "EB", spec: "Software Engineering", group: "Group B" },
    { name: "Dr. Abubakar, Ibrahim", initials: "AI", spec: "Information Systems", group: "Group C" },
    { name: "Dr. Nwachukwu, Obiora", initials: "NO", spec: "Database Systems", group: null },
  ];

  const submissionGroups = [
    { name: "Group A", submitted: 4, total: 4, status: "Complete", students: [
      { name: "Adeyemi, Chisom", matNo: "2023/001", status: "Submitted" },
      { name: "Okafor, Emeka", matNo: "2023/005", status: "Submitted" },
      { name: "Abubakar, Zainab", matNo: "2023/008", status: "Submitted" },
      { name: "Nwankwo, John", matNo: "2023/009", status: "Submitted" }
    ]},
    { name: "Group B", submitted: 2, total: 4, status: "In Progress", students: [
      { name: "Nwosu, Chidi", matNo: "2023/002", status: "Submitted" },
      { name: "Musa, Fatima", matNo: "2023/006", status: "Submitted" },
      { name: "Bello, Aisha", matNo: "2023/003", status: "Not submitted" },
      { name: "Okoro, David", matNo: "2023/007", status: "Not submitted" },
    ]},
  ];

  // --- CALCULATED VALUES ---
  const totalRubricScore = rubric.reduce((acc, curr) => acc + (Number(curr.score) || 0), 0);
  
  const filteredStudents = students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.matNo.toLowerCase().includes(searchQuery.toLowerCase()));
  
  // Safely check students array incase a new empty group is created
  const filteredGroups = groups.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (g.students || []).some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const filteredPanelists = panelists.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.group && p.group.toLowerCase().includes(searchQuery.toLowerCase())));

  // --- MAIN UI RENDER ---
  return (
    <div className="flex flex-col h-full w-full bg-white overflow-hidden">
      
      {/* 1. HEADER */}
      <header className="shrink-0 px-8 py-6 border-b border-[var(--color-brand-light)] flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-dark)]">Seminar Portal</h1>
          <p className="text-sm text-gray-400 mt-1">2023/2024 Final Year</p>
        </div>

        <div className="flex items-center gap-4">
          {/* MESSAGES BUTTON */}
            <button 
              type="button"
              onMouseDown={() => router.push("/dashboard/messages")} 
              className="relative p-2 text-gray-500 hover:bg-gray-50 hover:text-[var(--color-brand-dark)] transition-colors rounded-lg"
            >
              <MessageSquare size={22} />
              {/* Optional: Add red dot logic here later */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#A32A2A] rounded-full border-2 border-white box-content"></span>
            </button>

            <div className="h-6 w-px bg-gray-200 mx-2"></div>

            {/* NOTIFICATIONS BUTTON */}
            <button 
              type="button"
              onMouseDown={() => router.push("/dashboard/notifications")} 
              className="relative p-2 text-gray-500 hover:bg-gray-50 hover:text-[var(--color-brand-dark)] transition-colors rounded-lg"
            >
              <Bell size={22} />
              {/* Optional: Add red dot logic here later */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#A32A2A] rounded-full border-2 border-white box-content"></span>
            </button>
        </div>
      </header>

      {/* 2. MAIN BODY */}
      <div className="flex-1 flex flex-col min-h-0 w-[95%] mx-auto pt-6">

        {/* ROUNDED RECTANGLE NAVIGATION CARDS */}
        <div className="shrink-0 grid grid-cols-5 gap-4 mb-6">
          {navCards.map((card) => (
            <button
              key={card}
              onClick={() => { 
                setActiveCard(card); 
                setSelectedGroupDetail(null); 
                setSelectedStudentDetail(null);
                setSearchQuery(""); 
              }}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                activeCard === card
                  ? "border-[var(--color-brand-teal)] bg-[#EEF5F4] text-[var(--color-brand-dark)] shadow-sm"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <span className="font-bold text-sm tracking-wide">{card}</span>
            </button>
          ))}
        </div>

        {/* FULL WIDTH SEARCH BAR */}
        {!selectedGroupDetail && !selectedStudentDetail && activeCard !== "Defence" && (
          <div className="shrink-0 mb-6 flex gap-4">
            <div className="relative flex-1 shadow-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder={`Search ${activeCard.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 h-10 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[var(--color-brand-teal)] focus:ring-1 focus:ring-[var(--color-brand-teal)] transition-shadow"
              />
            </div>
            
            {/* Batch Size Setter inside Proposals Search Row */}
            {activeCard === "Proposals" && (
              <div className="flex items-center gap-3">
                <div className="flex items-center shadow-sm rounded-lg">
                  <button onClick={() => setBatchSize(Math.max(1, batchSize - 1))} className="w-8 h-10 flex items-center justify-center bg-[#F4F4F4] border border-gray-200 border-r-0 rounded-l-lg text-gray-500 hover:bg-gray-200 transition-colors">
                    <Minus size={14} strokeWidth={2.5} />
                  </button>
                  <input type="text" value={batchSize} readOnly className="w-10 h-10 bg-[#F4F4F4] border-y border-gray-200 text-center text-sm font-bold text-[var(--color-brand-dark)] outline-none" />
                  <button onClick={() => setBatchSize(batchSize + 1)} className="w-8 h-10 flex items-center justify-center bg-[#F4F4F4] border border-gray-200 border-l-0 rounded-r-lg text-gray-500 hover:bg-gray-200 transition-colors">
                    <Plus size={14} strokeWidth={2.5} />
                  </button>
                </div>
                <button className="bg-[var(--color-brand-teal)] text-white h-10 px-5 rounded-lg text-sm font-semibold hover:bg-[var(--color-brand-teal)]/90 transition-colors shadow-sm whitespace-nowrap">
                  Set batch size
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================= */}
        {/* VIEW 1: PROPOSALS TAB                     */}
        {/* ========================================= */}
        {activeCard === "Proposals" && !selectedStudentDetail && (
          <div className="flex-1 min-h-0 flex flex-col pr-3 pb-6">
            <div className="flex-1 border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto">
                <table className="w-full border-collapse relative">
                  <thead className="bg-[#F8F9FA] sticky top-0 z-10 border-b border-gray-200">
                    <tr>
                      <th style={{ textAlign: 'left' }} className="px-6 py-4 text-sm font-bold text-gray-600 w-[30%]">Student</th>
                      <th style={{ textAlign: 'left' }} className="px-6 py-4 text-sm font-bold text-gray-600 w-[25%]">Mat Number</th>
                      <th style={{ textAlign: 'left' }} className="px-6 py-4 text-sm font-bold text-gray-600 w-[25%]">Topic Status</th>
                      <th style={{ textAlign: 'left' }} className="px-6 py-4 text-sm font-bold text-gray-600 w-[20%]">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredStudents.map((student) => {
                      const isNotSubmitted = student.status === "Not submitted";
                      const pillStyles = getPillStyle(student.status);
                      const dotColor = getDotColor(student.status);

                      return (
                        <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-semibold text-gray-800">{student.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-500 font-medium">{student.matNo}</td>
                          <td className="px-6 py-4">
                            <span style={{ backgroundColor: pillStyles.bg, color: pillStyles.color }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide">
                              <span style={{ backgroundColor: dotColor }} className="w-1.5 h-1.5 rounded-full shrink-0"></span>
                              {student.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button 
                              disabled={isNotSubmitted}
                              onClick={() => setSelectedStudentDetail(student)}
                              className={`text-sm font-semibold ${isNotSubmitted ? "text-gray-300 cursor-not-allowed" : "text-[var(--color-brand-teal)] hover:opacity-80 underline underline-offset-2"}`}
                            >
                              Review Proposals
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="shrink-0 mt-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A32A2A]"></span>
              <p className="text-sm text-gray-400 font-medium italic">Only approved students can be added to a seminar group</p>
            </div>
          </div>
        )}

        {/* PROPOSALS DETAIL VIEW */}
        {activeCard === "Proposals" && selectedStudentDetail && (
          <div className="flex-1 overflow-y-auto pr-3 pb-6 flex flex-col">
            <button 
              onClick={() => setSelectedStudentDetail(null)}
              className="text-sm font-semibold text-gray-500 hover:text-[var(--color-brand-dark)] mb-4 self-start flex items-center gap-1"
            >
              &larr; Back to all proposals
            </button>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-[var(--color-brand-dark)]">{selectedStudentDetail.name}</h2>
                  <p className="text-sm font-medium text-gray-400 mt-1">{selectedStudentDetail.matNo}</p>
                </div>
                <button 
                  disabled={selectedStudentDetail.status !== "Approved"}
                  className="bg-[#EEF5F4] text-[var(--color-brand-teal)] px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Plus size={16} /> Assign to Seminar Group
                </button>
              </div>
              
              <h3 className="font-bold text-gray-700 mb-4 uppercase tracking-wider text-xs">Topic Submissions (Batch 1)</h3>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-[var(--color-brand-dark)]">1. AI-Driven Agricultural Analytics in Nigeria</h4>
                    <span className="bg-[#FFF6E6] text-[#D7962B] px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide">Pending Review</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">A study exploring the deployment of machine learning algorithms to optimize crop yield predictions using localized weather data.</p>
                  <div className="flex gap-3">
                    <button className="bg-white border border-gray-300 text-[var(--color-brand-teal)] px-4 py-1.5 rounded font-bold text-xs hover:bg-[#EEF5F4]">Approve Topic</button>
                    <button className="bg-white border border-gray-300 text-[#B22A36] px-4 py-1.5 rounded font-bold text-xs hover:bg-red-50">Decline</button>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-[var(--color-brand-dark)]">2. Blockchain Verification for Academic Credentials</h4>
                    <span className="bg-[#FFF6E6] text-[#D7962B] px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide">Pending Review</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Implementing a decentralized ledger system specifically tailored for Nigerian university registries.</p>
                  <div className="flex gap-3">
                    <button className="bg-white border border-gray-300 text-[var(--color-brand-teal)] px-4 py-1.5 rounded font-bold text-xs hover:bg-[#EEF5F4]">Approve Topic</button>
                    <button className="bg-white border border-gray-300 text-[#B22A36] px-4 py-1.5 rounded font-bold text-xs hover:bg-red-50">Decline</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* VIEW 2: GROUPS TAB                        */}
        {/* ========================================= */}
        {activeCard === "Groups" && !selectedGroupDetail && (
          <div className="flex-1 overflow-y-auto pr-3 pb-6">
            <div className="grid grid-cols-3 gap-6">
              {filteredGroups.map((group) => (
                <div 
                  key={group.id} 
                  onClick={() => setSelectedGroupDetail(group)}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                    <h3 className="font-bold text-[var(--color-brand-dark)] text-lg">{group.name}</h3>
                    <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-md">{group.membersCount} Members</span>
                  </div>
                  <div className="space-y-3 flex-1">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Assigned Panelists</p>
                      <p className="text-sm font-medium text-[var(--color-brand-teal)] line-clamp-2">
                        {group.panelists?.map(p => p.name.replace(/,/g, '').trim()).join(" • ") || "None assigned"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Students</p>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {(group.students || []).map(s => s.name.replace(/,/g, '').trim()).join(" • ")}
                      </p>
                    </div>
                  </div> {/* <--- THE FIX: This closing div was previously missing! */}
                  <button className="mt-5 w-full py-2 bg-gray-50 text-gray-600 text-sm font-semibold rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                    Manage Group
                  </button>
                </div>
              ))}
              
              {filteredGroups.length === 0 && (
                <div className="col-span-3 flex items-center justify-center p-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
                  <p className="text-sm text-gray-500 font-medium">No seminar groups match your search.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* SUB VIEW : GROUP DETAILS                  */}
        {/* ========================================= */}
        {activeCard === "Groups" && selectedGroupDetail && (
          <GroupDetailView
            context="Seminar"
            
            // 1. THIS FORMATS THE CURRENT GROUP'S DATA
            group={{
              id: selectedGroupDetail.id,
              name: selectedGroupDetail.name,
              // Seminar uses objects for students, so we extract matNo for the ID and Subtitle
              students: (selectedGroupDetail.students || []).map((s: any) => ({ id: s.matNo, name: s.name, subtitle: s.matNo })),
              supervisor: null, 
              panelists: selectedGroupDetail.panelists?.map((p: any) => ({ id: p.name, name: p.name })) || []
            }}
            onBack={() => setSelectedGroupDetail(null)}
            
            // 2. THIS FEEDS THE DROPDOWN LISTS INTO THE MODAL
            availableStudents={students
              .filter(s => s.status === "Approved") 
              .map(s => ({ id: s.matNo, name: s.name, subtitle: s.matNo }))
            }
            availablePanelists={panelists.map(p => ({ id: p.name, name: p.name, subtitle: p.spec }))}
            
            // 3. THIS UPDATES THE UI IN REAL TIME WHEN A USER CLICKS 'CONFIRM'
            onAddStudent={(data) => {
              // Safe Initials: Grabs the first letter of the first two words, regardless of commas
              const nameParts = data.name.replace(/,/g, '').split(' ').filter(Boolean);
              const initials = nameParts.length > 1 
                ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase() 
                : data.name.substring(0, 2).toUpperCase();

              const newStudent = { name: data.name.trim(), matNo: data.id, initials: initials };
              const updated = { 
                ...selectedGroupDetail, 
                students: [...(selectedGroupDetail.students || []), newStudent],
                membersCount: selectedGroupDetail.membersCount + 1 
              };
              setGroups(prev => prev.map(g => g.id === updated.id ? updated : g));
              setSelectedGroupDetail(updated);
            }}
            
            onAddPanelist={(data) => {
              // Safe Initials: Grabs the first letter of the first two words, regardless of commas
              const nameParts = data.name.replace(/,/g, '').split(' ').filter(Boolean);
              const initials = nameParts.length > 1 
                ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase() 
                : data.name.substring(0, 2).toUpperCase();

              const newPanelist = { name: data.name.trim(), initials: initials, spec: data.subtitle || "" };
              const updated = { 
                ...selectedGroupDetail, 
                panelists: [...(selectedGroupDetail.panelists || []), newPanelist] 
              };
              setGroups(prev => prev.map(g => g.id === updated.id ? updated : g));
              setSelectedGroupDetail(updated);
            }}

            // 4. THESE HANDLE REMOVING MEMBERS IN REAL TIME
            onRemoveStudent={(id) => {
              const updated = {
                ...selectedGroupDetail,
                students: (selectedGroupDetail.students || []).filter((s: any) => s.matNo !== id),
                membersCount: Math.max(0, selectedGroupDetail.membersCount - 1)
              };
              setGroups(prev => prev.map(g => g.id === updated.id ? updated : g));
              setSelectedGroupDetail(updated);
            }}
            
            onRemovePanelist={(id) => {
              const updated = {
                ...selectedGroupDetail,
                panelists: (selectedGroupDetail.panelists || []).filter((p: any) => p.name !== id)
              };
              setGroups(prev => prev.map(g => g.id === updated.id ? updated : g));
              setSelectedGroupDetail(updated);
            }}
          />
        )}

        {/* ========================================= */}
        {/* VIEW 3: PANELISTS TAB                     */}
        {/* ========================================= */}
        {activeCard === "Panelists" && (
          <div className="flex-1 overflow-y-auto pr-3 pb-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-bold text-[var(--color-brand-dark)]">Seminar Panelists</h2>
                <p className="text-xs text-gray-500 mt-1">Manage all lecturer panel assignments across seminar groups.</p>
              </div>
              <button className="bg-[var(--color-brand-teal)] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:opacity-90 flex items-center gap-2">
                <Plus size={16} /> Assign Panellist
              </button>
            </div>
            
            <div className="flex-1 border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col overflow-hidden">
              <table className="w-full border-collapse relative">
                <thead className="bg-[#F8F9FA] border-b border-gray-200">
                  <tr>
                    <th style={{ textAlign: 'left' }} className="px-6 py-4 text-sm font-bold text-gray-600 w-[35%]">Panellist Name</th>
                    <th style={{ textAlign: 'left' }} className="px-6 py-4 text-sm font-bold text-gray-600 w-[35%]">Area of Specialisation</th>
                    <th style={{ textAlign: 'left' }} className="px-6 py-4 text-sm font-bold text-gray-600 w-[30%]">Assigned Group</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPanelists.map((Panellist, index) => (
                    <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">{Panellist.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-medium">{Panellist.spec}</td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {Panellist.group ? (
                          <span className="bg-[#EEF5F4] text-[#417676] px-3 py-1.5 rounded-full text-xs font-bold tracking-wide">
                            {Panellist.group}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">Not assigned</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* VIEW 4: SUBMISSION TAB                    */}
        {/* ========================================= */}
        {activeCard === "Submission" && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto pr-4 pb-8 space-y-4 custom-scrollbar">
              {submissionGroups.map((group) => (
                <div key={group.name} className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
                  <div 
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors" 
                    onClick={() => toggleSubmissionGroup(group.name)}
                  >
                    <div className="w-1/3 flex items-center gap-3">
                      <Users size={20} className="text-[#417676]" />
                      <span className="font-bold text-[var(--color-brand-dark)]">{group.name}</span>
                    </div>
                    
                    <div className="w-1/2 px-4 flex items-center justify-end gap-4">
                      {group.status === "Complete" ? (
                        <div className="border-2 border-[#22C55E] text-[#22C55E] px-4 py-1 rounded-xl font-bold tracking-wider uppercase text-sm">
                          Complete
                        </div>
                      ) : (
                        <>
                          <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[var(--color-brand-teal)] transition-all duration-500" 
                              style={{ width: `${(group.submitted / group.total) * 100}%` }}
                            ></div>
                          </div>
                          <span className="font-bold text-gray-500 text-sm whitespace-nowrap">
                            {group.submitted} / {group.total}
                          </span>
                        </>
                      )}
                      <ChevronDown size={20} className={`text-gray-400 transition-transform ${expandedGroups.includes(group.name) ? "rotate-180" : ""}`} />
                    </div>
                  </div>

                  {expandedGroups.includes(group.name) && (
                    <div className="p-5 border-t border-gray-100 bg-gray-50">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-gray-600 text-sm uppercase tracking-wider">Member Status</h4>
                        <button 
                          onClick={() => {
                            setBroadcastContext(`${group.name} Seminar Members`);
                            setIsBroadcastOpen(true);
                          }}
                          className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-xs font-bold shadow-sm flex items-center gap-2 hover:bg-gray-100 transition-colors"
                        >
                          <Mail size={14} /> Broadcast to Group
                        </button>
                      </div>
                      
                      <div className="max-h-[250px] overflow-y-auto custom-scrollbar pr-2 space-y-2">
                        {group.students.map((s, i) => (
                          <div key={i} className="flex justify-between items-center py-3 px-4 bg-white border border-gray-100 rounded-lg shadow-sm">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-semibold text-gray-800">{s.name}</span>
                              <span className="text-xs font-medium text-gray-400">({s.matNo})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {s.status === "Submitted" ? (
                                <span className="bg-[#EEF5F4] text-[#417676] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                                  <CheckCircle2 size={14} /> {s.status}
                                </span>
                              ) : (
                                <span className="bg-[#FAECEC] text-[#B22A36] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                                  <XCircle size={14} /> {s.status}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* VIEW 5: DEFENCE TAB                       */}
        {/* ========================================= */}
              {/* VIEW 5: DEFENCE TAB */}
        {activeCard === "Defence" && (
          <div className="flex-1 overflow-y-auto pr-3 pb-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-[var(--color-brand-dark)]">Defence Configuration</h2>
              <button className="bg-gray-200 text-gray-400 px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm cursor-not-allowed flex items-center gap-2">
                <ShieldAlert size={16} /> Open Scores
              </button>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-700 mb-6">Scoring Rubric Configuration</h3>
              
              <div className="space-y-3 mb-6">
                {rubric.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                  >
                    {/* Corrected: Using item.label */}
                    <span className="font-semibold text-[var(--color-brand-dark)]">{item.label}</span>
                    
                    <div className="flex items-center gap-6">
                      {/* Corrected: Using item.score */}
                      <span className="text-sm font-bold text-[var(--color-brand-teal)]">Max Score: {item.score}</span>
                      
                      <button 
                        onClick={() => handleRemoveCriterion(item.id)}
                        className="text-gray-400 hover:text-[#B22A36] hover:bg-red-50 p-1.5 rounded-md transition-colors"
                        title="Remove Criterion"
                      >
                        <X size={18} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center border-t border-gray-100 pt-6">
                <span className="font-bold text-gray-500 text-sm">
                  Total Max Score: 
                  <span className="text-[var(--color-brand-dark)] text-lg ml-1">{totalRubricScore}</span>
                </span>
                
                <button 
                  onClick={() => setIsAddCriterionOpen(true)}
                  className="text-sm font-bold bg-[#EEF5F4] text-[var(--color-brand-teal)] px-5 py-3 rounded-lg flex items-center gap-2 border border-transparent hover:border-[var(--color-brand-teal)] transition-colors"
                >
                  <Plus size={16} /> Add Criterion
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 3. DYNAMIC FOOTER */}
      <div className="shrink-0 bg-white border-t border-gray-200 px-8 py-5">
        <div className="w-[95%] mx-auto flex justify-between items-center">
          
          <div className="flex gap-4">
            {activeCard === "Submission" ? (
              <button disabled={true} className="bg-gray-100 text-gray-400 border border-gray-200 px-6 py-2.5 rounded-lg text-sm font-medium cursor-not-allowed shadow-sm">
                Open files to panelists
              </button>
            ) : activeCard === "Groups" && !selectedGroupDetail ? (
              <button 
                onClick={() => setIsCreateGroupOpen(true)}
                className="bg-[var(--color-brand-slate)] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2"
              >
                <Plus size={16} /> Create New Group
              </button>
            ) : (
              <button className="bg-[var(--color-brand-slate)] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-sm">
                Open Portal
              </button>
            )}

            <button 
              onClick={() => { setBroadcastContext(`@seminar-${activeCard.toLowerCase()}`); setIsBroadcastOpen(true); }}
              className="bg-[var(--color-brand-teal)] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--color-brand-teal)]/90 flex items-center gap-2 transition-colors shadow-sm"
            >
              <Send size={16} /> Send Broadcast
            </button>
          </div>
          
        </div>
      </div>

      {/* 4. MODALS */}
      <BroadcastModal 
        isOpen={isBroadcastOpen} 
        onClose={() => setIsBroadcastOpen(false)} 
        defaultTarget={broadcastContext} 
      />
      
      <CreateGroupModal 
        isOpen={isCreateGroupOpen} 
        onClose={() => setIsCreateGroupOpen(false)} 
        groupContext="Seminar" 
      />

      <AddCriterionModal 
        isOpen={isAddCriterionOpen}
        onClose={() => setIsAddCriterionOpen(false)}
        onAdd={handleAddCriterion}
        context="Seminar"
        currentTotal={totalRubricScore}
      />

    </div>
  );
}

/* ========================================= */
/* 3. EXPORTED WRAPPER (FOR NEXT.JS)          */
/* ========================================= */
export default function SeminarPortalPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-500">Loading Portal...</div>}>
      <SeminarPortalContent />
    </Suspense>
  );
}