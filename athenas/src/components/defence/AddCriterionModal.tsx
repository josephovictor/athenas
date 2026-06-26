"use client";

import { useState, useEffect } from "react";
import { X, Target, Plus, ShieldAlert } from "lucide-react";

interface AddCriterionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (criterion: { label: string; maxScore: number }) => void;
  context: "Project" | "Seminar" | "";
  currentTotal: number;
}

export default function AddCriterionModal({ 
  isOpen, 
  onClose, 
  onAdd, 
  context,
  currentTotal
}: AddCriterionModalProps) {
  
  const [criterionLabel, setCriterionLabel] = useState("");
  const [maxScore, setMaxScore] = useState<string>("");

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setCriterionLabel("");
      setMaxScore("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAdd = () => {
    const scoreNum = parseInt(maxScore, 10);
    if (criterionLabel.trim() && !isNaN(scoreNum) && scoreNum > 0) {
      onAdd({
        label: criterionLabel.trim(),
        maxScore: scoreNum
      });
      onClose();
    }
  };

  const projectedTotal = currentTotal + (parseInt(maxScore, 10) || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-100">
          <div>
            <h3 className="text-md font-bold text-[var(--color-brand-dark)] flex items-center gap-2">
              <Target size={18} className="text-[var(--color-brand-teal)]" />
              Add {context} Criterion
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Define a new scoring metric for the rubric.</p>
          </div>
          <button 
            onClick={onClose}
            className="inline-flex items-center justify-center text-gray-400 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors relative z-10"
            title="Close Modal"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Label Input */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Criterion Title</label>
            <input 
              type="text"
              placeholder="e.g., Code Quality, Research Depth..."
              value={criterionLabel}
              onChange={(e) => setCriterionLabel(e.target.value)}
              className="w-full h-11 bg-white border border-gray-200 rounded-lg px-4 text-sm focus:outline-none focus:border-[var(--color-brand-teal)] focus:ring-1 focus:ring-[var(--color-brand-teal)] text-[var(--color-brand-dark)] transition-shadow"
            />
          </div>

          {/* Score Input */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Maximum Obtainable Score</label>
            <input 
              type="number"
              placeholder="e.g., 20"
              min="1"
              max="100"
              value={maxScore}
              onChange={(e) => setMaxScore(e.target.value)}
              className="w-full h-11 bg-white border border-gray-200 rounded-lg px-4 text-sm focus:outline-none focus:border-[var(--color-brand-teal)] focus:ring-1 focus:ring-[var(--color-brand-teal)] text-[var(--color-brand-dark)] transition-shadow"
            />
          </div>

          {/* Contextual Warning / Helper */}
          <div className="bg-[#EEF5F4] border border-[#C5E1E1] rounded-lg p-4 flex items-start gap-3">
            <ShieldAlert size={16} className="text-[var(--color-brand-teal)] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-[var(--color-brand-dark)]">Score Projection</p>
              <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                Adding this criterion will update the total maximum score for this rubric from <strong>{currentTotal}</strong> to <strong>{projectedTotal}</strong>.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 shrink-0">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleAdd}
            disabled={!criterionLabel.trim() || !maxScore || parseInt(maxScore) <= 0}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-[var(--color-brand-teal)] rounded-lg hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-2"
          >
            <Plus size={16} strokeWidth={3} />
            Append Criterion
          </button>
        </div>

      </div>
    </div>
  );
}