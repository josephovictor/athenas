"use client";

import { useState, useEffect } from "react";
import { X, UserPlus } from "lucide-react";

export type DirectoryUserType = "Student" | "Lecturer" | "External" | null;

interface AddDirectoryUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType: DirectoryUserType;
  onSubmit: (userData: any) => void;
}

const initialFormState = {
  title: "Dr.",
  surname: "",
  firstName: "",
  lastName: "",
  matricNo: "",
  level: "400L",
  specialization: "",
  email: "",
  phone: "",
};

export default function AddDirectoryUserModal({ 
  isOpen, 
  onClose, 
  userType, 
  onSubmit 
}: AddDirectoryUserModalProps) {
  
  const [formData, setFormData] = useState(initialFormState);

  // Reset form whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormState);
    }
  }, [isOpen]);

  if (!isOpen || !userType) return null;

  const isStudent = userType === "Student";
  const isStaff = userType === "Lecturer" || userType === "External";

  // Dynamic Header Text
  const getModalTitle = () => {
    if (userType === "Student") return "Add New Student";
    if (userType === "Lecturer") return "Add New Lecturer";
    if (userType === "External") return "Add External Panellist";
    return "Add User";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Stitch the name back together safely without commas
    const constructedFullName = `${formData.surname} ${formData.firstName} ${formData.lastName}`.replace(/\s+/g, ' ').trim();

    // The system automatically assigns "Invited" as the dummy status until the backend verifies them
    const systemAssignedStatus = "Invited";

    // Package the final data based on user type
    const finalData = isStudent 
      ? {
          fullName: constructedFullName,
          matricNo: formData.matricNo,
          level: formData.level,
          email: formData.email,
          phone: formData.phone,
          status: systemAssignedStatus 
        }
      : {
          title: formData.title,
          fullName: constructedFullName,
          specialization: formData.specialization,
          email: formData.email,
          phone: formData.phone,
          status: systemAssignedStatus 
        };

    onSubmit(finalData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      
      {/* === THIS WRAPPER KEEPS EVERYTHING TOGETHER === */}
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-100">
          <h3 className="text-md font-bold text-[var(--color-brand-dark)] flex items-center gap-2">
            <span className="text-[var(--color-brand-teal)]"><UserPlus size={18} /></span>
            {getModalTitle()}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-[#B22A36] hover:bg-red-50 p-2 rounded-lg transition-all">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-6 space-y-5">
            
            {/* LECTURER TITLE */}
            {isStaff && (
              <div className="w-1/3 pr-2">
                <label className="block text-xs font-bold text-gray-500 mb-1">Title</label>
                <select 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange}
                  className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-[var(--color-brand-teal)] focus:bg-white transition-colors"
                >
                  <option value="Mr.">Mr.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Dr.">Dr.</option>
                  <option value="Prof.">Prof.</option>
                </select>
              </div>
            )}

            {/* SPLIT NAME FIELDS */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Surname</label>
                <input 
                  required 
                  type="text" 
                  name="surname" 
                  value={formData.surname} 
                  onChange={handleInputChange}
                  placeholder="e.g. Adeyemi"
                  className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-[var(--color-brand-teal)] focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">First Name</label>
                <input 
                  required 
                  type="text" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleInputChange}
                  placeholder="e.g. Chisom"
                  className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-[var(--color-brand-teal)] focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Last/Other Name</label>
                <input 
                  type="text" 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleInputChange}
                  placeholder="Optional"
                  className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-[var(--color-brand-teal)] focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* ROLE SPECIFIC FIELDS */}
            {isStaff ? (
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Area of Specialization</label>
                <input 
                  required 
                  type="text" 
                  name="specialization" 
                  value={formData.specialization} 
                  onChange={handleInputChange}
                  placeholder="e.g. Computer Science"
                  className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-[var(--color-brand-teal)] focus:bg-white transition-colors"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Matric Number</label>
                  <input 
                    required 
                    type="text" 
                    name="matricNo" 
                    value={formData.matricNo} 
                    onChange={handleInputChange}
                    placeholder="e.g. 2023/001"
                    className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-[var(--color-brand-teal)] focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Level</label>
                  <select 
                    name="level" 
                    value={formData.level} 
                    onChange={handleInputChange}
                    className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-[var(--color-brand-teal)] focus:bg-white transition-colors"
                  >
                    <option value="100L">100L</option>
                    <option value="200L">200L</option>
                    <option value="300L">300L</option>
                    <option value="400L">400L</option>
                    <option value="500L">500L</option>
                  </select>
                </div>
              </div>
            )}

            {/* UNIVERSAL FIELDS */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Email Address</label>
                <input 
                  required 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange}
                  placeholder="name@institution.edu.ng"
                  className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-[var(--color-brand-teal)] focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Phone Number</label>
                <input 
                  required 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange}
                  placeholder="08012345678"
                  className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-[var(--color-brand-teal)] focus:bg-white transition-colors"
                />
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 shrink-0">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 text-sm font-semibold text-white bg-[var(--color-brand-teal)] rounded-lg hover:opacity-95 transition-opacity shadow-sm"
            >
              Add to Directory
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}