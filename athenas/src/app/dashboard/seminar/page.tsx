"use client";

import { useState } from "react";
import { Bell, MessageSquare, Trash2, Plus, Minus, Users, X, Send, Search, ChevronDown, CheckCircle2 } from "lucide-react";

export default function SeminarPage() {
  const [activeTab, setActiveTab] = useState("Defence"); // Defaulted to Defence so you can test it
  const [batchSize, setBatchSize] = useState(3);
  
  const [panelistView, setPanelistView] = useState("Individuals");
  const [isPanelistDropdownOpen, setIsPanelistDropdownOpen] = useState(false);

  // States for Accordions/Foldables
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["Group B"]); // For Submission Tab
  const [expandedBoards, setExpandedBoards] = useState<string[]>(["A", "B"]);  // For Groups Tab
  const [expandedStudents, setExpandedStudents] = useState<string[]>(["A", "B"]); // For Groups Tab
  
  // States for Defence Tab
  const [rubric, setRubric] = useState([
    { id: "1", label: "Presentation Quality", score: 10 },
    { id: "2", label: "Content Depth", score: 15 },
    { id: "3", label: "Clarity of Delivery", score: 10 },
    { id: "4", label: "Response to Questions", score: 15 },
  ]);
  
  const totalRubricScore = rubric.reduce((acc, curr) => acc + (Number(curr.score) || 0), 0);
  
  const tabs = ["Proposals", "Groups", "Panelists", "Submission", "Defence"];

  const students = [
    { name: "Adeyemi, Chisom", matNo: "2023/001", status: "Approved" },
    { name: "Nwosu, Chidi", matNo: "2023/002", status: "Pending" },
    { name: "Bello, Aisha", matNo: "2023/003", status: "Declined" },
    { name: "Eze, Tobechukwu", matNo: "2023/004", status: "Not submitted" },
    { name: "Okafor, Emeka", matNo: "2023/005", status: "Approved" },
    { name: "Musa, Fatima", matNo: "2023/006", status: "Pending" },
  ];

  const groups = [
    {
      id: "A",
      name: "Group A",
      membersCount: 4,
      panelists: [
        { name: "Dr. Okonkwo, Adaeze", initials: "OA", spec: "Computer Science" },
        { name: "Prof. Eze, Bartholomew", initials: "EB", spec: "Software Engineering" },
        { name: "Dr. Abubakar, Ibrahim", initials: "AI", spec: "Information Systems" },
        { name: "Dr. Nwachukwu, Obiora", initials: "NO", spec: "Database Systems" }
      ],
      students: [
        { name: "Adeyemi, Chisom", matNo: "2023/001", initials: "CA" },
        { name: "Okafor, Emeka", matNo: "2023/005", initials: "OE" },
        { name: "Abubakar, Zainab", matNo: "2023/008", initials: "AZ" },
      ]
    },
    {
      id: "B",
      name: "Group B",
      membersCount: 2,
      panelists: [], 
      students: [
        { name: "Nwosu, Chidi", matNo: "2023/002", initials: "NC" },
      ]
    }
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
    { name: "Group C", submitted: 0, total: 8, status: "Not Started", students: [
      { name: "Bola, Chidi", matNo: "2023/011", status: "Not submitted" },
      { name: "Musa, Folunsho", matNo: "2023/016", status: "Not submitted" },
      { name: "Bello, Suka", matNo: "2023/023", status: "Not submitted" },
      { name: "Madu, David", matNo: "2023/097", status: "Not submitted" },
      { name: "Nwosu, Nwene", matNo: "2023/052", status: "Not submitted" },
      { name: "Liama, Fatima", matNo: "2023/036", status: "Not submitted" },
      { name: "Folorunshor, Aisha", matNo: "2023/053", status: "Not submitted" },
      { name: "Eze, David", matNo: "2023/007", status: "Not submitted" },
    ]},
  ];

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

  const toggleSubmissionGroup = (name: string) => {
    setExpandedGroups(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };

  const toggleBoard = (id: string) => {
    setExpandedBoards(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  
  const toggleStudents = (id: string) => {
    setExpandedStudents(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="flex flex-col h-full w-full bg-white overflow-hidden">
      
      {/* 1. HEADER */}
      <header className="shrink-0 px-8 py-6 border-b border-[var(--color-brand-light)] flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-dark)]">Seminar Portal</h1>
          <p className="text-sm text-gray-400 mt-1">2023/2024 Final Year</p>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-500 hover:text-[var(--color-brand-dark)] transition-colors">
            <MessageSquare size={22} />
          </button>
          
          <div className="h-6 w-px bg-gray-200 mx-2"></div>
          
          <button className="relative p-2 text-gray-500 hover:text-[var(--color-brand-dark)] transition-colors">
            <Bell size={22} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#A32A2A] rounded-full border-2 border-white box-content"></span>
          </button>
        </div>
      </header>

      {/* 2. MAIN BODY */}
      <div className="flex-1 flex flex-col min-h-0 w-[95%] mx-auto pt-6">

        {/* Tabs */}
        <div className="shrink-0 flex gap-3 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-colors border ${
                activeTab === tab
                  ? "bg-[var(--color-brand-teal)] text-white border-[var(--color-brand-teal)] shadow-sm"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ========================================= */}
        {/* VIEW 1: PROPOSALS TAB                     */}
        {/* ========================================= */}
        {activeTab === "Proposals" && (
          <>
            <div className="shrink-0 flex justify-between items-center mb-6 pr-3">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 font-medium">Proposals per batch:</span>
                <div className="flex items-center shadow-sm rounded-lg">
                  <button 
                    onClick={() => setBatchSize(Math.max(1, batchSize - 1))}
                    className="w-8 h-10 flex items-center justify-center bg-[#F4F4F4] border border-gray-200 border-r-0 rounded-l-lg text-gray-500 hover:bg-gray-200 transition-colors"
                  >
                    <Minus size={14} strokeWidth={2.5} />
                  </button>
                  <input 
                    type="text" 
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={batchSize}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val)) setBatchSize(val);
                    }}
                    className="w-10 h-10 bg-[#F4F4F4] border-y border-gray-200 text-center text-sm font-bold text-[var(--color-brand-dark)] outline-none focus:z-10 focus:border-[var(--color-brand-teal)] focus:ring-1 focus:ring-[var(--color-brand-teal)]"
                  />
                  <button 
                    onClick={() => setBatchSize(batchSize + 1)}
                    className="w-8 h-10 flex items-center justify-center bg-[#F4F4F4] border border-gray-200 border-l-0 rounded-r-lg text-gray-500 hover:bg-gray-200 transition-colors"
                  >
                    <Plus size={14} strokeWidth={2.5} />
                  </button>
                </div>
                <button className="bg-[var(--color-brand-teal)] text-white h-10 px-6 rounded-lg text-sm font-medium hover:bg-[var(--color-brand-teal)]/90 transition-colors shadow-sm flex items-center">
                  Set batch size
                </button>
              </div>

              <div className="relative w-80 shadow-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search students..." 
                  className="w-full pl-10 pr-4 h-10 bg-white border border-gray-200 rounded-lg text-sm text-[var(--color-brand-dark)] focus:outline-none focus:border-[var(--color-brand-teal)] focus:ring-1 focus:ring-[var(--color-brand-teal)] transition-shadow"
                />
              </div>
            </div>

            <div className="flex-1 min-h-0 flex flex-col pr-3 mb-4 pb-6">
              <div className="flex-1 border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col min-h-0 overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                  <table className="w-full border-collapse relative">
                    <thead className="bg-[#F4F4F4] sticky top-0 z-10">
                      <tr>
                        <th style={{ textAlign: 'left' }} className="px-6 py-4 text-sm font-medium text-gray-500 w-[30%] border-b border-gray-200">Student</th>
                        <th style={{ textAlign: 'left' }} className="px-6 py-4 text-sm font-medium text-gray-500 w-[25%] border-b border-gray-200">Mat Number</th>
                        <th style={{ textAlign: 'left' }} className="px-6 py-4 text-sm font-medium text-gray-500 w-[25%] border-b border-gray-200">Status</th>
                        <th style={{ textAlign: 'left' }} className="px-6 py-4 text-sm font-medium text-gray-500 w-[20%] border-b border-gray-200">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {students.map((student, index) => {
                        const isNotSubmitted = student.status === "Not submitted";
                        const pillStyles = getPillStyle(student.status);
                        const dotColor = getDotColor(student.status);

                        return (
                          <tr key={index} className="hover:bg-gray-50/50 transition-colors border-b border-gray-200 last:border-none">
                            <td style={{ textAlign: 'left' }} className="px-6 py-4 text-sm font-semibold text-gray-800">{student.name}</td>
                            <td style={{ textAlign: 'left' }} className="px-6 py-4 text-sm text-gray-500 font-medium">{student.matNo}</td>
                            <td style={{ textAlign: 'left' }} className="px-6 py-4">
                              <span 
                                style={{ backgroundColor: pillStyles.bg, color: pillStyles.color }}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide"
                              >
                                <span style={{ backgroundColor: dotColor }} className="w-1.5 h-1.5 rounded-full shrink-0"></span>
                                {student.status}
                              </span>
                            </td>
                            <td style={{ textAlign: 'left' }} className="px-6 py-4">
                              <button 
                                disabled={isNotSubmitted}
                                className={`text-sm font-medium ${isNotSubmitted ? "text-gray-300 cursor-not-allowed" : "text-[#417676] underline underline-offset-2 hover:opacity-80"}`}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="shrink-0 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A32A2A]"></span>
              <p className="text-sm text-gray-400 font-medium">Only approved students can be added to a seminar group</p>
            </div>
          </>
        )}

        {/* ========================================= */}
        {/* VIEW 2: GROUPS TAB                        */}
        {/* ========================================= */}
        {activeTab === "Groups" && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="shrink-0 mb-4 flex justify-between items-center pr-4">
              <div className="relative w-full shadow-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by group name, student, or panelist..." 
                  className="w-full pl-10 pr-4 h-10 bg-white border border-gray-200 rounded-lg text-sm text-[var(--color-brand-dark)] focus:outline-none focus:border-[var(--color-brand-teal)] focus:ring-1 focus:ring-[var(--color-brand-teal)] transition-shadow"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-4 pb-8 space-y-6">
              {groups.map((group) => {
                const isBoardOpen = expandedBoards.includes(group.id);
                const isStudentsOpen = expandedStudents.includes(group.id);

                return (
                  <div key={group.id} className="border border-gray-200 rounded-xl bg-white shadow-sm p-6">
                    
                    {/* Header */}
                    <div className="flex items-center gap-4 pb-4 mb-4 border-b border-gray-100">
                      <Users size={20} className="text-[#417676]" />
                      <h2 className="text-base font-bold text-gray-800">{group.name}</h2>
                      <span className="bg-[#EEF5F4] text-[#417676] px-3 py-1 rounded-full text-[13px] font-semibold tracking-wide">
                        {group.membersCount} members
                      </span>
                    </div>

                    {/* Foldable: Panel Board */}
                    <div className="mb-4 border border-gray-100 rounded-lg overflow-hidden transition-all">
                      <button 
                        onClick={() => toggleBoard(group.id)}
                        className="w-full flex justify-between items-center bg-gray-50 px-4 py-3 hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Panel Board ({group.panelists?.length || 0})</span>
                        <ChevronDown size={18} className={`text-gray-500 transition-transform ${isBoardOpen ? "rotate-180" : ""}`} />
                      </button>
                      
                      {isBoardOpen && (
                        <div className="bg-white border-t border-gray-100 max-h-[200px] overflow-y-auto custom-scrollbar">
                          {group.panelists && group.panelists.length > 0 ? (
                            <div className="px-4 py-2">
                              {group.panelists.map((panelist, idx) => (
                                <div key={idx} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-none">
                                  
                                  {/* Left side: Avatar, Name, Specialization */}
                                  <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-[var(--color-brand-slate)] text-white flex items-center justify-center text-xs font-bold tracking-wider shrink-0 shadow-sm">
                                      {panelist.initials}
                                    </div>
                                    <span className="font-bold text-gray-800 text-[14px]">{panelist.name}</span>
                                    <span className="text-gray-400 text-sm font-medium">{panelist.spec}</span>
                                  </div>
                                  
                                  {/* Right side: X Button */}
                                  <button className="text-gray-400 hover:text-[#B22A36] hover:bg-red-50 p-1.5 rounded transition-colors mr-1">
                                    <X size={16} strokeWidth={2.5} />
                                  </button>
                                  
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="px-4 py-3">
                              <span className="text-sm italic text-[#B22A36] font-medium">Not assigned</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Foldable: Students */}
                    <div className="mb-6 border border-gray-100 rounded-lg overflow-hidden transition-all">
                      <button 
                        onClick={() => toggleStudents(group.id)}
                        className="w-full flex justify-between items-center bg-gray-50 px-4 py-3 hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Students ({group.students?.length || 0})</span>
                        <ChevronDown size={18} className={`text-gray-500 transition-transform ${isStudentsOpen ? "rotate-180" : ""}`} />
                      </button>
                      
                      {isStudentsOpen && (
                        <div className="bg-white border-t border-gray-100 max-h-[200px] overflow-y-auto custom-scrollbar">
                          {group.students && group.students.length > 0 ? (
                            <div className="px-4 py-2">
                              {group.students.map((student, idx) => (
                                <div key={idx} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-none">
                                  <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-[var(--color-brand-slate)] text-white flex items-center justify-center text-xs font-bold tracking-wider shrink-0 shadow-sm">
                                      {student.initials}
                                    </div>
                                    <span className="font-bold text-gray-800 text-[14px]">{student.name}</span>
                                    <span className="text-gray-400 text-sm font-medium">{student.matNo}</span>
                                  </div>
                                  <button className="text-gray-400 hover:text-[#B22A36] hover:bg-red-50 p-1.5 rounded transition-colors mr-1">
                                    <X size={16} strokeWidth={2.5} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="px-4 py-3">
                              <span className="text-sm italic text-[#B22A36] font-medium">No students assigned</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Group Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      <button className="border border-gray-300 rounded-lg px-5 py-2 text-sm font-semibold text-[#417676] flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
                        <Plus size={16} strokeWidth={2.5} /> Add student
                      </button>
                      <button className="border border-gray-300 rounded-lg px-5 py-2 text-sm font-semibold text-[#417676] flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
                        <Plus size={16} strokeWidth={2.5} /> Add panelist
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* VIEW 3: PANELISTS TAB                     */}
        {/* ========================================= */}
        {activeTab === "Panelists" && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="shrink-0 grid grid-cols-3 gap-4 mb-6 pr-4">
              <div className="bg-[#F8F9FA] px-5 py-4 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-gray-400 text-sm font-medium mb-1">Total panelists</p>
                <p className="text-2xl font-bold text-gray-800">4</p>
              </div>
              <div className="bg-[#F8F9FA] px-5 py-4 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-gray-400 text-sm font-medium mb-1">Groups covered</p>
                <p className="text-2xl font-bold text-[#417676]">3 / 4</p>
              </div>
              <div className="bg-[#FFF5F5] px-5 py-4 rounded-xl border border-[#FAD2D2] shadow-sm">
                <p className="text-[#B22A36] text-sm font-medium mb-1">Unassigned groups</p>
                <p className="text-2xl font-bold text-[#B22A36]">1</p>
              </div>
            </div>

            <div className="shrink-0 flex justify-between items-center mb-4 pr-4">
              <div className="relative w-80 shadow-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search panelists..." 
                  className="w-full pl-10 pr-4 h-10 bg-white border border-gray-200 rounded-lg text-sm text-[var(--color-brand-dark)] focus:outline-none focus:border-[var(--color-brand-teal)] focus:ring-1 focus:ring-[var(--color-brand-teal)] transition-shadow"
                />
              </div>

              <div className="relative z-20">
                <button 
                  type="button"
                  onClick={() => setIsPanelistDropdownOpen(!isPanelistDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsPanelistDropdownOpen(false), 200)}
                  className="flex items-center justify-between w-40 bg-white border border-gray-200 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg outline-none hover:bg-gray-50 focus:border-[var(--color-brand-teal)] focus:ring-1 focus:ring-[var(--color-brand-teal)] transition-all shadow-sm cursor-pointer"
                >
                  <span>{panelistView}</span>
                  <ChevronDown size={16} className={`text-gray-500 transition-transform ${isPanelistDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isPanelistDropdownOpen && (
                  <div className="absolute top-full right-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden py-1">
                    <div 
                      onClick={() => { setPanelistView("Individuals"); setIsPanelistDropdownOpen(false); }}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-[var(--color-brand-teal)] hover:text-white transition-colors cursor-pointer"
                    >
                      Individuals
                    </div>
                    <div 
                      onClick={() => { setPanelistView("Groups"); setIsPanelistDropdownOpen(false); }}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-[var(--color-brand-teal)] hover:text-white transition-colors cursor-pointer"
                    >
                      Groups
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 min-h-0 flex flex-col pr-4 mb-2 pb-6">
              <div className="flex-1 border border-gray-200 rounded-xl bg-[#F8F9FA] shadow-sm flex flex-col min-h-[240px] overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                  <table className="w-full border-collapse relative bg-white">
                    <thead className="bg-[#F8F9FA] sticky top-0 z-10">
                      <tr>
                        <th style={{ textAlign: 'left' }} className="px-6 py-4 text-sm font-medium text-gray-500 w-[30%] border-b border-gray-200">Name</th>
                        <th style={{ textAlign: 'left' }} className="px-6 py-4 text-sm font-medium text-gray-500 w-[30%] border-b border-gray-200">Area of specialisation</th>
                        <th style={{ textAlign: 'left' }} className="px-6 py-4 text-sm font-medium text-gray-500 w-[20%] border-b border-gray-200">Assigned group</th>
                        <th style={{ textAlign: 'left' }} className="px-6 py-4 text-sm font-medium text-gray-500 w-[20%] border-b border-gray-200">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {panelists.map((panelist, index) => (
                        <tr key={index} className="hover:bg-gray-50/50 transition-colors border-b border-gray-200 last:border-none">
                          <td style={{ textAlign: 'left' }} className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold tracking-wider shrink-0 text-white shadow-sm ${panelist.group ? 'bg-[var(--color-brand-slate)]' : 'bg-gray-300'}`}>
                                {panelist.initials}
                              </div>
                              <span className="text-sm font-semibold text-gray-800">{panelist.name}</span>
                            </div>
                          </td>
                          <td style={{ textAlign: 'left' }} className="px-6 py-4 text-sm text-gray-500 font-medium">
                            {panelist.spec}
                          </td>
                          <td style={{ textAlign: 'left' }} className="px-6 py-4">
                            {panelist.group ? (
                              <span className="bg-[#EEF5F4] text-[#417676] px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide">
                                {panelist.group}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-sm italic font-medium">
                                Not assigned
                              </span>
                            )}
                          </td>
                          <td style={{ textAlign: 'left' }} className="px-6 py-4">
                            <button className="text-sm font-semibold text-[#B22A36] underline underline-offset-2 hover:opacity-80">
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* VIEW 4: SUBMISSION TAB                    */}
        {/* ========================================= */}
        {activeTab === "Submission" && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto pr-4 pb-8 space-y-4">
              {submissionGroups.map((group) => (
                <div key={group.name} className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
                  
                  {/* --- BULLETPROOF HEADER --- */}
                  <div 
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors" 
                    onClick={() => toggleSubmissionGroup(group.name)}
                  >
                    <div className="flex items-center gap-3">
                      <Users size={20} className="text-[#417676]" />
                      <span className="font-bold text-gray-800">{group.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide flex items-center gap-1.5 ${
                        group.status === "Complete" ? "bg-[#EEF5F4] text-[#417676]" :
                        group.status === "In Progress" ? "bg-[#FFF6E6] text-[#D7962B]" :
                        "bg-gray-100 text-gray-500"
                      }`}>
                        {group.status === "Complete" && <CheckCircle2 size={14} />}
                        {group.status}
                      </span>
                      <ChevronDown size={20} className={`text-gray-400 transition-transform ${expandedGroups.includes(group.name) ? "rotate-180" : ""}`} />
                    </div>
                  </div>
                  
                  <div className="px-5 pb-5">
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-[var(--color-brand-teal)] h-full transition-all duration-500" 
                        style={{ width: `${(group.total > 0 ? (group.submitted / group.total) * 100 : 0)}%` }}
                      ></div>
                    </div>
                    <p className="text-right text-xs text-gray-500 font-medium mt-2">{group.submitted}/{group.total}</p>
                  </div>

                  {expandedGroups.includes(group.name) && group.students && (
                    <div className="px-5 pb-4 pt-1 border-t border-gray-100 max-h-[250px] overflow-y-auto custom-scrollbar">
                      {group.students.map((s, i) => (
                        <div key={i} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-none">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-gray-800">{s.name}</span>
                            <span className="text-xs font-medium text-gray-400">{s.matNo}</span>
                          </div>
                          <span className={`text-sm font-semibold ${s.status === "Submitted" ? "text-[#417676]" : "text-[#B22A36]"}`}>
                            {s.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              <div className="shrink-0 mt-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                <p className="text-sm text-gray-400 font-medium italic">Open files to panelists becomes available once all groups show Complete</p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* VIEW 5: DEFENCE TAB                       */}
        {/* ========================================= */}
        {activeTab === "Defence" && (
          <div className="flex-1 flex flex-col min-h-0 pr-4 pb-8">
            <div className="w-full border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col overflow-hidden">
              
              <div className="bg-[#F8F9FA] px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0">
                <h2 className="font-bold text-gray-800 text-sm">Scoring rubric</h2>
                <span className="text-sm text-gray-400 font-medium">Max total: {totalRubricScore}</span>
              </div>

              <div className="p-6 bg-white flex flex-col flex-1 min-h-0">
                
                <div className="max-h-[225px] overflow-y-auto custom-scrollbar pr-2 space-y-4 mb-6">
                  {rubric.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:border-gray-300 transition-colors">
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400 font-medium">Max</span>
                        <input
                          type="number"
                          value={item.score}
                          readOnly
                          className="w-16 h-10 border border-gray-200 rounded-md text-center text-sm font-bold text-gray-800 outline-none focus:border-[var(--color-brand-teal)] focus:ring-1 focus:ring-[var(--color-brand-teal)]"
                        />
                        <button className="text-gray-400 hover:text-[#B22A36] hover:bg-red-50 p-1.5 rounded transition-colors">
                          <X size={18} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 shrink-0">
                  <button className="border-2 border-dashed border-[var(--color-brand-teal)] text-[var(--color-brand-teal)] rounded-lg py-3 text-sm font-semibold hover:bg-[#EEF5F4] transition-colors flex items-center justify-center gap-2">
                    <Plus size={16} strokeWidth={2.5} /> Add criterion
                  </button>
                  <button className="bg-[var(--color-brand-teal)] text-white rounded-lg py-3 text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center">
                    Save changes
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>

      {/* 3. DYNAMIC FOOTER */}
      <div className="shrink-0 bg-white border-t border-gray-200 px-8 py-5">
        <div className="w-[95%] mx-auto flex justify-between items-center">
          
          <div className="flex gap-4">
            {activeTab === "Submission" ? (
              <button disabled={true} className="bg-gray-100 text-gray-400 border border-gray-200 px-6 py-2.5 rounded-lg text-sm font-medium cursor-not-allowed">
                Open files to panelists
              </button>
            ) : activeTab === "Defence" ? (
              <button className="bg-[var(--color-brand-slate)] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-sm">
                Open rubric
              </button>
            ) : (
              <button className="bg-[var(--color-brand-slate)] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-sm">
                {activeTab === "Groups" ? "+ Create new group" : "Open portal"}
              </button>
            )}
            
            <button className="bg-[var(--color-brand-teal)] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--color-brand-teal)]/90 flex items-center gap-2 transition-colors shadow-sm">
              <Send size={16} />
              {activeTab === "Defence" ? "Send message" : "Send broadcast"}
            </button>
          </div>

          <div className="text-sm text-gray-400 flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#A32A2A]"></span>
            2023/2024 cohort · single active cohort
          </div>
          
        </div>
      </div>

    </div>
  );
}