import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./App.css";
import TaskForm from "./components/TaskForm";
import TaskCard from "./components/TaskCard";

const API = "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");
  const [filter, setFilter] = useState("all"); // all | pending | completed

  // ── Fetch ────────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    try {
      setError("");
      const res = await axios.get(API);
      setTasks(
        [...res.data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      );
    } catch (err) {
      console.error(err);
      setError("Cannot reach backend on port 5000. Is the server running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // ── Create ───────────────────────────────────────
  const handleAdd = async (formData) => {
    try {
      setError("");
      const res = await axios.post(API, formData);
      setTasks((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error(err);
      setError("Failed to add task.");
    }
  };

  // ── Update ───────────────────────────────────────
  const handleUpdate = async (id, formData) => {
    try {
      setError("");
      const res = await axios.put(`${API}/${id}`, formData);
      setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error(err);
      setError("Failed to update task.");
    }
  };

  // ── Delete ───────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      setError("");
      await axios.delete(`${API}/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete task.");
    }
  };

  // ── Clear completed ──────────────────────────────
  const handleClearCompleted = async () => {
    const completedTasks = tasks.filter((t) => t.completed);
    try {
      setError("");
      await Promise.all(completedTasks.map((t) => axios.delete(`${API}/${t._id}`)));
      setTasks((prev) => prev.filter((t) => !t.completed));
    } catch (err) {
      console.error(err);
      setError("Failed to clear completed tasks.");
    }
  };

  // ── Stats & filter ───────────────────────────────
  const total     = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending   = total - completed;

  const visibleTasks =
    filter === "completed" ? tasks.filter((t) => t.completed)  :
    filter === "pending"   ? tasks.filter((t) => !t.completed) :
    tasks;

  return (
    <div className="app">

      {/* ── Header ── */}
      <header className="header">
        <div className="header-icon">📋</div>
        <h1>Task <span>Tracker</span></h1>
        <p>Stay organised — manage your tasks in one place.</p>
      </header>

      {/* ── Error ── */}
      {error && (
        <div className="error-banner" role="alert">
          ⚠️ {error}
        </div>
      )}

      {/* ── Add Task Form ── */}
      <TaskForm onAdd={handleAdd} />

      {/* ── Stats bar ── */}
      {!loading && total > 0 && (
        <div className="stats-bar">
          <button
            className={`stat-pill ${filter === "all" ? "stat-active" : ""}`}
            onClick={() => setFilter("all")}
          >
            <span className="dot dot-total" /> {total} Total
          </button>
          <button
            className={`stat-pill ${filter === "completed" ? "stat-active" : ""}`}
            onClick={() => setFilter("completed")}
          >
            <span className="dot dot-done" /> {completed} Completed
          </button>
          <button
            className={`stat-pill ${filter === "pending" ? "stat-active" : ""}`}
            onClick={() => setFilter("pending")}
          >
            <span className="dot dot-pending" /> {pending} Pending
          </button>
        </div>
      )}

      {/* ── Section heading ── */}
      {!loading && (
        <div className="section-heading">
          <h2>
            {filter === "all"       ? "All Tasks"        :
             filter === "completed" ? "Completed Tasks"  :
             "Pending Tasks"}
            {visibleTasks.length > 0 && (
              <span className="task-count">{visibleTasks.length}</span>
            )}
          </h2>
          {completed > 0 && filter !== "pending" && (
            <button className="btn btn-clear" onClick={handleClearCompleted}>
              🗑 Clear Completed
            </button>
          )}
        </div>
      )}

      {/* ── Task list ── */}
      {loading ? (
        <div className="loading-wrap">
          <div className="spinner" />
          <span>Loading tasks…</span>
        </div>
      ) : visibleTasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            {filter === "completed" ? "✅" : filter === "pending" ? "⏳" : "📭"}
          </div>
          <p>
            {filter === "completed" ? "No completed tasks yet."  :
             filter === "pending"   ? "No pending tasks. Great work!" :
             "No tasks yet. Add one above to get started!"}
          </p>
        </div>
      ) : (
        <ul className="task-list">
          {visibleTasks.map((task) => (
            <li key={task._id}>
              <TaskCard
                task={task}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
