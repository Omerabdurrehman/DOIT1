import { useEffect, useState } from "react";
import { dashboardService } from "../../services/complaintService";
import StatCard from "../../components/ui/StatCard";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    dashboardService.admin().then(({ data }) => setStats(data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Complaints" value={stats?.total_complaints} />
        <StatCard label="New Complaints" value={stats?.new_complaints} color="warning" />
        <StatCard
          label="Avg. Resolution (hrs)"
          value={
            stats?.average_resolution_time_seconds
              ? Math.round(stats.average_resolution_time_seconds / 3600)
              : "-"
          }
          color="secondary"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-3">Complaints by District</h2>
          {stats?.complaints_by_district?.map((row) => (
            <div key={row.district} className="flex justify-between text-sm py-1 border-b last:border-none">
              <span>{row.district}</span><span className="font-medium">{row.count}</span>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-3">Complaints by Status</h2>
          {stats?.complaints_by_status?.map((row) => (
            <div key={row.status} className="flex justify-between text-sm py-1 border-b last:border-none">
              <span className="capitalize">{row.status?.replace(/_/g, " ")}</span>
              <span className="font-medium">{row.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
