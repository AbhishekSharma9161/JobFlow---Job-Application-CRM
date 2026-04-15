import { useEffect, useState } from "react";
import { useApplicationStore } from "../store/applicationStore";
import { applicationService } from "../services/api.service";
import { useAuthStore } from "../store/authStore";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Briefcase, Target, Award, Bell, Plus } from "lucide-react";
import { StatusBadge, SourceBadge } from "../components/ui/Badge";
import { formatDate, getCompanyInitial, getCompanyColor } from "../utils/dateHelpers";
import ApplicationModal from "../components/applications/ApplicationModal";

const COLORS = ["#6366f1","#8b5cf6","#06b6d4","#10b981","#f59e0b","#ef4444","#f97316","#6b7280","#94a3b8"];

export default function Dashboard() {
  const { user } = useAuthStore();
  const { applications, stats, fetchApplications, fetchStats } = useApplicationStore();
  const [reminders, setReminders] = useState({ dueToday: [], overdue: [] });
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchApplications();
    fetchStats();
    applicationService.getReminders().then(({ data }) => setReminders(data.data)).catch(() => {});
  }, []);

  const recent = [...applications].slice(0, 5);
  const totalReminders = reminders.dueToday.length + reminders.overdue.length;

  const metricCards = [
    { label: "Total Applied", value: stats?.total ?? "—", icon: Briefcase, color: "from-brand-500 to-brand-600", change: "+12% this month" },
    { label: "Active Pipeline", value: stats?.activePipeline ?? "—", icon: Target, color: "from-violet-500 to-purple-600", change: "In progress" },
    { label: "Offers", value: stats?.offers ?? "—", icon: Award, color: "from-emerald-500 to-teal-600", change: "Congratulations!" },
    { label: "Response Rate", value: stats?.responseRate != null ? `${stats.responseRate}%` : "—", icon: TrendingUp, color: "from-orange-500 to-amber-500", change: "Based on responses" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text)]">
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"},{" "}
            <span className="text-brand-600">{user?.name?.split(" ")[0]}</span> 👋
          </h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">Here's your job search overview</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary flex-shrink-0">
          <Plus size={16} /> <span className="hidden sm:inline">Add Application</span><span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {metricCards.map(({ label, value, icon: Icon, color, change }) => (
          <div key={label} className="card p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm`}>
                <Icon size={18} className="text-white" />
              </div>
              {totalReminders > 0 && label === "Total Applied" && (
                <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                  <Bell size={11} /> {totalReminders} due
                </span>
              )}
            </div>
            <p className="text-3xl font-extrabold text-[var(--text)] mb-1">{value}</p>
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">{label}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1 opacity-70">{change}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Bar chart */}
        <div className="card p-4 sm:p-6 lg:col-span-2">
          <h3 className="font-bold text-[var(--text)] mb-1">Weekly Activity</h3>
          <p className="text-xs text-[var(--text-muted)] mb-4 sm:mb-5">Applications submitted last 7 days</p>
          {stats?.weeklyActivity?.length ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={stats.weeklyActivity} barSize={24}>
                <XAxis dataKey="_id" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                  cursor={{ fill: "var(--surface-2)" }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[180px] flex items-center justify-center text-[var(--text-muted)] text-sm">No activity data yet</div>
          )}
        </div>

        {/* Pie chart */}
        <div className="card p-4 sm:p-6">
          <h3 className="font-bold text-[var(--text)] mb-1">Status Mix</h3>
          <p className="text-xs text-[var(--text-muted)] mb-4">Current pipeline breakdown</p>
          {stats?.statusDistribution?.length ? (
            <>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={stats.statusDistribution} dataKey="count" nameKey="_id" cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3}>
                    {stats.statusDistribution.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {stats.statusDistribution.slice(0, 5).map((s, i) => (
                  <div key={s._id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-[var(--text-muted)]">{s._id}</span>
                    </div>
                    <span className="font-semibold text-[var(--text)]">{s.count}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[150px] flex items-center justify-center text-[var(--text-muted)] text-sm">No data yet</div>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent applications */}
        <div className="card p-4 sm:p-6">
          <h3 className="font-bold text-[var(--text)] mb-4">Recent Applications</h3>
          {recent.length ? (
            <div className="space-y-3">
              {recent.map((app) => (
                <div key={app._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--surface-2)] transition-colors">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${getCompanyColor(app.company)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {getCompanyInitial(app.company)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[var(--text)] truncate">{app.company}</p>
                    <p className="text-xs text-[var(--text-muted)] truncate">{app.role}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StatusBadge status={app.status} size="xs" />
                    <span className="text-[10px] text-[var(--text-muted)] font-mono">{formatDate(app.appliedDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[var(--text-muted)] text-sm">
              <Briefcase size={32} className="mx-auto mb-3 opacity-30" />
              No applications yet. Add your first one!
            </div>
          )}
        </div>

        {/* Reminders */}
        <div className="card p-4 sm:p-6">
          <h3 className="font-bold text-[var(--text)] mb-4 flex items-center gap-2">
            <Bell size={16} className="text-amber-500" /> Follow-up Reminders
          </h3>
          {reminders.dueToday.length === 0 && reminders.overdue.length === 0 ? (
            <div className="text-center py-8 text-[var(--text-muted)] text-sm">
              <Bell size={32} className="mx-auto mb-3 opacity-30" />
              No pending reminders 🎉
            </div>
          ) : (
            <div className="space-y-3">
              {[...reminders.dueToday.map(a => ({ ...a, tag: "today" })), ...reminders.overdue.map(a => ({ ...a, tag: "overdue" }))].slice(0, 5).map((app) => (
                <div key={app._id} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface-2)]">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${app.tag === "today" ? "bg-amber-500" : "bg-red-500"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[var(--text)] truncate">{app.company}</p>
                    <p className="text-xs text-[var(--text-muted)]">{app.role}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${app.tag === "today" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300"}`}>
                    {app.tag === "today" ? "Due Today" : "Overdue"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ApplicationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
