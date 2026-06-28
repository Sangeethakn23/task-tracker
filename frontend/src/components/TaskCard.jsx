import { useState } from "react";
import Button from "./ui/Button";
import Badge  from "./ui/Badge";

function TaskCard({ task, onDelete, onUpdate }) {
  const [editing,  setEditing]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    title:       task.title,
    description: task.description || "",
    completed:   task.completed,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    await onUpdate(task._id, form);
    setSaving(false);
    setEditing(false);
  };

  const handleCancel = () => {
    setForm({ title: task.title, description: task.description || "", completed: task.completed });
    setEditing(false);
  };

  const handleToggle = () =>
    onUpdate(task._id, { title: task.title, description: task.description, completed: !task.completed });

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(task._id);
  };

  const createdAt = task.createdAt
    ? new Date(task.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all";

  const borderColor = task.completed ? "border-l-emerald-400" : "border-l-indigo-500";

  /* ── Edit mode ── */
  if (editing) {
    return (
      <div className={`bg-white rounded-2xl p-5 shadow-lg border-l-4 ${borderColor} animate-fade-in`}>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">Title</label>
            <input name="title" value={form.title} onChange={handleChange} className={inputCls} required />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={2}
              className={`${inputCls} resize-y min-h-[64px]`} />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input name="completed" type="checkbox" checked={form.completed} onChange={handleChange}
              className="w-4 h-4 rounded accent-indigo-500 cursor-pointer" />
            <span className="text-sm text-slate-500">Mark as completed</span>
          </label>

          <div className="flex gap-2 pt-1">
            <Button variant="success" size="sm" onClick={handleSave} disabled={saving || !form.title.trim()}>
              {saving ? "Saving…" : "✓ Save"}
            </Button>
            <Button variant="secondary" size="sm" onClick={handleCancel}>Cancel</Button>
          </div>
        </div>
      </div>
    );
  }

  /* ── View mode ── */
  return (
    <div className={`bg-white rounded-2xl p-5 shadow-md hover:shadow-xl border-l-4 ${borderColor} transition-all duration-200 hover:-translate-y-0.5 animate-fade-in`}>
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className={`text-sm font-semibold leading-snug flex-1 ${task.completed ? "line-through text-slate-400" : "text-slate-800"}`}>
          {task.title}
        </h3>
        <div className="flex gap-1.5 shrink-0">
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)} ariaLabel="Edit task">
            ✏️ Edit
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete} disabled={deleting} ariaLabel="Delete task">
            {deleting ? "…" : "🗑"}
          </Button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className={`text-xs leading-relaxed mb-3 ${task.completed ? "text-slate-400 line-through" : "text-slate-500"}`}>
          {task.description}
        </p>
      )}

      {/* Meta row */}
      <div className="flex items-center justify-between flex-wrap gap-2 mt-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={task.completed ? "completed" : "pending"}>
            {task.completed ? "✅ Completed" : "⏳ Pending"}
          </Badge>
          {createdAt && (
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              📅 {createdAt}
            </span>
          )}
        </div>
        <Button
          variant={task.completed ? "warning" : "success"}
          size="sm"
          onClick={handleToggle}
          ariaLabel="Toggle completion"
        >
          {task.completed ? "↩ Undo" : "✓ Done"}
        </Button>
      </div>
    </div>
  );
}

export default TaskCard;
