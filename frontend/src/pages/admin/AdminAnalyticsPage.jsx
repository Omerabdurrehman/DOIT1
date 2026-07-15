import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend,
} from "chart.js";
import { dashboardService } from "../../services/complaintService";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function AdminAnalyticsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    dashboardService.analytics().then(({ data }) => setData(data));
  }, []);

  if (!data) return <div>Loading...</div>;

  const districtChart = {
    labels: data.complaints_per_district.map((d) => d.district),
    datasets: [{ label: "Complaints", data: data.complaints_per_district.map((d) => d.count), backgroundColor: "#2E7D32" }],
  };

  const statusChart = {
    labels: data.complaint_status_distribution.map((d) => d.status),
    datasets: [{
      data: data.complaint_status_distribution.map((d) => d.count),
      backgroundColor: ["#F9A825", "#1565C0", "#6366F1", "#FB923C", "#14B8A6", "#A855F7", "#22C55E", "#C62828", "#9CA3AF"],
    }],
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-3">Complaints Per District</h2>
          <Bar data={districtChart} />
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-3">Status Distribution</h2>
          <Pie data={statusChart} />
        </div>
      </div>
    </div>
  );
}
