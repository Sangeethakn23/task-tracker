import { useState } from "react";
import Button from "./ui/Button";

const EMPTY = { title: "", description: "", completed: false };

function TaskForm({ onAdd }) {
  const [form,    setForm]    = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    await onAdd(form);
    setForm(EMPTY);
    setLoading(false);
  };

  return (
    <div className="bg-slate-900/70 backdrop-blur-lg border border-slate-700/60 rounded-2xl p-6 mb-8 shadow-2xl">
      {/* Card heading */}
      <div className="flex items-center gap-3 mb-6">
        <span className="w-1 h-6 bg-indigo-500 rounded-full block" />
        <h2 className="text-base font-semibold text-slate-100">Add New Task</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Task Title <span className="text-red-400">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="What needs to be done?"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full bg-slate-900/70 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500
                       focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Add extra details (optional)…"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full bg-slate-900/70 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 resize-y min-h-[80px]
                       focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
          />
        </div>

        {/* Checkbox + Submit row */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              id="form-completed"
              name="completed"
              type="checkbox"
              checked={form.completed}
              onChange={handleChange}
              className="w-4 h-4 rounded accent-indigo-500 cursor-pointer"
            />
            <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">
              Mark as completed
            </span>
          </label>

          <Button
            type="submit"
            variant="primary"
            disabled={loading || !form.title.trim()}
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Adding…
              </>
            ) : (
              <>＋ Add Task</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
