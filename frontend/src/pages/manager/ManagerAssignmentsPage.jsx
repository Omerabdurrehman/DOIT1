import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { assignmentService } from "../../services/complaintService";
import StatusBadge from "../../components/complaints/StatusBadge";

export default function ManagerAssignmentsPage() {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    assignmentService.list().then(({ data }) => setAssignments(data.results || data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Team's Assignments</h1>
      <div className="bg-white rounded-lg shadow divide-y">
        {assignments.map((a) => (
          <Link
            key={a.id}
            to={`/manager/complaints/${a.complaint}`}
            className="flex justify-between items-center p-4 hover:bg-gray-50"
          >
            <div>
              <div className="text-xs text-gray-400">{a.complaint_number}</div>
              <div className="font-medium">Worker: {a.worker_name || "Unassigned"}</div>
            </div>
            <StatusBadge status={a.status} />
          </Link>
        ))}
        {!assignments.length && <div className="p-4 text-gray-400 text-sm">No assignments yet.</div>}
      </div>
    </div>
  );
}
