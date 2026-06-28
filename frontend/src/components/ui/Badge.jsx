const styles = {
  completed: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
  pending:   "bg-amber-500/15   text-amber-400   border border-amber-500/25",
};

function Badge({ variant, children }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[variant] ?? styles.pending}`}>
      {children}
    </span>
  );
}

export default Badge;
