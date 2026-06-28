"use client";

import { useState, useEffect, useRef } from "react";
import { Mail, X, Send, Search, ChevronDown, Check, Shield } from "lucide-react";

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTarget?: string;
  currentUserRole?: "Coordinator" | "Supervisor"; 
  // NEW: To enforce the Supervisor rule, the system needs to know which group they own.
  supervisorOwnedGroup?: { id: string; label: string }; 
}

export default function BroadcastModal({ 
  isOpen, 
  onClose, 
  defaultTarget = "", 
  currentUserRole = "Coordinator", 
  supervisorOwnedGroup = { id: "@project-group-a", label: "Project Group A" } // Dummy default for testing
}: BroadcastModalProps) {
  
  // --- Form Backend States ---
  // Upgraded target to an array of objects to support multi-select for Coordinators
  const [selectedTargets, setSelectedTargets] = useState<{id: string, label: string}[]>([]);
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");

  // --- Dropdown UI States ---
  const [inputValue, setInputValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // --- Master List of Entities (Coordinator Only) ---
  const coordinatorOptions = [
    { id: "@all", label: "All Users" },
    { id: "@supervisors", label: "All Supervisors" },
    { id: "@panelists", label: "All Panelists" },
    { id: "@project-group-a", label: "Project Group A" },
    { id: "@project-group-b", label: "Project Group B" },
    { id: "@seminar-group-a", label: "Seminar Group A" },
    { id: "@seminar-group-b", label: "Seminar Group B" },
    { id: "@pending", label: "Pending Submissions" }
  ];

  // Filter out options that are already selected, then filter by search input
  const availableOptions = coordinatorOptions.filter(opt => 
    !selectedTargets.some(selected => selected.id === opt.id) &&
    (opt.label.toLowerCase().includes(inputValue.toLowerCase()) || 
     opt.id.toLowerCase().includes(inputValue.toLowerCase()))
  );

  // --- Initialization Hook ---
  useEffect(() => {
    if (isOpen) {
      if (currentUserRole === "Supervisor") {
        // Enforce Supervisor Rule: Locked to their specific group, no options available.
        setSelectedTargets([supervisorOwnedGroup]);
      } else {
        // Coordinator Logic: Pre-fill if a defaultTarget is passed
        if (defaultTarget) {
          const matchedOption = coordinatorOptions.find(opt => opt.id === defaultTarget);
          if (matchedOption) {
            setSelectedTargets([matchedOption]);
          } else {
            // Fallback for dynamic defaults
            setSelectedTargets([{ 
              id: defaultTarget.startsWith("@") ? defaultTarget : `@${defaultTarget.replace(/\s+/g, '-').toLowerCase()}`, 
              label: defaultTarget 
            }]);
          }
        } else {
          setSelectedTargets([]);
        }
      }
      
      setInputValue("");
      setBroadcastSubject("");
      setBroadcastMessage("");
      setIsDropdownOpen(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, defaultTarget, currentUserRole]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const removeTarget = (idToRemove: string) => {
    setSelectedTargets(prev => prev.filter(t => t.id !== idToRemove));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-100">
          <div>
            <h3 className="text-md font-bold text-[var(--color-brand-dark)] flex items-center gap-2">
              <Mail size={18} className="text-[var(--color-brand-teal)]" />
              Athena Broadcast Courier
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {currentUserRole === "Supervisor" 
                ? "Send a direct announcement to your assigned group." 
                : "Search and select entities or cohorts to distribute this message."}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-visible">
          
          {/* TO: MULTI-SELECT DROPDOWN */}
          <div className="relative" ref={dropdownRef}>
            <div className="flex justify-between items-end mb-2">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">To:</label>
              <span className="text-[10px] font-bold bg-[#EEF5F4] text-[var(--color-brand-teal)] px-2 py-0.5 rounded uppercase tracking-wide flex items-center gap-1">
                <Shield size={10} /> Role: {currentUserRole}
              </span>
            </div>
            
            <div 
              className={`flex flex-wrap items-center gap-2 w-full min-h-11 bg-white border rounded-lg p-2 transition-colors ${selectedTargets.length > 0 ? 'border-[var(--color-brand-teal)]' : 'border-gray-200 focus-within:border-[var(--color-brand-teal)]'}`}
              onClick={() => { if (currentUserRole === "Coordinator") setIsDropdownOpen(true); }}
            >
              {/* Render Selected Target Pills */}
              {selectedTargets.map(target => (
                <span key={target.id} className="bg-[#EEF5F4] text-[var(--color-brand-teal)] border border-[#C5E1E1] px-2.5 py-1 rounded flex items-center gap-1.5 text-xs font-bold">
                  {target.label} 
                  <span className="font-mono text-[9px] opacity-60 font-normal tracking-wide">{target.id}</span>
                  {currentUserRole === "Coordinator" && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeTarget(target.id); }}
                      className="ml-1 hover:text-red-500 transition-colors"
                    >
                      <X size={12} strokeWidth={3} />
                    </button>
                  )}
                </span>
              ))}

              {/* Search Input (Hidden for Supervisors) */}
              {currentUserRole === "Coordinator" && (
                <input 
                  type="text"
                  placeholder={selectedTargets.length === 0 ? "Search targets (e.g., @all, @supervisors)..." : ""}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  className="flex-1 min-w-[150px] h-7 bg-transparent text-sm font-medium focus:outline-none text-[var(--color-brand-dark)]"
                />
              )}
              
              {currentUserRole === "Coordinator" && (
                <ChevronDown className={`text-gray-400 ml-auto transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} size={16} />
              )}
            </div>

            {/* Dropdown Options List (Coordinator Only) */}
            {isDropdownOpen && currentUserRole === "Coordinator" && (
              <div className="absolute top-full left-0 right-0 mt-1 max-h-[200px] overflow-y-auto custom-scrollbar bg-white border border-gray-200 rounded-lg shadow-xl z-20 py-1">
                {availableOptions.length > 0 ? (
                  availableOptions.map((opt) => (
                    <div 
                      key={opt.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTargets(prev => [...prev, opt]);
                        setInputValue("");
                        setIsDropdownOpen(false);
                      }}
                      className="px-4 py-2.5 flex items-center gap-2 hover:bg-[#EEF5F4] cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                    >
                      <span className="text-sm font-medium text-gray-700">{opt.label}</span>
                      <span className="font-mono text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded tracking-wide">
                        {opt.id}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-400 italic">
                    {inputValue ? "No matching targets found." : "All specific targets have been selected."}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SUBJECT HEADING */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Subject Heading:</label>
            <input 
              type="text"
              placeholder="e.g., Mandatory Mid-Semester Project Assessment Document Deadline"
              value={broadcastSubject}
              onChange={(e) => setBroadcastSubject(e.target.value)}
              className="w-full h-11 bg-white border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-[var(--color-brand-teal)] focus:ring-1 focus:ring-[var(--color-brand-teal)] text-[var(--color-brand-dark)]"
            />
          </div>

          {/* MESSAGE BODY */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Broadcast Message Body:</label>
            <textarea 
              placeholder="Compose notification text..."
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              className="w-full h-[180px] bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[var(--color-brand-teal)] focus:ring-1 focus:ring-[var(--color-brand-teal)] text-[var(--color-brand-dark)] resize-none custom-scrollbar"
            ></textarea>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 z-10 shrink-0">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Discard
          </button>
          <button 
            onClick={() => {
              // The backend payload will now receive an array of targets!
              const payload = {
                targets: selectedTargets.map(t => t.id), 
                subject: broadcastSubject, 
                message: broadcastMessage, 
                dispatchedByRole: currentUserRole
              };
              console.log("DISPATCHING BROADCAST PAYLOAD:", payload);
              onClose();
            }}
            disabled={selectedTargets.length === 0 || !broadcastSubject.trim() || !broadcastMessage.trim()}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-[var(--color-brand-teal)] rounded-lg hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-sm"
          >
            <Send size={15} />
            Dispatch Broadcast
          </button>
        </div>

      </div>
    </div>
  );
}