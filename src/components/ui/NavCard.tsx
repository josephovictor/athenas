"use client";

import Link from "next/link";

interface NavCardProps {
  label: string;
  href?: string;
  onClick?: () => void;
  description?: string;
  icon?: React.ElementType;
  disabled?: boolean;
  disabledMessage?: string;
  size?: "md" | "lg";
  className?: string;
}

export default function NavCard({
  label,
  href,
  onClick,
  description,
  icon: Icon,
  disabled = false,
  disabledMessage,
  size = "md",
  className = "",
}: NavCardProps) {
  const base = [
    "flex flex-col items-center justify-center text-center rounded-xl border bg-white transition-all",
    size === "lg" ? "min-h-36 p-8" : "min-h-20 p-6",
    disabled
      ? "opacity-60 cursor-not-allowed border-gray-100"
      : "border-gray-200 hover:border-[var(--color-brand-teal)] hover:shadow-md cursor-pointer",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {Icon && (
        <Icon
          size={size === "lg" ? 28 : 20}
          strokeWidth={1.8}
          className={`mb-3 ${disabled ? "text-gray-300" : "text-[var(--color-brand-teal)]"}`}
        />
      )}
      <span
        className={`font-bold text-[var(--color-brand-dark)] ${size === "lg" ? "text-xl" : "text-sm"}`}
      >
        {label}
      </span>
      {disabled && disabledMessage && (
        <p className="text-xs text-gray-400 mt-1.5 font-normal">{disabledMessage}</p>
      )}
      {!disabled && description && (
        <p className="text-xs text-gray-400 mt-1.5 font-normal">{description}</p>
      )}
    </>
  );

  if (disabled) return <div className={base}>{content}</div>;
  if (href) return <Link href={href} className={base}>{content}</Link>;
  return (
    <button type="button" onClick={onClick} className={base}>
      {content}
    </button>
  );
}
