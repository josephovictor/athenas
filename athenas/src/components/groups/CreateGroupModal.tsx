"use client";

import { useState, useEffect } from "react";
import { X, Users, UserPlus, Shield, UserCheck, CheckCircle2 } from "lucide-react";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  // This prop tells the modal which configuration to use!
  groupContext: "Project" | "Seminar" | ""; 
}

export default function CreateGroupModal({ isOpen, onClose, groupContext }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [selectedSupervisor, setSelectedSupervisor] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedPanelists, setSelectedPanelists] = useState<string[]>([]);

  // Reset the form whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      setGroupName("");
      setSelectedSupervisor("");
      setSelectedStudents([]);
      setSelectedPanelists([]);
    }
  }, [isOpen]);

  // --- Dummy Data for Selectors ---
  const availableStudents = ["Adeyemi, Chisom", "Nwosu, Chidi", "Bello, Aisha", "Okafor, Emeka"];
  const availableSupervisors = ["Dr. Okonkwo, Adaeze", "Prof. Eze, Bartholomew", "Dr. Abubakar, Ibrahim"];
  const availablePanelists = ["Dr. Nwachukwu, Obiora", "Prof. Chukwudi, James", "Dr. Alabi, Sarah"];

  // Toggle helper for multi-selects
  const toggleSelection = (item: string, list: string[], setList: (val: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-100 shrink-0">
          <div>
            <h3 className="text-md font-bold text-[var(--color-brand-dark)] flex items-center gap-2">
              <Users size={18} className="text-[var(--color-brand-teal)]" />
              Create New {groupContext} Group
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Configure members and evaluators for this {groupContext?.toLowerCase()} cohort.
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="space-y-6">
            
            {/* Group Name */}
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Group Identifier / Name</label>
              <input 
                type="text"
                placeholder={`e.g., ${groupContext} Group A`}
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full h-11 bg-white border border-gray-200 rounded-lg px-4 text-sm font-semibold focus:outline-none focus:border-[var(--color-brand-teal)] focus:ring-1 focus:ring-[var(--color-brand-teal)] text-[var(--color-brand-dark)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                
                {/* CONDITIONAL FIELD: Supervisor (Only show if Project Context) */}
                {groupContext === "Project" && (
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <UserCheck size={12} /> Assign Supervisor
                    </label>
                    <select 
                      value={selectedSupervisor}
                      onChange={(e) => setSelectedSupervisor(e.target.value)}
                      className="w-full h-11 bg-white border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-[var(--color-brand-teal)] text-gray-700"
                    >
                      <option value="">-- Select a Lecturer --</option>
                      {availableSupervisors.map(sup => (
                        <option key={sup} value={sup}>{sup}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Panelists (Always Show) */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Shield size={12} /> Assign Panelists
                  </label>
                  <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 max-h-48 overflow-y-auto custom-scrollbar">
                    {availablePanelists.map(pan => (
                      <div 
                        key={pan} 
                        onClick={() => toggleSelection(pan, selectedPanelists, setSelectedPanelists)}
                        className="flex items-center gap-3 p-3 hover:bg-[#EEF5F4] cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedPanelists.includes(pan) ? 'bg-[var(--color-brand-teal)] border-[var(--color-brand-teal)]' : 'border-gray-300 bg-white'}`}>
                          {selectedPanelists.includes(pan) && <CheckCircle2 size={12} className="text-white" />}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{pan}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Students */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <UserPlus size={12} /> Assign Students
                </label>
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 h-[250px] overflow-y-auto custom-scrollbar">
                  {availableStudents.map(student => (
                    <div 
                      key={student} 
                      onClick={() => toggleSelection(student, selectedStudents, setSelectedStudents)}
                      className="flex items-center gap-3 p-3 hover:bg-[#EEF5F4] cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedStudents.includes(student) ? 'bg-[var(--color-brand-teal)] border-[var(--color-brand-teal)]' : 'border-gray-300 bg-white'}`}>
                        {selectedStudents.includes(student) && <CheckCircle2 size={12} className="text-white" />}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{student}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2 text-right">{selectedStudents.length} selected</p>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 shrink-0">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            disabled={!groupName.trim() || selectedStudents.length === 0}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-[var(--color-brand-teal)] rounded-lg hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-2"
          >
            <CheckCircle2 size={16} />
            Generate Group
          </button>
        </div>

      </div>
    </div>
  );
}