const variants = {
  primary:   "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40",
  success:   "bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40",
  danger:    "bg-red-500/15 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 hover:border-red-500",
  ghost:     "bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white border border-indigo-500/20 hover:border-indigo-500",
  warning:   "bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-white border border-amber-500/30",
  clear:     "bg-transparent hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/50",
  secondary: "bg-slate-700/60 hover:bg-slate-600 text-slate-300 border border-slate-600",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-6 py-3 text-base gap-2",
};

function Button({
  children,
  variant  = "primary",
  size     = "md",
  disabled = false,
  onClick,
  type     = "button",
  ariaLabel,
  className = "",
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={[
        "inline-flex items-center justify-center font-semibold rounded-xl",
        "transition-all duration-200 cursor-pointer whitespace-nowrap",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
        "hover:-translate-y-0.5 active:translate-y-0",
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default Button;
