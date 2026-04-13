import { format, isToday, isBefore, startOfDay, formatDistanceToNow } from "date-fns";

export const formatDate = (date) => {
  if (!date) return "—";
  return format(new Date(date), "MMM d, yyyy");
};

export const formatDateShort = (date) => {
  if (!date) return "—";
  return format(new Date(date), "MMM d");
};

export const isOverdue = (date) => {
  if (!date) return false;
  return isBefore(startOfDay(new Date(date)), startOfDay(new Date()));
};

export const isDueToday = (date) => {
  if (!date) return false;
  return isToday(new Date(date));
};

export const timeAgo = (date) => {
  if (!date) return "";
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

export const getCompanyInitial = (company = "") =>
  company.trim()[0]?.toUpperCase() || "?";

export const COMPANY_COLORS = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-500",
  "from-pink-500 to-rose-600",
  "from-indigo-500 to-blue-600",
  "from-amber-500 to-orange-600",
  "from-teal-500 to-green-600",
];

export const getCompanyColor = (name = "") => {
  const idx = name.charCodeAt(0) % COMPANY_COLORS.length;
  return COMPANY_COLORS[idx];
};
