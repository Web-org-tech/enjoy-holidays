import { HTMLAttributes } from "react";

type BadgeVariant = "primary" | "secondary" | "accent" | "success" | "warning" | "muted" | "white";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  icon?: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20",
  secondary: "bg-[var(--color-secondary)]/10 text-amber-700 border border-[var(--color-secondary)]/20",
  accent: "bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20",
  success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border border-amber-200",
  muted: "bg-gray-100 text-gray-500 border border-gray-200",
  white: "bg-white/20 text-white border border-white/30 backdrop-blur-sm",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[10px] gap-1 rounded-md",
  md: "px-2.5 py-1 text-xs gap-1.5 rounded-lg",
  lg: "px-3.5 py-1.5 text-sm gap-2 rounded-xl",
};

export default function Badge({
  variant = "primary",
  size = "md",
  dot,
  icon,
  children,
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-semibold tracking-wide ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: "currentColor" }}
        />
      )}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
