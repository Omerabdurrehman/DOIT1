import api from "./api";

export const complaintService = {
  list: (params) => api.get("/complaints/", { params }),
  detail: (id) => api.get(`/complaints/${id}/`),
  create: (formData) =>
    api.post("/complaints/", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  updateStatus: (id, payload) => api.post(`/complaints/${id}/update-status/`, payload),
  verify: (id) => api.post(`/complaints/${id}/verify/`),
  reopen: (id, reason) => api.post(`/complaints/${id}/reopen/`, { reason }),
  addComment: (id, text) => api.post(`/complaints/${id}/comment/`, { text }),
  addFeedback: (id, payload) => api.post(`/complaints/${id}/feedback/`, payload),
  uploadImage: (id, formData) =>
    api.post(`/complaints/${id}/upload-image/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export const locationService = {
  provinces: () => api.get("/locations/provinces/"),
  divisions: (province) => api.get("/locations/divisions/", { params: { province } }),
  districts: (division) => api.get("/locations/districts/", { params: { division } }),
  tehsils: (district) => api.get("/locations/tehsils/", { params: { district } }),
  areas: (tehsil) => api.get("/locations/areas/", { params: { tehsil } }),
};

export const assignmentService = {
  list: () => api.get("/assignments/"),
  create: (payload) => api.post("/assignments/", payload),
  markCompleted: (id, remarks) => api.post(`/assignments/${id}/mark-completed/`, { remarks }),
};

export const notificationService = {
  list: () => api.get("/notifications/"),
  markRead: (id) => api.post(`/notifications/${id}/mark-read/`),
  markAllRead: () => api.post("/notifications/mark-all-read/"),
  unreadCount: () => api.get("/notifications/unread-count/"),
};

export const dashboardService = {
  citizen: () => api.get("/dashboard/citizen/"),
  admin: () => api.get("/dashboard/admin/"),
  manager: () => api.get("/dashboard/manager/"),
  worker: () => api.get("/dashboard/worker/"),
  analytics: () => api.get("/dashboard/analytics/"),
};

export const reportService = {
  // NOTE: query param is "file_type", not "format" — DRF reserves "format"
  // for its own content-negotiation mechanism.
  generate: (period, fileType) =>
    api.get("/reports/generate/", { params: { period, file_type: fileType }, responseType: "blob" }),
};
