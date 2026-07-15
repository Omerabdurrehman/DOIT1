import { useEffect, useState } from "react";
import { dashboardService } from "../../services/complaintService";
import StatCard from "../../components/ui/StatCard";

export default function CitizenDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    dashboardService.citizen().then(({ data }) => setStats(data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Complaints" value={stats?.total_complaints} />
        <StatCard label="Pending" value={stats?.pending_complaints} color="warning" />
        <StatCard label="Resolved" value={stats?.resolved_complaints} color="secondary" />
        <StatCard label="Reopened" value={stats?.reopened_complaints} color="danger" />
      </div>

      <h2 className="text-lg font-semibold mb-3">Recent Notifications</h2>
      <div className="bg-white rounded-lg shadow divide-y">
        {stats?.recent_notifications?.length ? (
          stats.recent_notifications.map((n) => (
            <div key={n.id} className="p-4">
              <div className="font-medium">{n.title}</div>
              <div className="text-sm text-gray-500">{n.message}</div>
            </div>
          ))
        ) : (
          <div className="p-4 text-gray-400 text-sm">No notifications yet.</div>
        )}
      </div>
    </div>
  );
}
