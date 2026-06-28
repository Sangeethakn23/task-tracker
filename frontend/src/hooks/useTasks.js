import { useState, useCallback } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

/**
 * useTasks — all CRUD logic, loading, error state in one place.
 * Accepts an onSuccess / onError callback pair so the caller
 * (App.jsx) can trigger toasts without knowing about axios.
 */
export function useTasks({ onSuccess, onError }) {
  const [tasks, setTasks]     = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Fetch ──────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    try {
      const res = await axios.get(API);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      onError("Cannot reach the backend. Is the server running?");
    } finally {
      setLoading(false);
    }
  }, [onError]);

  // ── Create ─────────────────────────────────────
  const addTask = async (formData) => {
    try {
      const res = await axios.post(API, formData);
      setTasks((prev) => [res.data, ...prev]);
      onSuccess("Task added successfully! 🎉");
    } catch (err) {
      console.error(err);
      onError("Failed to add task.");
    }
  };

  // ── Update ─────────────────────────────────────
  const updateTask = async (id, formData) => {
    try {
      const res = await axios.put(`${API}/${id}`, formData);
      setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
      onSuccess("Task updated! ✏️");
    } catch (err) {
      console.error(err);
      onError("Failed to update task.");
    }
  };

  // ── Delete ─────────────────────────────────────
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      onSuccess("Task deleted. 🗑");
    } catch (err) {
      console.error(err);
      onError("Failed to delete task.");
    }
  };

  // ── Clear completed ────────────────────────────
  const clearCompleted = async () => {
    const ids = tasks.filter((t) => t.completed).map((t) => t._id);
    try {
      await Promise.all(ids.map((id) => axios.delete(`${API}/${id}`)));
      setTasks((prev) => prev.filter((t) => !t.completed));
      onSuccess(`Cleared ${ids.length} completed task${ids.length > 1 ? "s" : ""}. ✅`);
    } catch (err) {
      console.error(err);
      onError("Failed to clear completed tasks.");
    }
  };

  return { tasks, loading, fetchTasks, addTask, updateTask, deleteTask, clearCompleted };
}
