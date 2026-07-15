const COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  acknowledged: "bg-blue-100 text-blue-800",
  assigned: "bg-indigo-100 text-indigo-800",
  in_progress: "bg-orange-100 text-orange-800",
  resolved: "bg-teal-100 text-teal-800",
  waiting_verification: "bg-purple-100 text-purple-800",
  closed: "bg-green-100 text-green-800",
  reopened: "bg-red-100 text-red-800",
  rejected: "bg-gray-200 text-gray-800",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${COLORS[status] || "bg-gray-100"}`}>
      {status?.replace(/_/g, " ")}
    </span>
  );
}
