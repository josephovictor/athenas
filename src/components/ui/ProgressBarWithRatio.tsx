interface ProgressBarWithRatioProps {
  submitted: number;
  total: number;
}

export default function ProgressBarWithRatio({ submitted, total }: ProgressBarWithRatioProps) {
  const isComplete = total > 0 && submitted >= total;
  const pct = total > 0 ? Math.min((submitted / total) * 100, 100) : 0;

  if (isComplete) {
    return (
      <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-lg border-2 border-green-500 text-green-600 text-sm font-bold">
        Complete
      </span>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-[var(--color-brand-teal)] rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-gray-500 shrink-0 tabular-nums">
        {submitted}/{total}
      </span>
    </div>
  );
}
