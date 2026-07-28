export default function StatCard({ label, value, color = "primary" }) {
  return (
    <div className={`bg-white rounded-lg shadow p-5 border-l-4 border-${color}`}>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-3xl font-bold mt-1">{value ?? "-"}</div>
    </div>
  );
}
