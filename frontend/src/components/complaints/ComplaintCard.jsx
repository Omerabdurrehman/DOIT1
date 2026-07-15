import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

export default function ComplaintCard({ complaint, basePath }) {
  return (
    <Link
      to={`${basePath}/${complaint.id}`}
      className="block bg-white rounded-lg shadow p-4 hover:shadow-md transition"
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="text-xs text-gray-400">{complaint.complaint_number}</div>
          <div className="font-semibold">{complaint.subject}</div>
          <div className="text-sm text-gray-500">
            {complaint.district}, {complaint.area}
          </div>
        </div>
        <StatusBadge status={complaint.status} />
      </div>
    </Link>
  );
}
