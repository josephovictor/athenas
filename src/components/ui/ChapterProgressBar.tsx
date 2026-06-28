import { Fragment } from "react";
import { Check } from "lucide-react";

export type ChapterState = "locked" | "active" | "complete";

interface ChapterProgressBarProps {
  states: ChapterState[];
}

export default function ChapterProgressBar({ states }: ChapterProgressBarProps) {
  const steps = Array.from({ length: 5 }, (_, i): ChapterState => states[i] ?? "locked");

  return (
    <div className="flex items-start w-full">
      {steps.map((state, i) => (
        <Fragment key={i}>
          {/* Step node */}
          <div className="flex flex-col items-center shrink-0">
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                state === "complete"
                  ? "bg-green-500 border-green-500 text-white"
                  : state === "active"
                  ? "bg-[var(--color-brand-teal)] border-[var(--color-brand-teal)] text-white"
                  : "bg-gray-50 border-gray-200 text-gray-400"
              }`}
            >
              {state === "complete" ? <Check size={13} strokeWidth={3} /> : i + 1}
            </div>
            <span
              className={`text-[10px] font-semibold mt-1.5 ${
                state === "complete"
                  ? "text-green-600"
                  : state === "active"
                  ? "text-[var(--color-brand-teal)]"
                  : "text-gray-300"
              }`}
            >
              Ch. {i + 1}
            </span>
          </div>

          {/* Connector line */}
          {i < 4 && (
            <div
              className={`flex-1 h-px mt-4 mx-1 ${
                state === "complete" ? "bg-[var(--color-brand-teal)]" : "bg-gray-200"
              }`}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
}
