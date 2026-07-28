export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Users & Teams</h1>
      <p className="text-gray-500">
        User and team management (create Managers/Workers, form teams, assign districts)
        is exposed via the Django Admin at <code>/admin/</code> and the
        <code> /api/auth/</code> and future <code>/api/accounts/teams/</code> endpoints.
        Wire this page up to a full CRUD table/form once those list/create endpoints are finalized.
      </p>
    </div>
  );
}
