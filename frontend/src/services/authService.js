import api from "./api";

export const authService = {
  register: (payload) => api.post("/auth/register/", payload),
  login: (payload) => api.post("/auth/login/", payload),
  logout: (refresh) => api.post("/auth/logout/", { refresh }),
  forgotPassword: (email) => api.post("/auth/forgot-password/", { email }),
  resetPassword: (payload) => api.post("/auth/reset-password/", payload),
  changePassword: (payload) => api.post("/auth/change-password/", payload),
  getProfile: () => api.get("/auth/profile/"),
  updateProfile: (payload) => api.patch("/auth/profile/", payload),
};
