import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Kanban,
  ListTodo,
  Bell,
  LogOut,
  Briefcase,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { getInitials } from "../../utils/dateHelpers";

const NAV = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/board", icon: Kanban, label: "Board" },
  { to: "/applications", icon: ListTodo, label: "Applications" },
  { to: "/reminders", icon: Bell, label: "Reminders" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    setDark((d) => !d);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside
      className={`relative flex flex-col h-screen bg-[var(--surface)] border-r border-[var(--border)] transition-all duration-300 ${collapsed ? "w-16" : "w-60"} flex-shrink-0`}
    >
      {/* Toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-6 z-10 w-6 h-6 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center shadow-sm hover:shadow-md transition-shadow text-[var(--text-muted)]"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-[var(--border)] ${collapsed ? "justify-center" : ""}`}>
        <div className="p-1 bg-white rounded-full shadow-sm">
          <img
            src="/logo.webp"
            alt="Logo"
            className="w-10 h-10 object-cover rounded-full"
          />
        </div>

        {!collapsed && (
          <div>
            <p className="font-bold text-base tracking-tight text-[var(--text)]">
              JobFlow
            </p>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              Career Tracker
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? "bg-brand-600 text-white shadow-sm shadow-brand-500/30"
                  : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
              } ${collapsed ? "justify-center" : ""}`
            }
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-[var(--border)] px-2 py-3 space-y-1">
        <button
          onClick={toggleDark}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-all ${collapsed ? "justify-center" : ""}`}
        >
          {dark ? <Sun size={17} /> : <Moon size={17} />}
          {!collapsed && (dark ? "Light Mode" : "Dark Mode")}
        </button>

        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut size={17} />
          {!collapsed && "Logout"}
        </button>

        {/* User */}
        <div
          className={`flex items-center gap-2.5 px-3 py-2 mt-2 rounded-xl bg-[var(--surface-2)] ${collapsed ? "justify-center" : ""}`}
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {getInitials(user?.name || "U")}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[var(--text)] truncate">
                {user?.name}
              </p>
              <p className="text-[10px] text-[var(--text-muted)] truncate">
                {user?.email}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
