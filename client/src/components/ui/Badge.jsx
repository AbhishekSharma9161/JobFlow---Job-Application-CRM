import { STATUS_COLORS, SOURCE_COLORS } from "../../utils/statusColors";

export const StatusBadge = ({ status, size = "sm" }) => {
  const colors = STATUS_COLORS[status] || STATUS_COLORS["Wishlist"];
  const sizeClass = size === "xs" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1";
  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${sizeClass} ${colors.bg} ${colors.text} ${colors.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {status}
    </span>
  );
};

export const SourceBadge = ({ source }) => {
  const colorClass = SOURCE_COLORS[source] || SOURCE_COLORS["Other"];
  return (
    <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md ${colorClass}`}>
      {source}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const map = { Low: "🟢", Medium: "🟡", High: "🔴" };
  return (
    <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
      {map[priority]} {priority}
    </span>
  );
};
