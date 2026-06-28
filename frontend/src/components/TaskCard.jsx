import { useState } from "react";

function TaskCard({ task, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: task.title,
    description: task.description || "",
    completed: task.completed,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    await onUpdate(task._id, form);
    setSaving(false);
    setEditing(false);
  };

  const handleCancel = () => {
    setForm({
      title: task.title,
      description: task.description || "",
      completed: task.completed,
    });
    setEditing(false);
  };

  const handleToggle = async () => {
    await onUpdate(task._id, { ...form, completed: !task.completed });
    setForm((prev) => ({ ...prev, completed: !prev.completed }));
  };

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(task._id);
  };

  const createdAt = task.createdAt
    ? new Date(task.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  if (editing) {
    return (
      <div className={`task-card ${task.completed ? "completed" : "pending"}`}>
        <div className="edit-form">
          <div className="form-group">
            <label htmlFor={`edit-title-${task._id}`}>Title</label>
            <input
              id={`edit-title-${task._id}`}
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor={`edit-desc-${task._id}`}>Description</label>
            <textarea
              id={`edit-desc-${task._id}`}
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={2}
            />
          </div>

          <div className="checkbox-row">
            <input
              id={`edit-done-${task._id}`}
              name="completed"
              type="checkbox"
              checked={form.completed}
              onChange={handleChange}
            />
            <label htmlFor={`edit-done-${task._id}`}>Mark as completed</label>
          </div>

          <div className="edit-actions">
            <button
              className="btn btn-success btn-sm"
              onClick={handleSave}
              disabled={saving || !form.title.trim()}
            >
              {saving ? "Saving…" : "✓ Save"}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`task-card ${task.completed ? "completed" : "pending"}`}>
      <div className="task-card-top">
        <h3 className="task-title">{task.title}</h3>
        <div className="task-actions">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setEditing(true)}
            aria-label="Edit task"
          >
            ✏️ Edit
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={handleDelete}
            disabled={deleting}
            aria-label="Delete task"
          >
            {deleting ? "…" : "🗑 Delete"}
          </button>
        </div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        <div className="task-badges">
          <span
            className={`badge ${task.completed ? "badge-completed" : "badge-pending"}`}
          >
            {task.completed ? "✅ Completed" : "⏳ Pending"}
          </span>
          {createdAt && <span className="task-date">📅 {createdAt}</span>}
        </div>

        <button
          className={`btn btn-sm ${task.completed ? "btn-ghost" : "btn-success"}`}
          onClick={handleToggle}
          aria-label="Toggle completion status"
        >
          {task.completed ? "↩ Mark Pending" : "✓ Mark Done"}
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
