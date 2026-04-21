import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Kanban,
  ListTodo,
  Bell,
  LogOut,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { getInitials } from "../../utils/dateHelpers";
import { useTheme } from "../../hooks/useTheme";

const NAV = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/board", icon: Kanban, label: "Board" },
  { to: "/applications", icon: ListTodo, label: "Applications" },
  { to: "/reminders", icon: Bell, label: "Reminders" },
];

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const [collapsed, setCollapsed] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleNavClick = () => {
    if (onMobileClose) onMobileClose();
  };

  return (
    <aside
      className={`
        flex flex-col h-screen bg-[var(--surface)] border-r border-[var(--border)] transition-all duration-300 flex-shrink-0
        fixed inset-y-0 left-0 z-30 lg:relative lg:translate-x-0
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        ${collapsed ? "w-16" : "w-60"}
      `}
    >
      {/* Mobile close button */}
      <button
        onClick={onMobileClose}
        className="absolute top-4 right-4 z-10 p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)] lg:hidden"
        aria-label="Close menu"
      >
        <X size={18} />
      </button>

      {/* Desktop collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-6 z-10 w-6 h-6 rounded-full bg-[var(--surface)] border border-[var(--border)] items-center justify-center shadow-sm hover:shadow-md transition-shadow text-[var(--text-muted)] hidden lg:flex"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-[var(--border)] ${collapsed ? "justify-center" : ""}`}>
        <div className="p-1 bg-white rounded-full shadow-sm flex-shrink-0">
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
            onClick={handleNavClick}
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
          onClick={toggleTheme}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-all ${collapsed ? "justify-center" : ""}`}
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
          {!collapsed && (isDark ? "Light Mode" : "Dark Mode")}
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
