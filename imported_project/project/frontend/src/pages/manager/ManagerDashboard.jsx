import { useEffect, useState } from "react";
import { dashboardService } from "../../services/complaintService";
import StatCard from "../../components/ui/StatCard";

export default function ManagerDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    dashboardService.manager().then(({ data }) => setStats(data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Assigned Complaints" value={stats?.assigned_complaints} />
        <StatCard label="In Progress" value={stats?.in_progress_complaints} color="warning" />
        <StatCard label="Completed" value={stats?.completed_complaints} color="secondary" />
      </div>
    </div>
  );
}
