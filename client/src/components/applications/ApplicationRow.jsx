import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { StatusBadge, SourceBadge } from "../ui/Badge";
import { formatDate, getCompanyInitial, getCompanyColor } from "../../utils/dateHelpers";
import { useApplicationStore } from "../../store/applicationStore";
import { ALL_STATUSES } from "../../utils/statusColors";

export default function ApplicationRow({ app, onEdit, isSelected, onToggleSelect }) {
  const { deleteApplication, updateStatus, selectedIds } = useApplicationStore();
  const gradient = getCompanyColor(app.company);

  return (
    <tr className="border-b border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors group">
      {/* Checkbox */}
      <td className="pl-4 py-3 w-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(app._id)}
          className="rounded border-[var(--border)] text-brand-600 focus:ring-brand-500"
        />
      </td>

      {/* Company */}
      <td className="py-3 px-3">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
            {getCompanyInitial(app.company)}
          </div>
          <div>
            <p className="font-semibold text-sm text-[var(--text)]">{app.company}</p>
            <p className="text-xs text-[var(--text-muted)]">{app.role}</p>
          </div>
        </div>
      </td>

      {/* Location */}
      <td className="py-3 px-3 text-sm text-[var(--text-muted)] hidden md:table-cell">
        {app.location || "—"}
      </td>

      {/* Status */}
      <td className="py-3 px-3">
        <select
          value={app.status}
          onChange={(e) => updateStatus(app._id, e.target.value)}
          className="bg-transparent text-xs font-semibold border-0 focus:ring-0 cursor-pointer text-[var(--text)] p-0"
        >
          {ALL_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </td>

      {/* Source */}
      <td className="py-3 px-3 hidden lg:table-cell">
        <SourceBadge source={app.source} />
      </td>

      {/* Date */}
      <td className="py-3 px-3 text-sm text-[var(--text-muted)] hidden lg:table-cell font-mono">
        {formatDate(app.appliedDate)}
      </td>

      {/* Actions */}
      <td className="py-3 pr-4">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
          {app.jobUrl && (
            <a href={app.jobUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost p-1.5">
              <ExternalLink size={14} />
            </a>
          )}
          <button onClick={() => onEdit(app)} className="btn-ghost p-1.5">
            <Pencil size={14} />
          </button>
          <button onClick={() => deleteApplication(app._id)} className="btn-ghost p-1.5 hover:text-red-500">
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}
