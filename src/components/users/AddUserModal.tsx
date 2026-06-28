"use client";

import { useState, useEffect } from "react";
import { X, Mail, Phone, User, GraduationCap, BookOpen, Shield, CheckCircle } from "lucide-react";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role?: string) => void;
  defaultRole?: "student" | "lecturer" | "external_panelist";
}

export default function AddUserModal({ isOpen, onClose, onSuccess, defaultRole = "student" }: AddUserModalProps) {
  const [role, setRole] = useState(defaultRole);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Student fields
  const [matNumber, setMatNumber] = useState("");
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [othername, setOthername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [level, setLevel] = useState("");

  // Lecturer/Panelist fields
  const [title, setTitle] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [phone, setPhone] = useState("");

  // Sync role with defaultRole prop when modal opens
  useEffect(() => {
    if (isOpen) {
      setRole(defaultRole);
    }
  }, [defaultRole, isOpen]);

  const resetForm = () => {
    setEmail(""); 
    setMatNumber(""); 
    setLastname("");
    setFirstname(""); 
    setOthername(""); 
    setPhoneNumber(""); 
    setLevel("");
    setTitle(""); 
    setSpecialization(""); 
    setPhone(""); 
    setError("");
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      let profile;
      if (role === "student") {
        profile = { 
          mat_number: matNumber, 
          lastname, 
          firstname, 
          othername: othername || null, 
          phone_number: phoneNumber, 
          level 
        };
      } else if (role === "lecturer") {
        profile = { 
          title, 
          lastname, 
          firstname, 
          othername: othername || null,
          area_of_specialization: specialization, 
          phone 
        };
      } else {
        profile = { 
          title, 
          lastname, 
          firstname, 
          othername: othername || null,
          specialization, 
          phone 
        };
      }

      const res = await fetch("/api/coordinator/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, email, profile }), 
      });

      const data = await res.json();
      if (!res.ok) { 
        setError(data.error || "Failed to create user."); 
        setLoading(false);
        return; 
      }

      setSuccess(true);
      setTimeout(() => {
        resetForm();
        onSuccess(role);
        onClose();
      }, 2000);

    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputClass = "w-full pl-10 pr-4 h-10 bg-white border border-gray-200 rounded-lg text-sm text-[var(--color-brand-dark)] focus:outline-none focus:border-[var(--color-brand-teal)] focus:ring-1 focus:ring-[var(--color-brand-teal)] transition-shadow";
  const labelClass = "block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="shrink-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--color-brand-dark)]">Add New User</h2>
          <button onClick={() => { resetForm(); onClose(); }} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg font-medium">
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg font-medium flex items-center gap-2">
              <CheckCircle size={18} />
              User created successfully! Invitation email has been sent.
            </div>
          )}

          {/* Role Selection */}
          <div>
            <label className={labelClass}>Select Role</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: "student", label: "Student", icon: GraduationCap },
                { val: "lecturer", label: "Lecturer", icon: BookOpen },
                { val: "external_panelist", label: "Panelist", icon: Shield }
              ].map((r) => (
                <button
                  key={r.val}
                  type="button"
                  onClick={() => setRole(r.val as any)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                    role === r.val
                      ? "border-[var(--color-brand-teal)] bg-[#EEF5F4] text-[var(--color-brand-dark)] shadow-sm"
                      : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <r.icon size={20} className={role === r.val ? "text-[#417676]" : "text-gray-400"} strokeWidth={2.5} />
                  <span className="font-bold text-xs tracking-wide mt-1">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Common Fields */}
          <div className="grid grid-cols-1 gap-4"> 
            <div>
              <label className={labelClass}>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@athenas.com" className={inputClass} />
              </div>
            </div>
          </div>

          {/* Role-Specific Fields */}
          <div className="pt-4 border-t border-gray-100 space-y-4">
            <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              {role === "student" ? "Student Details" : role === "lecturer" ? "Lecturer Details" : "Panelist Details"}
            </h3>
            
            {role === "student" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Matric Number</label>
                  <input type="text" required value={matNumber} onChange={(e) => setMatNumber(e.target.value)} placeholder="e.g. 2020/1234" className={inputClass.replace("pl-10", "pl-4")} />
                </div>
                <div>
                  <label className={labelClass}>Level</label>
                  <input type="text" required value={level} onChange={(e) => setLevel(e.target.value)} placeholder="e.g. 400L" className={inputClass.replace("pl-10", "pl-4")} />
                </div>
                <div>
                  <label className={labelClass}>Last Name</label>
                  <input type="text" required value={lastname} onChange={(e) => setLastname(e.target.value)} placeholder="Doe" className={inputClass.replace("pl-10", "pl-4")} />
                </div>
                <div>
                  <label className={labelClass}>First Name</label>
                  <input type="text" required value={firstname} onChange={(e) => setFirstname(e.target.value)} placeholder="John" className={inputClass.replace("pl-10", "pl-4")} />
                </div>
                <div>
                  <label className={labelClass}>Other Name <span className="text-gray-400 normal-case font-normal">(Optional)</span></label>
                  <input type="text" value={othername} onChange={(e) => setOthername(e.target.value)} placeholder="Michael" className={inputClass.replace("pl-10", "pl-4")} />
                </div>
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="tel" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+234..." className={inputClass} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Title</label>
                  <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Dr., Prof." className={inputClass.replace("pl-10", "pl-4")} />
                </div>
                <div>
                  <label className={labelClass}>Specialization</label>
                  <input type="text" required value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="Computer Science" className={inputClass.replace("pl-10", "pl-4")} />
                </div>
                <div>
                  <label className={labelClass}>Last Name</label>
                  <input type="text" required value={lastname} onChange={(e) => setLastname(e.target.value)} placeholder="Doe" className={inputClass.replace("pl-10", "pl-4")} />
                </div>
                <div>
                  <label className={labelClass}>First Name</label>
                  <input type="text" required value={firstname} onChange={(e) => setFirstname(e.target.value)} placeholder="John" className={inputClass.replace("pl-10", "pl-4")} />
                </div>
                <div>
                  <label className={labelClass}>Other Name <span className="text-gray-400 normal-case font-normal">(Optional)</span></label>
                  <input type="text" value={othername} onChange={(e) => setOthername(e.target.value)} placeholder="Michael" className={inputClass.replace("pl-10", "pl-4")} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234..." className={inputClass} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Footer Actions */}
        <div className="shrink-0 border-t border-gray-200 px-6 py-4 bg-gray-50/50 flex gap-3">
          <button type="button" onClick={() => { resetForm(); onClose(); }} className="flex-1 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors shadow-sm">
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading || success} 
            onClick={handleSubmit} 
            className="flex-1 bg-[var(--color-brand-teal)] text-white py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50"
          >
            {loading ? "Creating & Sending..." : success ? "Invite Sent!" : "Create & Invite User"}
          </button>
        </div>
      </div>
    </div>
  );
}