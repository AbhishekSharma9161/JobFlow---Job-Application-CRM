import api from "./axiosInstance";

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authService = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
};

// ─── Applications ────────────────────────────────────────────────────────────
export const applicationService = {
  getAll: (params) => api.get("/applications", { params }),
  getOne: (id) => api.get(`/applications/${id}`),
  create: (data) => api.post("/applications", data),
  update: (id, data) => api.put(`/applications/${id}`, data),
  remove: (id) => api.delete(`/applications/${id}`),
  updateStatus: (id, status) => api.patch(`/applications/${id}/status`, { status }),
  getStats: () => api.get("/applications/stats"),
  getReminders: () => api.get("/applications/reminders"),
};
