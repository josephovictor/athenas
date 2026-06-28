"use client";

/* ========================================= */
/* 1. IMPORTS                                */
/* ========================================= */
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation"; 
import { Bell, MessageSquare, Search, Plus, X, CheckCircle2, ShieldAlert, Send } from "lucide-react";

import BroadcastModal from "@/components/broadcast/BroadcastModal";
import CreateGroupModal from "@/components/groups/CreateGroupModal";
import AddCriterionModal from "@/components/defence/AddCriterionModal"; 
import GroupDetailView from "@/components/groups/GroupDetailView";

import AssignLecturerModal, { AssignmentRole, Lecturer } from "@/components/Assign/AssignLecturerModal";

/* ========================================= */
/* 2. INTERNAL COMPONENT                     */
/* ========================================= */
function ProjectPortalContent() {
  // --- URL & PARAMS ---
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlTab = searchParams.get("tab");

  // --- USE STATES ---
  const [activeCard, setActiveCard] = useState(urlTab || "Groups");
  const [selectedGroupDetail, setSelectedGroupDetail] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [broadcastTarget, setBroadcastTarget] = useState("");
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isAddCriterionOpen, setIsAddCriterionOpen] = useState(false);

  //Assign Modal States -- For supervisor, panellist etc.
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignmentRole, setAssignmentRole] = useState<AssignmentRole | null>(null);
  const [targetGroup, setTargetGroup] = useState<{ id: string; name: string } | null>(null);
  
  const [rubric, setRubric] = useState([
    { id: 1, name: "System Design & Architecture", maxScore: 30 },
    { id: 2, name: "Implementation & Functionality", maxScore: 40 },
    { id: 3, name: "Documentation & Formatting", maxScore: 20 },
    { id: 4, name: "Presentation & Defence", maxScore: 10 },
  ]);

  // --- EFFECTS ---
  // Force update if the URL changes
  useEffect(() => {
    if (urlTab) {
      setActiveCard(urlTab);
    }
  }, [urlTab]);

  // --- FUNCTIONS ---
  const handleAddCriterion = (newCriterion: { label: string; maxScore: number }) => {
    const formattedCriterion = {
      id: Date.now(), 
      name: newCriterion.label, 
      maxScore: newCriterion.maxScore 
    };
    setRubric(prev => [...prev, formattedCriterion]);
  };

  const handleRemoveCriterion = (idToRemove: number) => {
    setRubric(prev => prev.filter(item => item.id !== idToRemove));
  };

  // --- ARRAYS & DUMMY DATA ---
  const navCards = ["Groups", "Supervisors", "Panelists", "Final Report", "Defence"];

  const [groups, setGroups] = useState([
    { id: "G1", name: "Project Group A", supervisor: "Dr. Okonkwo, Adaeze", members: ["Adeyemi, Chisom", "Nwosu, Chidi"], panelists: ["Prof. Chukwudi, James (Ext)", "Dr. Alabi, Sarah"] },
    { id: "G2", name: "Project Group B", supervisor: "Prof. Eze, Bartholomew", members: ["Bello, Aisha", "Eze, Tobechukwu", "Okafor, Emeka"], panelists: ["Dr. Alabi, Sarah (Ext)"] },
    { id: "G3", name: "Project Group C", supervisor: "Dr. Abubakar, Ibrahim", members: ["Musa, Fatima", "Okafor, Chinedu"], panelists: ["Prof. Musa, Kabir (Ext)"] },
    { id: "G4", name: "Project Group D", supervisor: "Dr. Nwachukwu, Obiora", members: ["Ibrahim, Yusuf", "Oluwaseun, David"], panelists: ["Dr. Alabi, Sarah (Ext)"] },
  ]);

  const [supervisors, setSupervisors] = useState([
    { name: "Dr. Okonkwo, Adaeze", spec: "Computer Science", group: "Project Group A" },
    { name: "Prof. Eze, Bartholomew", spec: "Software Engineering", group: "Project Group B" },
  ]);

  const [internalPanelists, setInternalPanelists] = useState([
    { name: "Dr. Okonkwo, Adaeze", spec: "Computer Science", group: "Project Group A", isSupervisor: true },
    { name: "Prof. Eze, Bartholomew", spec: "Software Engineering", group: "Project Group B", isSupervisor: true },
    { name: "Dr. Nwachukwu, Obiora", spec: "Database Systems", group: "Project Group D", isSupervisor: true },
    { name: "Dr. Abubakar, Ibrahim", spec: "Information Systems", group: null, isSupervisor: false },
  ]);

  const [externalPanelists, setExternalPanelists] = useState([
    { name: "Prof. Chukwudi, James", spec: "Cybersecurity", group: "Project Group A" },
    { name: "Dr. Alabi, Sarah", spec: "Artificial Intelligence", group: "Project Group B" },
  ]);

  const finalReports = [
    { 
      id: "G1", name: "Project Group A", total: 2, submitted: 2, isComplete: true,
      members: [{ name: "Adeyemi, Chisom", status: "submitted" }, { name: "Nwosu, Chidi", status: "submitted" }]
    },
    { 
      id: "G2", name: "Project Group B", total: 3, submitted: 1, isComplete: false,
      members: [{ name: "Bello, Aisha", status: "submitted" }, { name: "Eze, Tobechukwu", status: "pending" }, { name: "Okafor, Emeka", status: "pending" }]
    },
  ];

  // --- CALCULATED VALUES ---
  const totalRubricScore = rubric.reduce((acc, curr) => acc + (Number(curr.maxScore) || 0), 0);

  const filteredGroups = groups.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (g.supervisor || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.members.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // --- MAIN UI RENDER ---
  return (
    <div className="flex flex-col h-full w-full bg-white overflow-hidden relative">
      <header className="shrink-0 bg-white border-b border-[var(--color-brand-light)]/70 px-8 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-dark)]">Project Portal</h1>
          <p className="text-sm text-gray-400 mt-1">Manage project groups, final reports, and defences</p>
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

      <div className="flex-1 flex flex-col min-h-0 w-[95%] mx-auto pt-6">
        
        <div className="shrink-0 grid grid-cols-5 gap-4 mb-6">
          {navCards.map((card) => (
            <button
              key={card}
              onClick={() => { 
                setActiveCard(card); 
                setSelectedGroupDetail(null); 
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

        {!selectedGroupDetail && activeCard !== "Defence" && (
          <div className="shrink-0 mb-6">
            <div className="relative w-full shadow-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder={`Search ${activeCard.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 h-10 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[var(--color-brand-teal)] transition-shadow"
              />
            </div>
          </div>
        )}

      {/* ========================================= */}
      {/* VIEW 1: GROUPS (LIST VIEW)                 */}
      {/* ========================================= */}
        {activeCard === "Groups" && !selectedGroupDetail && (
          <div className="flex-1 overflow-y-auto pr-3 pb-6">
            <div className="grid grid-cols-3 gap-6">
              {filteredGroups.map((group) => (
                <div key={group.id} onClick={() => setSelectedGroupDetail(group)} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                    <h3 className="font-bold text-[var(--color-brand-dark)] text-lg">{group.name}</h3>
                    <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-md">{group.members.length} Members</span>
                  </div>
                  <div className="space-y-3 flex-1">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Assigned Supervisor</p>
                      <p className="text-sm font-medium text-[var(--color-brand-teal)]">
                        {group.supervisor?.replace(/,/g, '')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Members</p>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {group.members.map(m => m.replace(/,/g, '').trim()).join(" • ")}
                      </p>
                    </div>
                  </div>
                  <button className="mt-5 w-full py-2 bg-gray-50 text-gray-600 text-sm font-semibold rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                    Manage Group
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* SUB VIEW : GROUP DETAILS                  */}
        {/* ========================================= */}
        {activeCard === "Groups" && selectedGroupDetail && (
          <GroupDetailView
            context="Project"
            group={{
              id: selectedGroupDetail.id,
              name: selectedGroupDetail.name,
              students: selectedGroupDetail.members.map((m: string) => ({ id: m, name: m })),
              supervisor: selectedGroupDetail.supervisor,
              panelists: selectedGroupDetail.panelists?.map((p: string) => ({ id: p, name: p })) || []
            }}
            onBack={() => setSelectedGroupDetail(null)}
            
            availableStudents={[
              { id: "2023/001", name: "Adeyemi, Chisom", subtitle: "2023/001" },
              { id: "2023/005", name: "Okafor, Emeka", subtitle: "2023/005" },
              { id: "2023/008", name: "Abubakar, Zainab", subtitle: "2023/008" },
              { id: "2023/012", name: "Danladi, Hassan", subtitle: "2023/012" }
            ]}
            availableSupervisors={supervisors.map(s => ({ id: s.name, name: s.name, subtitle: s.spec }))}
            availablePanelists={[...internalPanelists, ...externalPanelists].map(p => ({ id: p.name, name: p.name, subtitle: p.spec }))}
            
            onAddStudent={(data) => {
              const updated = { ...selectedGroupDetail, members: [...selectedGroupDetail.members, data.name] };
              setGroups(prev => prev.map(g => g.id === updated.id ? updated : g));
              setSelectedGroupDetail(updated);
            }}
            onAssignSupervisor={(data) => {
              const updated = { ...selectedGroupDetail, supervisor: data.name };
              setGroups(prev => prev.map(g => g.id === updated.id ? updated : g));
              setSelectedGroupDetail(updated);
            }}
            onAddPanelist={(data) => {
              const updated = { ...selectedGroupDetail, panelists: [...(selectedGroupDetail.panelists || []), data.name] };
              setGroups(prev => prev.map(g => g.id === updated.id ? updated : g));
              setSelectedGroupDetail(updated);
            }}
            onRemoveStudent={(id) => {
              const updated = {
                ...selectedGroupDetail,
                members: selectedGroupDetail.members.filter((m: string) => m !== id)
              };
              setGroups(prev => prev.map(g => g.id === updated.id ? updated : g));
              setSelectedGroupDetail(updated);
            }}
            onRemoveSupervisor={() => {
              const updated = { ...selectedGroupDetail, supervisor: "" };
              setGroups(prev => prev.map(g => g.id === updated.id ? updated : g));
              setSelectedGroupDetail(updated);
            }}
            onRemovePanelist={(id) => {
              const updated = {
                ...selectedGroupDetail,
                panelists: selectedGroupDetail.panelists.filter((p: string) => p !== id)
              };
              setGroups(prev => prev.map(g => g.id === updated.id ? updated : g));
              setSelectedGroupDetail(updated);
            }}
          />
        )}


      {/* ========================================= */}
      {/* VIEW 2: SUPERVISORS                        */}
      {/* ========================================= */}
        {activeCard === "Supervisors" && (
           <div className="flex-1 overflow-y-auto pr-3 pb-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-bold text-[var(--color-brand-dark)]">Project Supervisors</h2>
                <p className="text-xs text-gray-500 mt-1">Manage all supervisor assignments across project groups.</p>
              </div>
              <button 
                onClick={() => {
                  setAssignmentRole("Supervisor");
                  setTargetGroup(null); // Fix applied
                  setIsAssignModalOpen(true);
                }}
                className="bg-[var(--color-brand-teal)] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 hover:opacity-90 transition-colors"
              >
                <Plus size={16} /> Assign Supervisor
              </button>
            </div>

            <table className="w-full border-collapse border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
              <thead className="bg-[#F8F9FA] border-b border-gray-200">
                <tr>
                  <th style={{ textAlign: "left" }} className="px-6 py-4 text-sm font-bold text-gray-600">Lecturer Name</th>
                  <th style={{ textAlign: "left" }} className="px-6 py-4 text-sm font-bold text-gray-600">Area of Specialisation</th>
                  <th style={{ textAlign: "left" }} className="px-6 py-4 text-sm font-bold text-gray-600">Assigned Group</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {supervisors.map((sup, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">{sup.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{sup.spec}</td>
                    <td className="px-6 py-4 text-sm font-medium text-[var(--color-brand-teal)]">{sup.group}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      {/* ========================================= */}
      {/* VIEW 3: PANELISTS                          */}
      {/* ========================================= */}
      {activeCard === "Panelists" && (
        <div className="flex-1 overflow-y-auto pr-3 pb-6 flex flex-col gap-8">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-[var(--color-brand-dark)]">Project Panelists</h2>
                <p className="text-xs text-gray-500 mt-1">Manage internal and external evaluators for project defences.</p>
              </div>
            </div>

            {/* INTERNAL PANELISTS SECTION */}
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-md font-bold text-gray-600">Internal Panelists</h3>
              <button 
                onClick={() => {
                  setAssignmentRole("Internal Panellist");
                  setTargetGroup(null); // Fix applied
                  setIsAssignModalOpen(true);
                }}
                className="bg-[var(--color-brand-teal)] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:opacity-90 flex items-center gap-2 transition-colors"
              >
                <Plus size={16} /> Assign Internal
              </button>
            </div>
            <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden mb-8">
              <table className="w-full border-collapse relative">
                <thead className="bg-[#F8F9FA] border-b border-gray-200">
                  <tr>
                    <th style={{ textAlign: "left" }} className="px-6 py-4 text-sm font-bold text-gray-600">Panelist Name</th>
                    <th style={{ textAlign: "left" }} className="px-6 py-4 text-sm font-bold text-gray-600">Area of Specialisation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {internalPanelists.map((pan, i) => (
                    <tr key={`internal-${i}`} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">{pan.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{pan.spec}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* EXTERNAL PANELISTS SECTION */}
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-md font-bold text-gray-600">External Panelists</h3>
              <button 
                onClick={() => {
                  setAssignmentRole("External Panellist");
                  setTargetGroup(null); // Fix applied
                  setIsAssignModalOpen(true);
                }}
                className="bg-[var(--color-brand-teal)] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:opacity-90 flex items-center gap-2 transition-colors"
              >
                <Plus size={16} /> Assign External
              </button>
            </div>
            <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
              <table className="w-full border-collapse relative">
                <thead className="bg-[#F8F9FA] border-b border-gray-200">
                  <tr>
                    <th style={{ textAlign: "left" }} className="px-6 py-4 text-sm font-bold text-gray-600">Panelist Name</th>
                    <th style={{ textAlign: "left" }} className="px-6 py-4 text-sm font-bold text-gray-600">Area of Specialisation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {externalPanelists.map((pan, i) => (
                    <tr key={`external-${i}`} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">{pan.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{pan.spec}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* VIEW 4: FINAL REPORT                       */}
      {/* ========================================= */}
        {activeCard === "Final Report" && (
           <div className="flex-1 overflow-y-auto pr-3 pb-6 flex flex-col">
            <div className="space-y-4">
              {finalReports.map((report) => (
                <div key={report.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex items-center justify-between">
                    <h3 className="font-bold text-[var(--color-brand-dark)]">{report.name}</h3>
                    <span className="font-bold text-gray-500 text-sm">{report.submitted} / {report.total}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* VIEW 5: DEFENCE                            */}
        {/* ========================================= */}
        {activeCard === "Defence" && (
           <div className="flex-1 overflow-y-auto pr-3 pb-6 flex flex-col">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-[var(--color-brand-dark)]">Defence Configuration</h2>
              <button className="bg-gray-200 text-gray-400 px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm cursor-not-allowed flex items-center gap-2">
                <ShieldAlert size={16} />
                Open Scores
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-700 mb-6">Scoring Rubric Configuration</h3>
              
              <div className="space-y-3 mb-6">
                {rubric.map((item) => (
                  <div 
                    key={item.id} 
                    className="group flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                  >
                    <span className="font-semibold text-[var(--color-brand-dark)]">{item.name}</span>
                    <div className="flex items-center gap-6">
                      <span className="text-sm font-bold text-[var(--color-brand-teal)]">Max Score: {item.maxScore}</span>
                      
                      <button 
                        onClick={() => handleRemoveCriterion(item.id)}
                        className="relative z-10 text-gray-400 hover:text-[#B22A36] hover:bg-red-50 p-1.5 rounded-md transition-all"
                      >
                        <X size={18} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                ))}

              </div>

              <div className="flex justify-between items-center border-t border-gray-100 pt-6">
                <span className="font-bold text-gray-500 text-sm">Total Max Score: <span className="text-[var(--color-brand-dark)] text-lg ml-1">{totalRubricScore}</span></span>
                
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

      <div className="shrink-0 bg-white border-t border-gray-200 px-8 py-5">
        <div className="w-[95%] mx-auto flex justify-between items-center">
          <div className="flex gap-4">
            
            {activeCard === "Groups" && (
              <button 
                onClick={() => setIsCreateGroupOpen(true)}
                className="bg-[var(--color-brand-slate)] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2"
              >
                <Plus size={16} /> Create New Group
              </button>
            )}

            <button 
              onClick={() => { setBroadcastTarget(`@project-${activeCard.toLowerCase()}`); setIsBroadcastOpen(true); }}
              className="bg-[var(--color-brand-teal)] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 flex items-center gap-2 shadow-sm"
            >
              <Send size={16} /> Send Broadcast
            </button>
            
          </div>
          <div className="text-sm text-gray-400 flex items-center gap-2 font-medium">
            <CheckCircle2 size={16} className="text-[#417676]" /> All records synchronised
          </div>
        </div>
      </div>
      
      {/* ========================================= */}
      {/* MODALS                    */}
      {/* ========================================= */}
      <BroadcastModal isOpen={isBroadcastOpen} onClose={() => setIsBroadcastOpen(false)} defaultTarget={broadcastTarget} />
      
      <CreateGroupModal 
        isOpen={isCreateGroupOpen} 
        onClose={() => setIsCreateGroupOpen(false)} 
        groupContext="Project" 
      />

      <AddCriterionModal 
        isOpen={isAddCriterionOpen}
        onClose={() => setIsAddCriterionOpen(false)}
        onAdd={handleAddCriterion}
        context="Project"
        currentTotal={totalRubricScore}
      />

      <AssignLecturerModal 
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setTargetGroup(null); // Reset it!
        }}
        role={assignmentRole}
        context="Project"
        
        // 1. If triggered from a specific group view, pass this:
        targetGroup={targetGroup} 
        
        // 2. If triggered globally, pass the list of all groups to populate the dropdown:
        availableGroups={groups.map(g => ({ id: g.id, name: g.name }))} 
        
        onAssign={async (lecturer, assignedRole, groupId) => {
          // Look up the exact group name from the ID we got back
          const groupName = groups.find(g => g.id === groupId)?.name || "Unknown Group";

          const newMember = { 
            name: lecturer.name, 
            spec: lecturer.specialization,
            group: groupName
          };

          if (assignedRole === "Supervisor") {
            setSupervisors(prev => [...prev, newMember]);
          } else if (assignedRole === "Internal Panellist") {
            setInternalPanelists(prev => [...prev, { ...newMember, isSupervisor: false }]);
          } else if (assignedRole === "External Panellist") {
            setExternalPanelists(prev => [...prev, newMember]);
          }
        }}
      />
    </div>
  );
}


/* ========================================= */
/* 3. EXPORTED WRAPPER (FOR NEXT.JS)          */
/* ========================================= */
export default function ProjectPortalPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-500">Loading Portal...</div>}>
      <ProjectPortalContent />
    </Suspense>
  );
}