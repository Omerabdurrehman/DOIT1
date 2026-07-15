import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";

import CitizenLayout from "./layouts/CitizenLayout";
import AdminLayout from "./layouts/AdminLayout";
import ManagerLayout from "./layouts/ManagerLayout";
import WorkerLayout from "./layouts/WorkerLayout";

import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import ComplaintCreatePage from "./pages/citizen/ComplaintCreatePage";
import ComplaintListPage from "./pages/citizen/ComplaintListPage";
import ComplaintDetailPage from "./pages/shared/ComplaintDetailPage";
import ProfilePage from "./pages/shared/ProfilePage";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminComplaintsPage from "./pages/admin/AdminComplaintsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminReportsPage from "./pages/admin/AdminReportsPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";

import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ManagerAssignmentsPage from "./pages/manager/ManagerAssignmentsPage";

import WorkerDashboard from "./pages/worker/WorkerDashboard";
import WorkerTasksPage from "./pages/worker/WorkerTasksPage";

import NotFoundPage from "./pages/shared/NotFoundPage";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Citizen portal */}
      <Route
        path="/citizen"
        element={
          <ProtectedRoute>
            <RoleRoute allowed={["citizen"]}>
              <CitizenLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<CitizenDashboard />} />
        <Route path="complaints" element={<ComplaintListPage />} />
        <Route path="complaints/new" element={<ComplaintCreatePage />} />
        <Route path="complaints/:id" element={<ComplaintDetailPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Admin portal */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RoleRoute allowed={["admin"]}>
              <AdminLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="complaints" element={<AdminComplaintsPage />} />
        <Route path="complaints/:id" element={<ComplaintDetailPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Manager / Team Leader portal */}
      <Route
        path="/manager"
        element={
          <ProtectedRoute>
            <RoleRoute allowed={["manager"]}>
              <ManagerLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<ManagerDashboard />} />
        <Route path="assignments" element={<ManagerAssignmentsPage />} />
        <Route path="complaints/:id" element={<ComplaintDetailPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Field Worker portal */}
      <Route
        path="/worker"
        element={
          <ProtectedRoute>
            <RoleRoute allowed={["worker"]}>
              <WorkerLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<WorkerDashboard />} />
        <Route path="tasks" element={<WorkerTasksPage />} />
        <Route path="complaints/:id" element={<ComplaintDetailPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
