import { ExternalLink, MapPin, Calendar, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { SourceBadge, PriorityBadge } from "../ui/Badge";
import { formatDateShort, getCompanyInitial, getCompanyColor } from "../../utils/dateHelpers";
import { useApplicationStore } from "../../store/applicationStore";

export default function ApplicationCard({ app, onEdit }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { deleteApplication } = useApplicationStore();
  const gradient = getCompanyColor(app.company);

  return (
    <div className="card p-4 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group cursor-grab active:cursor-grabbing">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm`}>
            {getCompanyInitial(app.company)}
          </div>
          <div>
            <p className="font-semibold text-sm text-[var(--text)] leading-tight">{app.company}</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{app.role}</p>
          </div>
        </div>

        {/* Menu */}
        <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
            className="btn-ghost p-1 rounded-lg"
          >
            <MoreVertical size={14} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-7 z-20 w-36 card shadow-xl py-1 animate-slide-up">
                <button
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-[var(--surface-2)] text-[var(--text)]"
                  onClick={() => { onEdit(app); setMenuOpen(false); }}
                >
                  <Pencil size={12} /> Edit
                </button>
                <button
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"
                  onClick={() => { deleteApplication(app._id); setMenuOpen(false); }}
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Meta */}
      <div className="space-y-1.5">
        {app.location && (
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <MapPin size={11} /> {app.location}
          </div>
        )}
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <Calendar size={11} /> {formatDateShort(app.appliedDate)}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)]">
        <div className="flex items-center gap-2">
          <SourceBadge source={app.source} />
          <PriorityBadge priority={app.priority} />
        </div>
        {app.jobUrl && (
          <a href={app.jobUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
            className="text-[var(--text-muted)] hover:text-brand-500 transition-colors">
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
}
