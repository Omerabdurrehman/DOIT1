import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { assignmentService } from "../../services/complaintService";
import StatusBadge from "../../components/complaints/StatusBadge";

export default function WorkerTasksPage() {
  const [assignments, setAssignments] = useState([]);
  const [remarks, setRemarks] = useState({});

  const load = () => assignmentService.list().then(({ data }) => setAssignments(data.results || data));

  useEffect(() => { load(); }, []);

  const handleComplete = async (id) => {
    try {
      await assignmentService.markCompleted(id, remarks[id] || "");
      toast.success("Task marked as completed.");
      load();
    } catch {
      toast.error("Failed to mark task complete.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Tasks</h1>
      <div className="space-y-4">
        {assignments.map((a) => (
          <div key={a.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="font-medium">{a.complaint_number}</div>
              <StatusBadge status={a.status} />
            </div>
            <textarea
              placeholder="Add remarks about the work done..."
              className="w-full border rounded px-3 py-2 mb-2"
              onChange={(e) => setRemarks({ ...remarks, [a.id]: e.target.value })}
            />
            <button
              onClick={() => handleComplete(a.id)}
              className="bg-primary text-white px-4 py-2 rounded"
            >
              Mark Completed
            </button>
          </div>
        ))}
        {!assignments.length && <div className="text-gray-400 text-sm">No tasks assigned yet.</div>}
      </div>
    </div>
  );
}
