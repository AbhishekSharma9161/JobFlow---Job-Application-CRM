import { useEffect, useState } from "react";
import { useApplicationStore } from "../store/applicationStore";
import ApplicationRow from "../components/applications/ApplicationRow";
import ApplicationModal from "../components/applications/ApplicationModal";
import { StatusBadge } from "../components/ui/Badge";
import { ALL_STATUSES, ALL_SOURCES } from "../utils/statusColors";
import { useDebounce } from "../hooks/useDebounce";
import {
  Search, Plus, Trash2, X, SlidersHorizontal,
  ArrowUpDown, ArrowUp, ArrowDown, FileX
} from "lucide-react";

export default function Applications() {
  const {
    applications, isLoading, filters,
    fetchApplications, setFilter, clearFilters,
    selectedIds, toggleSelected, clearSelected, bulkDelete,
  } = useApplicationStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [localSearch, setLocalSearch] = useState(filters.search || "");
  const [showFilters, setShowFilters] = useState(false);
  const debouncedSearch = useDebounce(localSearch, 400);

  useEffect(() => {
    setFilter("search", debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    fetchApplications();
  }, [filters]);

  const openEdit = (app) => { setEditData(app); setModalOpen(true); };
  const openAdd  = () => { setEditData(null); setModalOpen(true); };

  const toggleSort = (field) => {
    if (filters.sortBy === field) {
      setFilter("order", filters.order === "desc" ? "asc" : "desc");
    } else {
      setFilter("sortBy", field);
      setFilter("order", "desc");
    }
  };

  const SortIcon = ({ field }) => {
    if (filters.sortBy !== field) return <ArrowUpDown size={13} className="opacity-30" />;
    return filters.order === "desc" ? <ArrowDown size={13} className="text-brand-500" /> : <ArrowUp size={13} className="text-brand-500" />;
  };

  const allSelected = applications.length > 0 && selectedIds.length === applications.length;
  const toggleAll = () => {
    if (allSelected) clearSelected();
    else applications.forEach((a) => { if (!selectedIds.includes(a._id)) toggleSelected(a._id); });
  };

  const hasFilters = filters.status || filters.source || filters.search;

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-extrabold text-[var(--text)]">Applications</h1>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {applications.length} application{applications.length !== 1 ? "s" : ""}
              {hasFilters && " (filtered)"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <button
                onClick={() => { bulkDelete(); clearSelected(); }}
                className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors"
              >
                <Trash2 size={14} /> Delete {selectedIds.length}
              </button>
            )}
            <button onClick={() => setShowFilters((v) => !v)} className={`btn-secondary gap-2 ${showFilters ? "ring-2 ring-brand-500/40" : ""}`}>
              <SlidersHorizontal size={14} /> Filters
            </button>
            <button onClick={openAdd} className="btn-primary">
              <Plus size={15} /> Add
            </button>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              className="input pl-9 py-2"
              placeholder="Search company, role, location..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
            {localSearch && (
              <button onClick={() => { setLocalSearch(""); setFilter("search", ""); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)]">
                <X size={14} />
              </button>
            )}
          </div>

          {showFilters && (
            <>
              {/* Status filter */}
              <select
                className="input w-auto py-2 text-sm"
                value={filters.status}
                onChange={(e) => setFilter("status", e.target.value)}
              >
                <option value="">All Statuses</option>
                {ALL_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>

              {/* Source filter */}
              <select
                className="input w-auto py-2 text-sm"
                value={filters.source}
                onChange={(e) => setFilter("source", e.target.value)}
              >
                <option value="">All Sources</option>
                {ALL_SOURCES.map((s) => <option key={s}>{s}</option>)}
              </select>

              {hasFilters && (
                <button onClick={() => { clearFilters(); setLocalSearch(""); }} className="btn-ghost text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <X size={14} /> Clear filters
                </button>
              )}
            </>
          )}

          {/* Active filter badges */}
          {filters.status && (
            <div className="flex items-center gap-1.5">
              <StatusBadge status={filters.status} size="xs" />
              <button onClick={() => setFilter("status", "")} className="text-[var(--text-muted)] hover:text-[var(--text)]">
                <X size={12} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-6 py-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-[var(--text-muted)]">
            <FileX size={48} className="mb-4 opacity-30" />
            <p className="font-semibold text-lg">{hasFilters ? "No matches found" : "No applications yet"}</p>
            <p className="text-sm mt-1">{hasFilters ? "Try adjusting your filters" : "Add your first job application to get started"}</p>
            {!hasFilters && (
              <button onClick={openAdd} className="btn-primary mt-4">
                <Plus size={15} /> Add Application
              </button>
            )}
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-2)]">
                  <th className="pl-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      className="rounded border-[var(--border)] text-brand-600 focus:ring-brand-500"
                    />
                  </th>
                  <th className="py-3 px-3 text-left">
                    <button onClick={() => toggleSort("company")} className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider hover:text-[var(--text)]">
                      Company <SortIcon field="company" />
                    </button>
                  </th>
                  <th className="py-3 px-3 text-left hidden md:table-cell">
                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Location</span>
                  </th>
                  <th className="py-3 px-3 text-left">
                    <button onClick={() => toggleSort("status")} className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider hover:text-[var(--text)]">
                      Status <SortIcon field="status" />
                    </button>
                  </th>
                  <th className="py-3 px-3 text-left hidden lg:table-cell">
                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Source</span>
                  </th>
                  <th className="py-3 px-3 text-left hidden lg:table-cell">
                    <button onClick={() => toggleSort("appliedDate")} className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider hover:text-[var(--text)]">
                      Applied <SortIcon field="appliedDate" />
                    </button>
                  </th>
                  <th className="py-3 pr-4 text-right">
                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <ApplicationRow
                    key={app._id}
                    app={app}
                    onEdit={openEdit}
                    isSelected={selectedIds.includes(app._id)}
                    onToggleSelect={toggleSelected}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ApplicationModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditData(null); }}
        editData={editData}
      />
    </div>
  );
}
