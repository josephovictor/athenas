"use client";

import { useState, useEffect } from "react";
import { X, Search, UserCheck, Loader2, CheckCircle2, AlertCircle, Users, ChevronDown } from "lucide-react";

export type AssignmentRole = 
  | "Panellist"           
  | "Supervisor"          
  | "Internal Panellist"  
  | "External Panellist"; 

export interface Lecturer {
  id: string;
  name: string;
  specialization: string;
  type: "Internal" | "External";
  affiliation: string; 
}

interface AssignLecturerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (lecturer: Lecturer, role: AssignmentRole, groupId: string) => Promise<void>;
  role: AssignmentRole | null;
  context: "Seminar" | "Project";
  
  targetGroup?: { id: string; name: string } | null; 
  availableGroups?: { id: string; name: string }[];
}

const dummyLecturers: Lecturer[] = [
  { id: "INT-1", name: "Dr. Okonkwo, Adaeze", specialization: "Computer Science", type: "Internal", affiliation: "Department" },
  { id: "INT-2", name: "Prof. Eze, Bartholomew", specialization: "Software Engineering", type: "Internal", affiliation: "Department" },
  { id: "EXT-1", name: "Prof. Smith, John", specialization: "AI Ethics", type: "External", affiliation: "Oxford University" },
  { id: "EXT-2", name: "Dr. Alabi, Funke", specialization: "Cybersecurity", type: "External", affiliation: "NITDA" },
];

// NEW: Shared clean scrollbar styles (arrowless, rounded, subtle gray)
const scrollbarStyles = "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400";

export default function AssignLecturerModal({
  isOpen,
  onClose,
  onAssign,
  role,
  context,
  targetGroup,
  availableGroups = []
}: AssignLecturerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error", message: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSelectedId(null);
      setFeedback(null);
      setIsSubmitting(false);
      setIsDropdownOpen(false);
      setSelectedGroupId(targetGroup?.id || "");
    }
  }, [isOpen, targetGroup]); 

  if (!isOpen || !role) return null;

  const filteredLecturers = dummyLecturers.filter((l) => {
    const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          l.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = role === "External Panellist" ? l.type === "External" : l.type === "Internal";
    return matchesSearch && matchesType;
  });

  const handleConfirmAssignment = async () => {
    if (!selectedId || !selectedGroupId) return;
    
    const selectedLecturer = dummyLecturers.find(l => l.id === selectedId);
    if (!selectedLecturer) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 800)); 
      await onAssign(selectedLecturer, role, selectedGroupId);

      setFeedback({ type: "success", message: `${selectedLecturer.name} assigned successfully!` });
      setTimeout(() => onClose(), 1000);
    } catch (error) {
      setFeedback({ type: "error", message: "Database error: Assignment conflict." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const needsGroupSelection = !targetGroup && availableGroups.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-100">
          <div>
            <h3 className="text-md font-bold text-[var(--color-brand-dark)] flex items-center gap-2">
              <UserCheck size={18} className="text-[var(--color-brand-teal)]" />
              Assign {role}
            </h3>
            {targetGroup && (
              <p className="text-xs font-semibold text-gray-500 mt-1 flex items-center gap-1.5">
                <Users size={12} /> Target: <span className="text-[var(--color-brand-teal)]">{targetGroup.name}</span>
              </p>
            )}
          </div>
          <button onClick={onClose} disabled={isSubmitting} className="text-gray-400 hover:text-[#B22A36] hover:bg-red-50 p-1.5 rounded-md transition-colors disabled:opacity-50">
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col h-[480px]">
          {feedback && (
            <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm font-bold ${feedback.type === "success" ? "bg-[#EEF5F4] text-[#417676]" : "bg-[#FAECEC] text-[#B22A36]"}`}>
              {feedback.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              {feedback.message}
            </div>
          )}

          {/* CUSTOM GROUP DROPDOWN */}
          {needsGroupSelection && (
            <div className="mb-4 shrink-0 relative z-20">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Select Target Group</label>
              
              <div 
                onClick={() => !isSubmitting && setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full h-11 bg-white border rounded-lg px-4 flex items-center justify-between cursor-pointer transition-all ${
                  isDropdownOpen ? "border-[var(--color-brand-teal)] ring-1 ring-[var(--color-brand-teal)]" : "border-gray-200 hover:border-[var(--color-brand-teal)] hover:bg-[#EEF5F4]"
                } ${isSubmitting ? "bg-gray-50 opacity-70 cursor-not-allowed" : ""}`}
              >
                <span className={`text-sm font-medium ${selectedGroupId ? "text-[var(--color-brand-dark)]" : "text-gray-400"}`}>
                  {selectedGroupId ? availableGroups.find(g => g.id === selectedGroupId)?.name : "-- Choose a project group --"}
                </span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </div>

              {/* Dropdown Options Box - Scrollbar Applied Here */}
              {isDropdownOpen && (
                <div className={`absolute top-full left-0 w-full mt-1.5 bg-white border border-gray-100 rounded-xl shadow-xl py-2 max-h-48 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150 z-50 ${scrollbarStyles}`}>
                  {availableGroups.map(g => (
                    <div 
                      key={g.id}
                      onClick={() => {
                        setSelectedGroupId(g.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                        selectedGroupId === g.id 
                          ? "bg-[#EEF5F4] text-[var(--color-brand-teal)] font-bold border-l-2 border-[var(--color-brand-teal)]" 
                          : "text-gray-600 hover:bg-[#EEF5F4] hover:text-[var(--color-brand-teal)] font-medium border-l-2 border-transparent"
                      }`}
                    >
                      {g.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SEARCH BAR */}
          <div className="relative mb-4 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" placeholder="Search by name or specialization..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} disabled={isSubmitting}
              className="w-full pl-10 pr-4 h-10 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[var(--color-brand-teal)] transition-shadow disabled:bg-gray-50"
            />
          </div>

          {/* Lecturer List - Scrollbar Applied Here */}
          <div className={`flex-1 overflow-y-auto pr-2 space-y-2 border-t border-gray-100 pt-2 ${scrollbarStyles}`}>
            {filteredLecturers.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-gray-400 italic">No matching personnel found.</div>
            ) : (
              filteredLecturers.map((lecturer) => (
                <div 
                  key={lecturer.id} onClick={() => !isSubmitting && setSelectedId(lecturer.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${
                    selectedId === lecturer.id 
                      ? "border-[var(--color-brand-teal)] bg-[#EEF5F4] shadow-sm" 
                      : "border-gray-100 hover:border-[var(--color-brand-teal)] hover:bg-[#EEF5F4]"
                  } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div>
                    <p className={`font-bold ${selectedId === lecturer.id ? "text-[var(--color-brand-teal)]" : "text-gray-800"}`}>{lecturer.name}</p>
                    <p className="text-xs font-medium text-gray-500 mt-0.5">{lecturer.specialization} • {lecturer.affiliation}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedId === lecturer.id ? "border-[var(--color-brand-teal)] bg-[var(--color-brand-teal)]" : "border-gray-300 bg-white"}`}>
                    {selectedId === lecturer.id && <CheckCircle2 size={12} className="text-white" />}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} disabled={isSubmitting} className="px-6 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50">Cancel</button>
          
          <button onClick={handleConfirmAssignment} disabled={!selectedId || !selectedGroupId || isSubmitting} className="px-6 py-2.5 text-sm font-semibold text-white bg-[var(--color-brand-teal)] rounded-lg hover:opacity-95 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Assigning...</> : "Confirm Assignment"}
          </button>
        </div>
      </div>
    </div>
  );
}