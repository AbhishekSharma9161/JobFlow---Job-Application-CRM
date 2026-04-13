import { create } from "zustand";
import { applicationService } from "../services/api.service";
import toast from "react-hot-toast";

export const useApplicationStore = create((set, get) => ({
  applications: [],
  stats: null,
  isLoading: false,
  filters: { status: "", source: "", search: "", sortBy: "createdAt", order: "desc" },
  viewMode: "list", // 'list' | 'board'
  selectedIds: [],

  fetchApplications: async () => {
    set({ isLoading: true });
    try {
      const { data } = await applicationService.getAll(get().filters);
      set({ applications: data.data.applications });
    } catch (err) {
      toast.error("Failed to load applications");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchStats: async () => {
    try {
      const { data } = await applicationService.getStats();
      set({ stats: data.data });
    } catch {}
  },

  addApplication: async (formData) => {
    const { data } = await applicationService.create(formData);
    set((s) => ({ applications: [data.data, ...s.applications] }));
    toast.success("Application added! 🎉");
    get().fetchStats();
    return data.data;
  },

  updateApplication: async (id, formData) => {
    const { data } = await applicationService.update(id, formData);
    set((s) => ({
      applications: s.applications.map((a) => (a._id === id ? data.data : a)),
    }));
    toast.success("Application updated");
    get().fetchStats();
    return data.data;
  },

  deleteApplication: async (id) => {
    await applicationService.remove(id);
    set((s) => ({ applications: s.applications.filter((a) => a._id !== id) }));
    toast.success("Application deleted");
    get().fetchStats();
  },

  updateStatus: async (id, status) => {
    // Optimistic update
    set((s) => ({
      applications: s.applications.map((a) => (a._id === id ? { ...a, status } : a)),
    }));
    try {
      await applicationService.updateStatus(id, status);
      get().fetchStats();
    } catch {
      get().fetchApplications(); // rollback
      toast.error("Status update failed");
    }
  },

  setFilter: (key, value) => {
    set((s) => ({ filters: { ...s.filters, [key]: value } }));
  },

  clearFilters: () => {
    set({ filters: { status: "", source: "", search: "", sortBy: "createdAt", order: "desc" } });
  },

  setViewMode: (mode) => set({ viewMode: mode }),

  toggleSelected: (id) => {
    set((s) => ({
      selectedIds: s.selectedIds.includes(id)
        ? s.selectedIds.filter((i) => i !== id)
        : [...s.selectedIds, id],
    }));
  },

  clearSelected: () => set({ selectedIds: [] }),

  bulkDelete: async () => {
    const ids = get().selectedIds;
    await Promise.all(ids.map((id) => applicationService.remove(id)));
    set((s) => ({
      applications: s.applications.filter((a) => !ids.includes(a._id)),
      selectedIds: [],
    }));
    toast.success(`Deleted ${ids.length} applications`);
    get().fetchStats();
  },
}));
