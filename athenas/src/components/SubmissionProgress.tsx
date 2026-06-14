export default function SubmissionProgress({
  groupName,
  submitted,
  total,
}: {
  groupName: string;
  submitted: number;
  total: number;
}) {
  const isComplete = submitted === total;
  const progressPercentage = Math.round((submitted / total) * 100);

  return (
    <div className="bg-white p-6 rounded-xl border border-[var(--color-brand-light)] mb-4 shadow-sm w-full">
      <div className="flex justify-between items-end mb-3">
        <h3 className="text-[var(--color-brand-dark)] font-semibold text-sm">
          Submissions per group — {groupName}
        </h3>
        <span className="text-[var(--color-brand-teal)] font-bold text-sm">
          {submitted} / {total}
        </span>
      </div>

      <div className="h-2.5 w-full bg-[#E5E7EB] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--color-brand-teal)] transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {isComplete && (
        <div className="mt-4">
          <span className="inline-flex items-center px-3 py-1 rounded border border-green-500 text-green-600 bg-white text-[10px] font-bold uppercase tracking-wider">
            Complete
          </span>
        </div>
      )}
    </div>
  );
}