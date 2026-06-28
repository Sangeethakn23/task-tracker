import { useState } from "react";

const EMPTY = { title: "", description: "", completed: false };

function TaskForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY);
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
    <div className="form-card">
      <h2>Add New Task</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label htmlFor="title">Task Title</label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Enter task title…"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Optional description…"
            value={form.description}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="checkbox-row">
          <input
            id="completed"
            name="completed"
            type="checkbox"
            checked={form.completed}
            onChange={handleChange}
          />
          <label htmlFor="completed">Mark as completed</label>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !form.title.trim()}
          >
            {loading ? "Adding…" : "＋ Add Task"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
