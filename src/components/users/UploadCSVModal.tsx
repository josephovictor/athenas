"use client";

import { useState, useRef, useEffect } from "react";
import { X, UploadCloud, FileText, AlertCircle, CheckCircle2 } from "lucide-react";

interface UploadCSVModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role?: string) => void; // CHANGE: Add (role?: string) parameter
  defaultRole?: "student" | "lecturer" | "external_panelist";
}

export default function UploadCSVModal({ isOpen, onClose, onSuccess, defaultRole = "student" }: UploadCSVModalProps) {
  const [role, setRole] = useState(defaultRole);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync role with defaultRole prop when modal opens
  useEffect(() => {
    if (isOpen) {
      setRole(defaultRole);
    }
  }, [defaultRole, isOpen]);
  
  const resetForm = () => {
    setFile(null); 
    setError(""); 
    setSuccess("");
    setRole(defaultRole); // Reset to default role when closing
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]); 
      setError(""); 
      setSuccess("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { 
      setError("Please select a CSV file."); 
      return; 
    }

    setLoading(true); 
    setError(""); 
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("role", role);

      const res = await fetch("/api/coordinator/users/csv", { 
        method: "POST", 
        body: formData 
      });
      const data = await res.json();

      if (!res.ok) { 
        setError(data.error || "Failed to upload CSV."); 
        return; 
      }

      setSuccess(data.message || "Users imported successfully.");
      setTimeout(() => { 
        resetForm(); 
        onSuccess(role); 
        onClose(); 
      }, 1500);
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // UPDATED CSV Templates (no password, separate name fields)
  const csvTemplates = {
    student: "email,mat_number,lastname,firstname,othername,phone_number,level",
    lecturer: "email,title,lastname,firstname,othername,area_of_specialization,phone",
    external_panelist: "email,title,lastname,firstname,othername,specialization,phone",
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="shrink-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--color-brand-dark)]">Import CSV</h2>
          <button onClick={() => { resetForm(); onClose(); }} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-start gap-2 font-medium">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" /> {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-[#EEF5F4] border border-[#417676]/20 text-[#417676] text-sm rounded-lg flex items-start gap-2 font-medium">
              <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" /> {success}
            </div>
          )}

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Target Directory</label>
            <div className="grid grid-cols-3 gap-3">
              {["student", "lecturer", "external_panelist"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r as any)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                    role === r
                      ? "border-[var(--color-brand-teal)] bg-[#EEF5F4] text-[var(--color-brand-dark)] shadow-sm"
                      : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span className="font-bold text-xs tracking-wide capitalize">
                    {r === "external_panelist" ? "Panelists" : r + "s"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* File Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              file ? "border-[var(--color-brand-teal)] bg-[#EEF5F4]/30" : "border-gray-300 hover:border-[var(--color-brand-teal)] hover:bg-gray-50"
            }`}
          >
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <FileText size={24} className="text-[#417676]" />
                <div className="text-left">
                  <p className="text-sm font-bold text-[var(--color-brand-dark)]">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
            ) : (
              <div>
                <UploadCloud size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 font-semibold">Click to select CSV file</p>
                <p className="text-xs text-gray-400 mt-1">or drag and drop</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
          </div>

          {/* CSV Template Info */}
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Upload Details</p>
              <p className="text-[11px] text-gray-500 leading-snug">
                Ensure your CSV file follows the correct header format before uploading.
                <br/><br/>
                <span className="font-semibold text-[#417676]">Expected Name Order:</span><br/>
                {role === "student" ? (
                  <>
                    Lastname, Firstname, Othername<br/>
                    <span className="text-gray-400">(e.g., "Doe, John Michael")</span>
                  </>
                ) : (
                  <>
                    Title + Lastname, Firstname, Othername<br/>
                    <span className="text-gray-400">(e.g., "Prof. Doe, John Michael")</span>
                  </>
                )}
              </p>
            </div>
            <div className="p-4 bg-white">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Required Headers:</p>
              <code className="text-[11px] bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 text-[#417676] block overflow-x-auto font-mono">
                {csvTemplates[role as keyof typeof csvTemplates]}
              </code>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="shrink-0 border-t border-gray-200 px-6 py-4 bg-gray-50/50 flex gap-3">
          <button type="button" onClick={() => { resetForm(); onClose(); }} className="flex-1 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors shadow-sm">
            Cancel
          </button>
          <button type="submit" onClick={handleSubmit} disabled={loading || !file} className="flex-1 bg-[var(--color-brand-teal)] text-white py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50 flex items-center justify-center gap-2">
            <UploadCloud size={16} />
            {loading ? "Uploading..." : "Import Users"}
          </button>
        </div>
      </div>
    </div>
  );
}