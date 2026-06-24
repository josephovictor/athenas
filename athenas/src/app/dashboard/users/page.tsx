"use client";

import AddUserModal from "@/components/users/AddUserModal";
import UploadCSVModal from "@/components/users/UploadCSVModal";
import ConfirmModal from "@/components/ui/ConfirmModal";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, MessageSquare, Search, Plus, X, UserPlus, UploadCloud, ChevronUp, CheckCircle2 } from "lucide-react";




export default function UsersPage() {
  const router = useRouter();

  // 1. UI & Modal States
  const [activeCard, setActiveCard] = useState("Students");
  const [searchQuery, setSearchQuery] = useState("");
  const [isImportDropdownOpen, setIsImportDropdownOpen] = useState(false);
  
  
  const navCards = ["Students", "Lecturers", "External Panellists"];

  // 2. Data States (Now fetched from API)
  const [students, setStudents] = useState<any[]>([]);
  const [lecturers, setLecturers] = useState<any[]>([]);
  const [externalPanellists, setExternals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

//
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadDefaultRole, setUploadDefaultRole] = useState<"student" | "lecturer" | "external_panelist">("student");

  
  // Add this after your other state declarations
const [deleteConfirm, setDeleteConfirm] = useState<{
  isOpen: boolean;
  userId: string;
  userName: string;
  userType: string;
}>({
  isOpen: false,
  userId: "",
  userName: "",
  userType: "",
});

// Fetch data from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Fetch all three types in parallel
        const [studentsRes, lecturersRes, externalsRes] = await Promise.all([
          fetch("/api/coordinator/users?role=student"),
          fetch("/api/coordinator/users?role=lecturer"),
          fetch("/api/coordinator/users?role=external_panelist"),
        ]);

        const studentsData = await studentsRes.json();
        const lecturersData = await lecturersRes.json();
        const externalsData = await externalsRes.json();

        // Transform API data to match UI structure
        if (studentsRes.ok) {
          setStudents(studentsData.users.map((u: any) => ({
            id: u.id,
            fullName: u.profile?.name || "N/A",
            matNo: u.profile?.mat_number || "N/A",
            level: u.profile?.level || "N/A",
            email: u.email,
            phone: u.profile?.phone || "N/A",
            status: u.is_activated ? "Active" : "Inactive",
          })));
        }

        if (lecturersRes.ok) {
          setLecturers(lecturersData.users.map((u: any) => ({
            id: u.id,
            title: u.profile?.title || "",
            fullName: u.profile?.name || "N/A",
            spec: u.profile?.specialization || "N/A",
            email: u.email,
            phone: u.profile?.phone || "N/A",
            status: u.is_activated ? "Active" : "Inactive",
          })));
        }

        if (externalsRes.ok) {
          setExternals(externalsData.users.map((u: any) => ({
            id: u.id,
            title: u.profile?.title || "",
            fullName: u.profile?.name || "N/A",
            spec: u.profile?.specialization || "N/A",
            email: u.email,
            phone: u.profile?.phone || "N/A",
            status: u.is_activated ? "Active" : "Invited",
          })));
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Add this function after your fetchUsers useEffect
  const refetchUsers = async () => {
    setLoading(true);
    try {
      const [studentsRes, lecturersRes, externalsRes] = await Promise.all([
        fetch("/api/coordinator/users?role=student"),
        fetch("/api/coordinator/users?role=lecturer"),
        fetch("/api/coordinator/users?role=external_panelist"),
      ]);

      const studentsData = await studentsRes.json();
      const lecturersData = await lecturersRes.json();
      const externalsData = await externalsRes.json();

      if (studentsRes.ok) {
        setStudents(studentsData.users.map((u: any) => ({
          id: u.id,
          fullName: u.profile?.name || "N/A",
          matNo: u.profile?.mat_number || "N/A",
          level: u.profile?.level || "N/A",
          email: u.email,
          phone: u.profile?.phone || "N/A",
          status: u.is_activated ? "Active" : "Inactive",
        })));
      }

      if (lecturersRes.ok) {
        setLecturers(lecturersData.users.map((u: any) => ({
          id: u.id,
          title: u.profile?.title || "",
          fullName: u.profile?.name || "N/A",
          spec: u.profile?.specialization || "N/A",
          email: u.email,
          phone: u.profile?.phone || "N/A",
          status: u.is_activated ? "Active" : "Inactive",
        })));
      }

      if (externalsRes.ok) {
        setExternals(externalsData.users.map((u: any) => ({
          id: u.id,
          title: u.profile?.title || "",
          fullName: u.profile?.name || "N/A",
          spec: u.profile?.specialization || "N/A",
          email: u.email,
          phone: u.profile?.phone || "N/A",
          status: u.is_activated ? "Active" : "Invited",
        })));
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  
  // Replace the existing handleRemoveUser with this:
  const handleRemoveUser = (idToRemove: string, type: string, userName: string) => {
    // Show custom modal instead of browser confirm
    setDeleteConfirm({
      isOpen: true,
      userId: idToRemove,
      userName: userName,
      userType: type,
    });
  };

  // Add this new function to actually perform the deletion
    const performDelete = async () => {
    const { userId, userType } = deleteConfirm;
    
    try {
      const res = await fetch(`/api/coordinator/users?id=${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Remove from local state using userType from deleteConfirm
        if (userType === "Student") {
          setStudents(prev => prev.filter(user => user.id !== userId));
        } else if (userType === "Lecturer") {
          setLecturers(prev => prev.filter(user => user.id !== userId));
        } else if (userType === "External") {
          setExternals(prev => prev.filter(user => user.id !== userId));
        }
      } else {
        const data = await res.json();
        alert(data.error || "Failed to remove user.");
      }
    } catch (error) {
      console.error("Remove user error:", error);
      alert("Failed to remove user.");
    }
  };



  // 4. Live Search Filters
  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.matNo.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredLecturers = lecturers.filter(l => 
    l.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.spec.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPanellists = externalPanellists.filter(p => 
    p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.spec.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Status Badge Styling Helpers
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active": return "bg-[#EEF5F4] text-[#417676]";
      case "Inactive": return "bg-gray-100 text-gray-500";
      case "Invited": return "bg-[#FFF6E6] text-[#D7962B]";
      default: return "bg-gray-100 text-gray-500";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "Active": return "bg-[#417676]";
      case "Inactive": return "bg-gray-400";
      case "Invited": return "bg-[#D7962B]";
      default: return "bg-gray-400";
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white overflow-hidden">
      
      {/* 1. HEADER */}
      <header className="shrink-0 px-8 py-6 border-b border-[var(--color-brand-light)] flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-dark)]">User Directory</h1>
          <p className="text-sm text-gray-400 mt-1">Manage system access, roles, and profiles</p>
        </div>

        <div className="flex items-center gap-4">
          {/* MESSAGES BUTTON */}
          <button 
            type="button"
            onMouseDown={() => router.push("/dashboard/messages")} 
            className="relative p-2 text-gray-500 hover:bg-gray-50 hover:text-[var(--color-brand-dark)] transition-colors rounded-lg"
          >
            <MessageSquare size={22} />
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
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#A32A2A] rounded-full border-2 border-white box-content"></span>
          </button>
        </div>
      </header>

      {/* 2. MAIN BODY */}
      <div className="flex-1 flex flex-col min-h-0 w-[95%] mx-auto pt-6">

        {/* ROUNDED RECTANGLE NAVIGATION CARDS */}
        <div className="shrink-0 grid grid-cols-3 gap-4 mb-6">
          {navCards.map((card) => (
            <button
              key={card}
              onClick={() => {
                setActiveCard(card);
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

        {/* FULL WIDTH SEARCH & ACTION ROW */}
        <div className="shrink-0 mb-6 flex gap-4">
          <div className="relative flex-1 shadow-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder={`Search ${activeCard.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 h-10 bg-white border border-gray-200 rounded-lg text-sm text-[var(--color-brand-dark)] focus:outline-none focus:border-[var(--color-brand-teal)] focus:ring-1 focus:ring-[var(--color-brand-teal)] transition-shadow"
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)} // <-- Changed this
            className="bg-[var(--color-brand-teal)] text-white h-10 px-6 rounded-lg text-sm font-semibold hover:bg-[var(--color-brand-teal)]/90 transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap">
            <Plus size={18} strokeWidth={2.5} />
            Add {activeCard.split(' ')[0]}
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Loading users...</p>
          </div>
        )}

        {/* ========================================= */}
        {/* VIEW 1: STUDENTS                          */}
        {/* ========================================= */}
        {!loading && activeCard === "Students" && (
          <div className="flex-1 min-h-0 flex flex-col pr-3 pb-6">
            <div className="flex-1 border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto">
                <table className="w-full border-collapse relative">
                  <thead className="bg-[#F8F9FA] sticky top-0 z-10 border-b border-gray-200">
                    <tr>
                      <th style={{ textAlign: 'left' }} className="px-6 py-4 text-sm font-bold text-gray-600 w-[20%]">Full Name</th>
                      <th style={{ textAlign: 'left' }} className="px-6 py-4 text-sm font-bold text-gray-600 w-[15%]">Matric No</th>
                      <th style={{ textAlign: 'left' }} className="px-6 py-4 text-sm font-bold text-gray-600 w-[10%]">Level</th>
                      <th style={{ textAlign: 'left' }} className="px-6 py-4 text-sm font-bold text-gray-600 w-[20%]">Email</th>
                      <th style={{ textAlign: 'left' }} className="px-6 py-4 text-sm font-bold text-gray-600 w-[15%]">Phone</th>
                      <th style={{ textAlign: 'left' }} className="px-6 py-4 text-sm font-bold text-gray-600 w-[15%]">Status</th>
                      <th style={{ textAlign: 'right' }} className="px-6 py-4 text-sm font-bold text-gray-600 w-[5%]"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50/50 transition-colors group/row">
                        <td className="px-6 py-4 text-sm font-semibold text-gray-800">{student.fullName}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-500">{student.matNo}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-500">{student.level}</td>
                        <td className="px-6 py-4 text-sm font-medium text-[#417676]">{student.email}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-500">{student.phone}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide ${getStatusBadge(student.status)}`}>
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getStatusDot(student.status)}`}></span>
                            {student.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => setDeleteConfirm({
                              isOpen: true,
                              userId: student.id,
                              userName: student.fullName,
                              userType: "Student"
                            })}
                            className="text-gray-400 hover:text-[#B22A36] hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                            title="Remove Student"
                          >
                            <X size={18} strokeWidth={2.5} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredStudents.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-sm font-medium text-gray-500">
                          No students match your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* VIEW 2: LECTURERS                         */}
        {/* ========================================= */}
        {!loading && activeCard === "Lecturers" && (
          <div className="flex-1 min-h-0 flex flex-col pr-3 pb-6">
            <div className="flex-1 border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto">
                <table className="w-full border-collapse relative">
                  <thead className="bg-[#F8F9FA] sticky top-0 z-10 border-b border-gray-200">
                    <tr>
                      <th style={{ textAlign: 'left' }} className="px-6 py-4 text-sm font-bold text-gray-600 w-[10%]">Title</th>
                      <th style={{ textAlign: 'left' }} className="px-6 py-4 text-sm font-bold text-gray-600 w-[20%]">Full Name</th>
                      <th style={{ textAlign: 'left' }} className="px-6 py-4 text-sm font-bold text-gray-600 w-[20%]">Specialization</th>
                      <th style={{ textAlign: 'left' }} className="px-6 py-4 text-sm font-bold text-gray-600 w-[20%]">Email</th>
                      <th style={{ textAlign: 'left' }} className="px-6 py-4 text-sm font-bold text-gray-600 w-[15%]">Phone</th>
                      <th style={{ textAlign: 'left' }} className="px-6 py-4 text-sm font-bold text-gray-600 w-[10%]">Status</th>
                      <th style={{ textAlign: 'right' }} className="px-6 py-4 text-sm font-bold text-gray-600 w-[5%]"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredLecturers.map((lecturer) => (
                      <tr key={lecturer.id} className="hover:bg-gray-50/50 transition-colors group/row">
                        <td className="px-6 py-4 text-sm font-medium text-gray-500">{lecturer.title}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-800">{lecturer.fullName}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-500">{lecturer.spec}</td>
                        <td className="px-6 py-4 text-sm font-medium text-[#417676]">{lecturer.email}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-500">{lecturer.phone}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide ${getStatusBadge(lecturer.status)}`}>
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getStatusDot(lecturer.status)}`}></span>
                            {lecturer.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setDeleteConfirm({
                            isOpen: true,
                            userId: lecturer.id,
                            userName: lecturer.fullName,
                            userType: "Lecturer"
                          })}
                          className="text-gray-400 hover:text-[#B22A36] hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                          title="Remove Lecturer"
                        >
                          <X size={18} strokeWidth={2.5} />
                        </button>
                        </td>
                      </tr>
                    ))}
                    {filteredLecturers.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-sm font-medium text-gray-500">
                          No lecturers match your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* VIEW 3: EXTERNAL PANELLISTS               */}
        {/* ========================================= */}
        {!loading && activeCard === "External Panellists" && (
          <div className="flex-1 min-h-0 flex flex-col pr-3 pb-6">
            <div className="flex-1 border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto">
                <table className="w-full border-collapse relative">
                  <thead className="bg-[#F8F9FA] sticky top-0 z-10 border-b border-gray-200">
                    <tr>
                      <th style={{ textAlign: 'left' }} className="px-6 py-4 text-sm font-bold text-gray-600 w-[10%]">Title</th>
                      <th style={{ textAlign: 'left' }} className="px-6 py-4 text-sm font-bold text-gray-600 w-[20%]">Full Name</th>
                      <th style={{ textAlign: 'left' }} className="px-6 py-4 text-sm font-bold text-gray-600 w-[20%]">Specialization</th>
                      <th style={{ textAlign: 'left' }} className="px-6 py-4 text-sm font-bold text-gray-600 w-[20%]">Email</th>
                      <th style={{ textAlign: 'left' }} className="px-6 py-4 text-sm font-bold text-gray-600 w-[15%]">Phone</th>
                      <th style={{ textAlign: 'left' }} className="px-6 py-4 text-sm font-bold text-gray-600 w-[10%]">Status</th>
                      <th style={{ textAlign: 'right' }} className="px-6 py-4 text-sm font-bold text-gray-600 w-[5%]"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredPanellists.map((panelist) => (
                      <tr key={panelist.id} className="hover:bg-gray-50/50 transition-colors group/row">
                        <td className="px-6 py-4 text-sm font-medium text-gray-500">{panelist.title}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-800">{panelist.fullName}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-500">{panelist.spec}</td>
                        <td className="px-6 py-4 text-sm font-medium text-[#417676]">{panelist.email}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-500">{panelist.phone}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide ${getStatusBadge(panelist.status)}`}>
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getStatusDot(panelist.status)}`}></span>
                            {panelist.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => setDeleteConfirm({
                              isOpen: true,
                              userId: panelist.id,
                              userName: panelist.fullName,
                              userType: "External"
                            })}
                            className="text-gray-400 hover:text-[#B22A36] hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                            title="Remove External Panellist"
                          >
                            <X size={18} strokeWidth={2.5} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredPanellists.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-sm font-medium text-gray-500">
                          No external panellists match your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 3. DYNAMIC FOOTER */}
      <div className="shrink-0 bg-white border-t border-gray-200 px-8 py-5">
        <div className="w-[95%] mx-auto flex justify-between items-center">
          
          <div className="flex gap-4">
            
            {/* CSV IMPORT WITH DROPDOWN */}
            <div className="relative">
              <button 
                onClick={() => setIsImportDropdownOpen(!isImportDropdownOpen)}
                onBlur={() => setTimeout(() => setIsImportDropdownOpen(false), 200)}
                className="bg-white text-gray-700 border border-gray-300 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2"
              >
                <UploadCloud size={16} />
                Import CSV
                <ChevronUp size={16} className={`text-gray-400 ml-1 transition-transform ${isImportDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isImportDropdownOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-[300px] bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden py-1 z-50">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                    <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Upload Details</p>
                    <p className="text-[11px] text-gray-500 leading-snug">
                      Ensure your CSV file follows the correct header format before uploading.
                      <br/><br/>
                      <span className="font-semibold text-[#417676]">Expected Name Order:</span><br/>
                      Surname, First Name, Other Name
                    </p>
                  </div>
                  <button 
                    onClick={() => { setUploadDefaultRole("student"); setShowUploadModal(true); }}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-[var(--color-brand-teal)] hover:text-white transition-colors"
                  >
                    Upload Students CSV
                  </button>
                  <button 
                    onClick={() => { setUploadDefaultRole("lecturer"); setShowUploadModal(true); }}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-[var(--color-brand-teal)] hover:text-white transition-colors"
                  >
                    Upload Lecturers CSV
                  </button>
                  <button 
                    onClick={() => { setUploadDefaultRole("external_panelist"); setShowUploadModal(true); }}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-[var(--color-brand-teal)] hover:text-white transition-colors"
                  >
                    Upload External Panelists CSV
                  </button>
                </div>
              )}
            </div>

            <button className="bg-[var(--color-brand-slate)] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2">
              <UserPlus size={16} />
              Invite Users
            </button>
          </div>

          <div className="text-sm text-gray-400 flex items-center gap-2 font-medium">
            <CheckCircle2 size={16} className="text-[#417676]" />
            System Directory · Live
          </div>
          
        </div>
      </div>

    

      {/* Add User Modal */}
      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={async (addedRole?: string) => {
          // Switch to the tab matching the added role
          if (addedRole === "student") {
            setActiveCard("Students");
          } else if (addedRole === "lecturer") {
            setActiveCard("Lecturers");
          } else if (addedRole === "external_panelist") {
            setActiveCard("External Panellists");
          }
          // Refetch data
          await refetchUsers();
        }}
        defaultRole={activeCard === "Students" ? "student" : activeCard === "Lecturers" ? "lecturer" : "external_panelist"}
      />


      {/* Upload CSV Modal */}
      <UploadCSVModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={async (importedRole?: string) => {
          // Switch to the tab matching the imported role
          if (importedRole === "student") {
            setActiveCard("Students");
          } else if (importedRole === "lecturer") {
            setActiveCard("Lecturers");
          } else if (importedRole === "external_panelist") {
            setActiveCard("External Panellists");
          }
          // Refetch data instead of reload
          await refetchUsers();
        }}
        defaultRole={uploadDefaultRole}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, userId: "", userName: "", userType: "" })}
        onConfirm={performDelete}
        title="Remove User"
        message={`Are you sure you want to remove ${deleteConfirm.userName}? This action cannot be undone.`}
        confirmText="Remove"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}