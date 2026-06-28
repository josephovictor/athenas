"use client";

import { useState, useEffect } from "react";
import { X, Search, Check } from "lucide-react";

// Standardized format for anyone passed into this modal
export interface AssignOption {
  id: string;
  name: string;
  subtitle?: string;
}

interface AssignMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  searchPlaceholder: string;
  options: AssignOption[];
  onAssign: (selectedOption: AssignOption) => void;
}

export default function AssignMemberModal({ 
  isOpen, 
  onClose, 
  title, 
  searchPlaceholder, 
  options, 
  onAssign 
}: AssignMemberModalProps) {
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSelectedId(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredData = options.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (item.subtitle && item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSubmit = () => {
    const selectedItem = options.find(item => item.id === selectedId);
    if (selectedItem) onAssign(selectedItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-100 shrink-0">
          <h3 className="text-md font-bold text-[var(--color-brand-dark)] flex items-center gap-2">
            {title}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Search & List */}
        <div className="flex flex-col h-[400px]">
          <div className="p-4 border-b border-gray-100 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 h-10 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[var(--color-brand-teal)] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 custom-scrollbar bg-gray-50/50">
            {filteredData.length > 0 ? (
              <div className="space-y-1">
                {filteredData.map((item) => {
                  const isSelected = selectedId === item.id;
                  return (
                    <div 
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all border ${
                        isSelected ? "bg-[#EEF5F4] border-[var(--color-brand-teal)] shadow-sm" : "bg-white border-transparent hover:border-gray-200 hover:shadow-sm"
                      }`}
                    >
                      <div>
                        <p className={`text-sm font-bold ${isSelected ? "text-[var(--color-brand-teal)]" : "text-gray-800"}`}>{item.name}</p>
                        {item.subtitle && <p className={`text-xs mt-0.5 ${isSelected ? "text-[#417676]/70" : "text-gray-400"}`}>{item.subtitle}</p>}
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected ? "bg-[var(--color-brand-teal)] border-[var(--color-brand-teal)] text-white" : "border-gray-300 text-transparent"
                      }`}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <p className="text-sm font-semibold text-gray-600">No results found</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-gray-100 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-6 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={!selectedId} className="px-6 py-2.5 text-sm font-semibold text-white bg-[var(--color-brand-teal)] rounded-lg hover:opacity-95 disabled:opacity-40 transition-all shadow-sm">Confirm</button>
        </div>

      </div>
    </div>
  );
}