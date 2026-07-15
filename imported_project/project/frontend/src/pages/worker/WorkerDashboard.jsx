import { useEffect, useState } from "react";
import { dashboardService } from "../../services/complaintService";
import StatCard from "../../components/ui/StatCard";

export default function WorkerDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    dashboardService.worker().then(({ data }) => setStats(data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Field Worker Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Assigned Tasks" value={stats?.assigned_tasks} />
        <StatCard label="Pending Tasks" value={stats?.pending_tasks} color="warning" />
        <StatCard label="Completed Tasks" value={stats?.completed_tasks} color="secondary" />
      </div>
    </div>
  );
}
