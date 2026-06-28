function EmptyState({ icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500">
      <span className="text-5xl opacity-50">{icon}</span>
      <p className="text-sm text-center max-w-xs">{message}</p>
    </div>
  );
}

export default EmptyState;
