import { forwardRef, ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "whatsapp" | "danger";
type Size = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  as?: "button" | "a";
  href?: string;
  target?: string;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-lg hover:shadow-[var(--shadow-glow-primary)] hover:brightness-110 active:brightness-90",
  secondary:
    "bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-light)] text-white shadow-lg hover:shadow-[var(--shadow-glow-accent)] hover:brightness-110 active:brightness-90",
  outline:
    "bg-transparent border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 active:bg-[var(--color-primary)]/10",
  ghost:
    "bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text-primary)]",
  whatsapp:
    "bg-[#25d366] text-white shadow-lg hover:bg-[#1da853] active:bg-[#178e45]",
  danger:
    "bg-red-500 text-white hover:bg-red-600 active:bg-red-700",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3.5 py-1.5 text-xs gap-1.5 rounded-lg",
  md: "px-5 py-2.5 text-sm gap-2 rounded-xl",
  lg: "px-7 py-3.5 text-base gap-2.5 rounded-xl",
  xl: "px-9 py-4.5 text-lg gap-3 rounded-2xl",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconPosition = "left",
      fullWidth = false,
      children,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = `
      inline-flex items-center justify-center font-semibold 
      transition-all duration-200 
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      select-none
      ${fullWidth ? "w-full" : ""}
    `;

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          iconPosition === "left" && icon && <span className="flex-shrink-0">{icon}</span>
        )}
        {children && <span>{children}</span>}
        {!loading && iconPosition === "right" && icon && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
