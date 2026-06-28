"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import AssignMemberModal, { AssignOption } from "@/components/groups/AssignMemberModal";

export interface NormalizedGroupDetail {
  id: string | number;
  name: string;
  students: { id: string; name: string; subtitle?: string }[];
  supervisor?: string | null;
  panelists: { id: string; name: string }[];
}

interface GroupDetailViewProps {
  group: NormalizedGroupDetail;
  context: "Project" | "Seminar";
  onBack: () => void;
  
  availableStudents: AssignOption[];
  availableSupervisors?: AssignOption[];
  availablePanelists: AssignOption[];
  
  onAddStudent: (data: AssignOption) => void;
  onRemoveStudent: (studentId: string) => void;
  onAssignSupervisor?: (data: AssignOption) => void;
  onRemoveSupervisor?: () => void;
  onAddPanelist: (data: AssignOption) => void;
  onRemovePanelist: (panelistId: string) => void;
}

export default function GroupDetailView({
  group,
  context,
  onBack,
  availableStudents,
  availableSupervisors,
  availablePanelists,
  onAddStudent,
  onRemoveStudent,
  onAssignSupervisor,
  onRemoveSupervisor,
  onAddPanelist,
  onRemovePanelist
}: GroupDetailViewProps) {

  // Single source of truth for the modal state
  const [modalType, setModalType] = useState<"Student" | "Supervisor" | "Panelist" | null>(null);

  // Dynamically configure the modal based on what button was clicked
  let modalOptions: AssignOption[] = [];
  let modalTitle = "";
  let modalPlaceholder = "";

  if (modalType === "Student") {
    modalOptions = availableStudents;
    modalTitle = "Add Student to Group";
    modalPlaceholder = "Search by name or matric number...";
  } else if (modalType === "Supervisor") {
    modalOptions = availableSupervisors || [];
    modalTitle = "Assign Supervisor";
    modalPlaceholder = "Search by lecturer name or specialization...";
  } else if (modalType === "Panelist") {
    modalOptions = availablePanelists;
    modalTitle = "Assign Panelist";
    modalPlaceholder = "Search panellists...";
  }

  const handleModalSubmit = (data: AssignOption) => {
    if (modalType === "Student") onAddStudent(data);
    if (modalType === "Supervisor" && onAssignSupervisor) onAssignSupervisor(data);
    if (modalType === "Panelist") onAddPanelist(data);
    setModalType(null); // Close the modal
  };

  return (
    <div className="flex-1 overflow-y-auto pr-3 pb-6 flex flex-col animate-in fade-in duration-200">
      
      <button 
        onClick={onBack}
        className="text-sm font-semibold text-gray-500 hover:text-[var(--color-brand-dark)] mb-4 self-start flex items-center gap-1 transition-colors"
      >
        &larr; Back to all groups
      </button>
      
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[var(--color-brand-dark)] mb-6">
          {group.name} Configuration
        </h2>
        
        <div className="grid grid-cols-2 gap-10">
          
          {/* ============================== */}
          {/* LEFT COLUMN: STUDENTS          */}
          {/* ============================== */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-700">Assigned Students</h3>
              <button 
                onClick={() => setModalType("Student")}
                className="text-xs font-bold bg-[#EEF5F4] text-[var(--color-brand-teal)] px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-[#E0EFEF] transition-colors"
              >
                <Plus size={14} strokeWidth={2.5} /> Add Student
              </button>
            </div>
            
            <ul className="space-y-2 max-h-[350px] overflow-y-auto custom-scrollbar pr-2 pb-1">
              {group.students.length > 0 ? (
                group.students.map((student) => (
                 <li key={student.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-300 transition-colors">
                  <span className="text-sm font-medium text-gray-700">
                    {student.name.replace(/,/g, '')} 
                    {student.subtitle && <span className="text-xs text-gray-400 ml-2">({student.subtitle})</span>}
                  </span>
                  <button 
                    onClick={() => onRemoveStudent(student.id)}
                    className="text-gray-400 hover:text-[#B22A36] hover:bg-[#FAECEC] p-1.5 rounded-md transition-colors"
                  >
                    <X size={16} strokeWidth={2.5} />
                  </button>
                </li>
                ))
              ) : (
                <li className="p-3 text-center border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-400 italic">
                  No students assigned
                </li>
              )}
            </ul>
          </div>
          
          {/* ============================== */}
          {/* RIGHT COLUMN: STAFF            */}
          {/* ============================== */}
          <div className="space-y-8">
            
            {/* SUPERVISOR (Only renders if context is Project) */}
            {context === "Project" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-700">Assigned Supervisor</h3>
                  <button 
                    onClick={() => setModalType("Supervisor")}
                    className="text-xs font-bold bg-[#EEF5F4] text-[var(--color-brand-teal)] px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-[#E0EFEF] transition-colors"
                  >
                    <Plus size={14} strokeWidth={2.5} /> {group.supervisor ? "Change Supervisor" : "Add Supervisor"}
                  </button>
                </div>
                {group.supervisor ? (
                  <div className="flex justify-between items-center p-3 bg-white border border-[var(--color-brand-teal)] rounded-lg shadow-sm group/item">
                    <span className="text-sm font-bold text-[var(--color-brand-teal)]">{group.supervisor.replace(/,/g, '')}</span>
                      <button 
                        // Fixed missing optional check here
                        onClick={() => onRemoveSupervisor && onRemoveSupervisor()}
                        className="text-gray-400 hover:text-[#B22A36] hover:bg-[#FAECEC] p-1.5 rounded-md transition-colors"
                      >
                        <X size={16} strokeWidth={2.5} />
                      </button>
                  </div>
                ) : (
                  <div className="p-3 text-center border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-400 italic">
                    No supervisor assigned yet
                  </div>
                )}
              </div>
            )}

            {/* PANELISTS */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-700">Assigned Panelists</h3>
                <button 
                  onClick={() => setModalType("Panelist")}
                  className="text-xs font-bold bg-[#EEF5F4] text-[var(--color-brand-teal)] px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-[#E0EFEF] transition-colors"
                >
                  <Plus size={14} strokeWidth={2.5} /> Add Panellist
                </button>
              </div>
              
              <ul className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-2 pb-1">
                {group.panelists.length > 0 ? (
                  group.panelists.map((pan) => (
                    <li key={pan.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-300 transition-colors">
                      <span className="text-sm font-medium text-[var(--color-brand-teal)]">{pan.name.replace(/,/g, '')}</span>
                      <button 
                        onClick={() => onRemovePanelist(pan.id)}
                        className="text-gray-400 hover:text-[#B22A36] hover:bg-[#FAECEC] p-1.5 rounded-md transition-colors"
                      >
                        <X size={16} strokeWidth={2.5} />
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="p-3 text-center border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-400 italic">
                    No panelists assigned yet
                  </li>
                )}
              </ul>
            </div>
            
          </div>
        </div>
      </div>

      <AssignMemberModal 
        isOpen={modalType !== null}
        onClose={() => setModalType(null)}
        title={modalTitle}
        searchPlaceholder={modalPlaceholder}
        options={modalOptions}
        onAssign={handleModalSubmit}
      />

    </div>
  );
}