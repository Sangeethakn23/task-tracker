const SORT_OPTIONS = [
  { value: "newest",    label: "Newest First"    },
  { value: "oldest",    label: "Oldest First"    },
  { value: "az",        label: "A → Z"           },
  { value: "za",        label: "Z → A"           },
  { value: "pending",   label: "Pending First"   },
  { value: "completed", label: "Completed First" },
];

function SearchSortBar({ search, onSearch, sort, onSort }) {
  return (
    <div className="flex gap-3 mb-5 flex-wrap">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">🔍</span>
        <input
          type="search"
          placeholder="Search tasks…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          aria-label="Search tasks"
          className="w-full bg-slate-900/60 border border-slate-700 rounded-xl pl-9 pr-9 py-2.5 text-sm text-slate-100 placeholder-slate-500
                     focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all backdrop-blur-sm"
        />
        {search && (
          <button
            onClick={() => onSearch("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-100 text-lg leading-none transition-colors"
          >
            ×
          </button>
        )}
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs font-medium text-slate-400 whitespace-nowrap">Sort:</span>
        <select
          value={sort}
          onChange={(e) => onSort(e.target.value)}
          aria-label="Sort tasks"
          className="bg-slate-900/60 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 font-medium
                     focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer backdrop-blur-sm"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default SearchSortBar;
