import { useEffect, useState } from "react";
import { applicationService } from "../services/api.service";
import { useApplicationStore } from "../store/applicationStore";
import { Bell, CheckCircle2, Clock, AlertTriangle, RefreshCw } from "lucide-react";
import { formatDate, getCompanyInitial, getCompanyColor } from "../utils/dateHelpers";
import { StatusBadge } from "../components/ui/Badge";
import toast from "react-hot-toast";

export default function Reminders() {
  const [reminders, setReminders] = useState({ dueToday: [], overdue: [] });
  const [loading, setLoading] = useState(true);
  const { updateApplication } = useApplicationStore();

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const { data } = await applicationService.getReminders();
      setReminders(data.data);
    } catch {
      toast.error("Failed to load reminders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReminders(); }, []);

  const markDone = async (app) => {
    try {
      await updateApplication(app._id, { followUpDone: true });
      toast.success(`Follow-up marked done for ${app.company}`);
      fetchReminders();
    } catch {
      toast.error("Failed to update");
    }
  };

  const ReminderCard = ({ app, type }) => {
    const gradient = getCompanyColor(app.company);
    return (
      <div className={`card p-4 flex items-center gap-4 hover:shadow-md transition-all group animate-slide-up ${
        type === "overdue" ? "border-l-4 border-l-red-400" : "border-l-4 border-l-amber-400"
      }`}>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
          {getCompanyInitial(app.company)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-sm text-[var(--text)]">{app.company}</p>
            <StatusBadge status={app.status} size="xs" />
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">{app.role}</p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <Clock size={11} className={type === "overdue" ? "text-red-500" : "text-amber-500"} />
            <span className={`text-xs font-semibold ${type === "overdue" ? "text-red-500" : "text-amber-600 dark:text-amber-400"}`}>
              Follow-up {type === "overdue" ? "was" : ""} due {formatDate(app.followUpDate)}
            </span>
          </div>
          {app.notes && (
            <p className="text-xs text-[var(--text-muted)] mt-1 italic truncate max-w-xs">"{app.notes}"</p>
          )}
        </div>

        <button
          onClick={() => markDone(app)}
          className="sm:opacity-0 sm:group-hover:opacity-100 flex items-center gap-2 px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-semibold hover:bg-emerald-100 transition-all flex-shrink-0"
        >
          <CheckCircle2 size={14} /> Mark Done
        </button>
      </div>
    );
  };

  const Section = ({ title, items, type, icon: Icon, iconClass, emptyMsg }) => (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${type === "overdue" ? "bg-red-100 dark:bg-red-900/30" : "bg-amber-100 dark:bg-amber-900/30"}`}>
          <Icon size={16} className={iconClass} />
        </div>
        <div>
          <h2 className="font-bold text-[var(--text)]">{title}</h2>
          <p className="text-xs text-[var(--text-muted)]">{items.length} item{items.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="card p-8 text-center text-[var(--text-muted)]">
          <CheckCircle2 size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">{emptyMsg}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((app) => (
            <ReminderCard key={app._id} app={app} type={type} />
          ))}
        </div>
      )}
    </div>
  );

  const total = reminders.dueToday.length + reminders.overdue.length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-[var(--text)] flex items-center gap-2">
            <Bell size={20} className="text-amber-500" /> Follow-up Reminders
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {total === 0 ? "You're all caught up! 🎉" : `${total} pending follow-up${total !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button onClick={fetchReminders} disabled={loading} className="btn-secondary">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Section
            title="Due Today"
            items={reminders.dueToday}
            type="today"
            icon={Clock}
            iconClass="text-amber-500"
            emptyMsg="No follow-ups due today"
          />
          <Section
            title="Overdue"
            items={reminders.overdue}
            type="overdue"
            icon={AlertTriangle}
            iconClass="text-red-500"
            emptyMsg="No overdue follow-ups"
          />
        </div>
      )}
    </div>
  );
}
