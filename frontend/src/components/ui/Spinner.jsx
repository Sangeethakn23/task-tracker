function Spinner({ message = "Loading…" }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
      <div
        className="w-10 h-10 rounded-full border-[3px] border-slate-700 border-t-indigo-500 animate-spin"
        role="status"
        aria-label="Loading"
      />
      {message && <span className="text-sm">{message}</span>}
    </div>
  );
}

export default Spinner;
