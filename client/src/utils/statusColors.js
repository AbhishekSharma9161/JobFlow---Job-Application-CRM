export const STATUS_COLORS = {
  Wishlist:      { bg: "bg-slate-100 dark:bg-slate-800",   text: "text-slate-600 dark:text-slate-300",  dot: "bg-slate-400",    border: "border-slate-200 dark:border-slate-700" },
  Applied:       { bg: "bg-blue-50 dark:bg-blue-900/30",   text: "text-blue-700 dark:text-blue-300",    dot: "bg-blue-500",     border: "border-blue-200 dark:border-blue-800" },
  "Phone Screen":{ bg: "bg-cyan-50 dark:bg-cyan-900/30",   text: "text-cyan-700 dark:text-cyan-300",    dot: "bg-cyan-500",     border: "border-cyan-200 dark:border-cyan-800" },
  Interview:     { bg: "bg-violet-50 dark:bg-violet-900/30",text: "text-violet-700 dark:text-violet-300",dot: "bg-violet-500",   border: "border-violet-200 dark:border-violet-800" },
  Technical:     { bg: "bg-purple-50 dark:bg-purple-900/30",text: "text-purple-700 dark:text-purple-300",dot: "bg-purple-500",   border: "border-purple-200 dark:border-purple-800" },
  Offer:         { bg: "bg-emerald-50 dark:bg-emerald-900/30",text: "text-emerald-700 dark:text-emerald-300",dot: "bg-emerald-500",border: "border-emerald-200 dark:border-emerald-800" },
  Rejected:      { bg: "bg-red-50 dark:bg-red-900/30",     text: "text-red-700 dark:text-red-300",      dot: "bg-red-500",      border: "border-red-200 dark:border-red-800" },
  Ghosted:       { bg: "bg-orange-50 dark:bg-orange-900/30",text: "text-orange-700 dark:text-orange-300",dot: "bg-orange-500",   border: "border-orange-200 dark:border-orange-800" },
  Withdrawn:     { bg: "bg-gray-100 dark:bg-gray-800",     text: "text-gray-600 dark:text-gray-400",    dot: "bg-gray-400",     border: "border-gray-200 dark:border-gray-700" },
};

export const SOURCE_COLORS = {
  LinkedIn:         "bg-blue-600 text-white",
  Indeed:           "bg-indigo-600 text-white",
  "Company Website":"bg-slate-700 text-white",
  Referral:         "bg-emerald-600 text-white",
  Naukri:           "bg-orange-500 text-white",
  AngelList:        "bg-black text-white dark:bg-white dark:text-black",
  Other:            "bg-gray-500 text-white",
};

export const PRIORITY_COLORS = {
  Low:    "text-gray-500",
  Medium: "text-yellow-500",
  High:   "text-red-500",
};

export const ALL_STATUSES = ["Wishlist","Applied","Phone Screen","Interview","Technical","Offer","Rejected","Ghosted","Withdrawn"];
export const ALL_SOURCES  = ["LinkedIn","Indeed","Company Website","Referral","Naukri","AngelList","Other"];
export const ALL_PRIORITIES = ["Low","Medium","High"];
