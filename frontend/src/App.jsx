import { useEffect, useState, useMemo } from "react";
import "./App.css";

import { useToast } from "./hooks/useToast";
import { useTasks } from "./hooks/useTasks";

import TaskForm       from "./components/TaskForm";
import TaskCard       from "./components/TaskCard";
import SearchSortBar  from "./components/SearchSortBar";
import ToastContainer from "./components/ToastContainer";
import Spinner        from "./components/ui/Spinner";
import EmptyState     from "./components/ui/EmptyState";
import Button         from "./components/ui/Button";

// ── Sort helper ────────────────────────────────────────
function applySort(list, sort) {
  const arr = [...list];
  switch (sort) {
    case "oldest":    return arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case "az":        return arr.sort((a, b) => a.title.localeCompare(b.title));
    case "za":        return arr.sort((a, b) => b.title.localeCompare(a.title));
    case "pending":   return arr.sort((a, b) => Number(a.completed) - Number(b.completed));
    case "completed": return arr.sort((a, b) => Number(b.completed) - Number(a.completed));
    default:          return arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
}

// ── App ───────────────────────────────────────────────
export default function App() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort,   setSort]   = useState("newest");

  const { toasts, showToast, removeToast } = useToast();

  const { tasks, loading, fetchTasks, addTask, updateTask, deleteTask, clearCompleted } =
    useTasks({
      onSuccess: (msg) => showToast(msg, "success"),
      onError:   (msg) => showToast(msg, "error"),
    });

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // filter → search → sort
  const visibleTasks = useMemo(() => {
    let list = tasks;
    if (filter === "completed") list = list.filter((t) => t.completed);
    if (filter === "pending")   list = list.filter((t) => !t.completed);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) => t.title.toLowerCase().includes(q) ||
               (t.description && t.description.toLowerCase().includes(q))
      );
    }
    return applySort(list, sort);
  }, [tasks, filter, search, sort]);

  const total     = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending   = total - completed;

  const FILTERS = [
    { key: "all",       label: `All`,       count: total,     color: "bg-indigo-500"  },
    { key: "completed", label: `Completed`, count: completed, color: "bg-emerald-500" },
    { key: "pending",   label: `Pending`,   count: pending,   color: "bg-amber-500"   },
  ];

  const emptyIcon = search ? "🔍" : filter === "completed" ? "✅" : filter === "pending" ? "⏳" : "📭";
  const emptyMsg  = search
    ? `No tasks match "${search}".`
    : filter === "completed" ? "No completed tasks yet."
    : filter === "pending"   ? "No pending tasks. Great work! 🎉"
    : "No tasks yet. Add one above to get started!";

  return (
    <>
      {/* ── Background wallpaper ── */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        {/* Photo by Alexa Mazzarello – productivity / sticky-notes desk */}
        <img
          src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1920&q=80&auto=format&fit=crop"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center"
        />
        {/* dark gradient overlay so text stays readable */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b0f1a]/92 via-[#0d1225]/88 to-[#0b0f1a]/92" />
        {/* subtle colour tint blobs on top of the photo */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40  w-[500px] h-[500px] bg-violet-600/8  rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] bg-cyan-600/6   rounded-full blur-3xl" />
      </div>

      <div className="max-w-2xl mx-auto px-5 py-12 pb-24">

        {/* ── Header ── */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-3xl mb-4 shadow-lg shadow-indigo-500/10">
            📋
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-100 mb-2">
            Task <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Tracker</span>
          </h1>
          <p className="text-slate-400 text-sm">Stay organised — manage your tasks in one place.</p>
        </header>

        {/* ── Stats cards ── */}
        {!loading && total > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-8">
            {FILTERS.map(({ key, label, count, color }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={[
                  "group flex flex-col items-center gap-1 p-4 rounded-2xl border transition-all duration-200 cursor-pointer backdrop-blur-md",
                  filter === key
                    ? "bg-slate-800/80 border-indigo-500/60 shadow-lg shadow-indigo-500/10"
                    : "bg-slate-900/50 border-slate-700/40 hover:border-slate-600 hover:bg-slate-800/60",
                ].join(" ")}
              >
                <span className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-2xl font-bold text-slate-100">{count}</span>
                <span className="text-xs text-slate-400 font-medium">{label}</span>
              </button>
            ))}
          </div>
        )}

        {/* ── Add task form ── */}
        <TaskForm onAdd={addTask} />

        {/* ── Search + Sort ── */}
        {!loading && total > 0 && (
          <SearchSortBar
            search={search} onSearch={setSearch}
            sort={sort}     onSort={setSort}
          />
        )}

        {/* ── Section heading ── */}
        {!loading && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-1 h-5 bg-emerald-500 rounded-full" />
              <h2 className="text-sm font-semibold text-slate-200">
                {filter === "all"       ? "All Tasks"       :
                 filter === "completed" ? "Completed Tasks" : "Pending Tasks"}
              </h2>
              {visibleTasks.length > 0 && (
                <span className="bg-indigo-500/15 text-indigo-400 text-xs font-bold px-2 py-0.5 rounded-full border border-indigo-500/20">
                  {visibleTasks.length}
                </span>
              )}
            </div>
            {completed > 0 && filter !== "pending" && !search && (
              <Button variant="clear" size="sm" onClick={clearCompleted}>
                🗑 Clear Completed
              </Button>
            )}
          </div>
        )}

        {/* ── Task list ── */}
        {loading ? (
          <Spinner message="Loading tasks…" />
        ) : visibleTasks.length === 0 ? (
          <EmptyState icon={emptyIcon} message={emptyMsg} />
        ) : (
          <ul className="flex flex-col gap-3 list-none p-0 m-0">
            {visibleTasks.map((task) => (
              <li key={task._id}>
                <TaskCard task={task} onDelete={deleteTask} onUpdate={updateTask} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Toasts ── */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
