const STYLES = {
  success: "bg-slate-900/95 border-emerald-500/40 text-emerald-300",
  error:   "bg-slate-900/95 border-red-500/40     text-red-300",
  warning: "bg-slate-900/95 border-amber-500/40   text-amber-300",
  info:    "bg-slate-900/95 border-indigo-500/40  text-indigo-300",
};

const ICONS = { success: "✅", error: "❌", warning: "⚠️", info: "ℹ️" };

function Toast({ toast, onRemove }) {
  return (
    <div
      role="alert"
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-md shadow-2xl text-sm font-medium animate-slide-up ${STYLES[toast.type] ?? STYLES.info}`}
    >
      <span className="text-base shrink-0">{ICONS[toast.type]}</span>
      <span className="flex-1 leading-snug">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        aria-label="Dismiss"
        className="text-current opacity-50 hover:opacity-100 text-lg leading-none transition-opacity shrink-0 ml-1"
      >
        ×
      </button>
    </div>
  );
}

function ToastContainer({ toasts, onRemove }) {
  if (!toasts.length) return null;
  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100vw-3rem)]"
    >
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

export default ToastContainer;
