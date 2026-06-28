"use client";

import { useRef } from "react";
import { X, Paperclip, Link as LinkIcon, Plus } from "lucide-react";

export type FileSlot = {
  id: string;
  type: "file" | "url";
  file?: File;
  url?: string;
};

interface FileSubmissionSlotProps {
  slots: FileSlot[];
  onChange: (slots: FileSlot[]) => void;
  acceptUrls?: boolean;
  disabled?: boolean;
}

export default function FileSubmissionSlot({
  slots,
  onChange,
  acceptUrls = false,
  disabled = false,
}: FileSubmissionSlotProps) {
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const addSlot = () => {
    const id = crypto.randomUUID();
    onChange([...slots, { id, type: "file" }]);
  };

  const removeSlot = (id: string) => onChange(slots.filter((s) => s.id !== id));

  const toggleType = (id: string) =>
    onChange(
      slots.map((s) =>
        s.id === id
          ? { id: s.id, type: s.type === "file" ? "url" : "file" }
          : s
      )
    );

  const setFile = (id: string, file: File | undefined) =>
    onChange(slots.map((s) => (s.id === id ? { ...s, file } : s)));

  const setUrl = (id: string, url: string) =>
    onChange(slots.map((s) => (s.id === id ? { ...s, url } : s)));

  return (
    <div className="space-y-2">
      {slots.map((slot) => (
        <div
          key={slot.id}
          className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3"
        >
          {slot.type === "file" ? (
            <>
              <Paperclip size={15} className="text-gray-300 shrink-0" />
              <button
                type="button"
                disabled={disabled}
                onClick={() => fileRefs.current[slot.id]?.click()}
                className="flex-1 text-left text-sm truncate text-gray-400 hover:text-[var(--color-brand-dark)] transition-colors"
              >
                {slot.file ? slot.file.name : "Click to choose a file"}
              </button>
              <input
                ref={(el) => {
                  fileRefs.current[slot.id] = el;
                }}
                type="file"
                className="hidden"
                disabled={disabled}
                onChange={(e) => setFile(slot.id, e.target.files?.[0])}
              />
            </>
          ) : (
            <>
              <LinkIcon size={15} className="text-gray-300 shrink-0" />
              <input
                type="url"
                placeholder="Paste a link..."
                disabled={disabled}
                value={slot.url ?? ""}
                onChange={(e) => setUrl(slot.id, e.target.value)}
                className="flex-1 text-sm text-[var(--color-brand-dark)] outline-none placeholder:text-gray-300 bg-transparent"
              />
            </>
          )}

          {acceptUrls && !disabled && (
            <button
              type="button"
              onClick={() => toggleType(slot.id)}
              className="text-xs text-gray-400 hover:text-[var(--color-brand-teal)] font-semibold transition-colors shrink-0"
            >
              {slot.type === "file" ? "Use URL" : "Use file"}
            </button>
          )}

          {!disabled && (
            <button
              type="button"
              onClick={() => removeSlot(slot.id)}
              className="shrink-0 text-gray-300 hover:text-[var(--color-brand-danger)] transition-colors"
            >
              <X size={15} />
            </button>
          )}
        </div>
      ))}

      {!disabled && (
        <button
          type="button"
          onClick={addSlot}
          className="flex items-center gap-2 text-sm font-semibold text-[var(--color-brand-teal)] hover:text-[var(--color-brand-slate)] transition-colors mt-1"
        >
          <Plus size={15} />
          Add File
        </button>
      )}
    </div>
  );
}
