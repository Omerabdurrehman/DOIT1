import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { complaintService } from "../../services/complaintService";
import { useAuth } from "../../context/AuthContext";
import StatusBadge from "../../components/complaints/StatusBadge";
import Timeline from "../../components/complaints/Timeline";

const STATUS_OPTIONS = [
  "acknowledged", "assigned", "in_progress", "resolved",
  "waiting_verification", "closed", "rejected",
];

export default function ComplaintDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [comment, setComment] = useState("");
  const [nextStatus, setNextStatus] = useState("");

  const load = () => complaintService.detail(id).then(({ data }) => setComplaint(data));

  useEffect(() => { load(); }, [id]);

  if (!complaint) return <div>Loading...</div>;

  const isCitizen = user.role === "citizen";
  const isStaff = ["admin", "manager", "worker"].includes(user.role);

  const handleStatusUpdate = async () => {
    if (!nextStatus) return;
    try {
      await complaintService.updateStatus(id, { status: nextStatus });
      toast.success("Status updated.");
      load();
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const handleVerify = async () => {
    await complaintService.verify(id);
    toast.success("Complaint verified and closed. Thank you!");
    load();
  };

  const handleReopen = async () => {
    const reason = prompt("Please describe why the issue is not resolved:");
    if (reason === null) return;
    await complaintService.reopen(id, reason);
    toast.info("Complaint reopened.");
    load();
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    await complaintService.addComment(id, comment);
    setComment("");
    load();
  };

  return (
    <div className="max-w-3xl">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-xs text-gray-400">{complaint.complaint_number}</div>
          <h1 className="text-2xl font-bold">{complaint.subject}</h1>
          <div className="text-sm text-gray-500">
            {complaint.district}, {complaint.tehsil}, {complaint.area} — {complaint.address}
          </div>
        </div>
        <StatusBadge status={complaint.status} />
      </div>

      <p className="bg-white rounded-lg shadow p-4 mb-6">{complaint.description}</p>

      {complaint.images?.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Photos</h2>
          <div className="flex gap-3 flex-wrap">
            {complaint.images.map((img) => (
              <img key={img.id} src={img.image} alt={img.image_type} className="w-32 h-32 object-cover rounded" />
            ))}
          </div>
        </div>
      )}

      {isCitizen && complaint.status === "waiting_verification" && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6 flex gap-3">
          <button onClick={handleVerify} className="bg-primary text-white px-4 py-2 rounded">
            Verify & Close
          </button>
          <button onClick={handleReopen} className="bg-danger text-white px-4 py-2 rounded">
            Not Resolved — Reopen
          </button>
        </div>
      )}

      {isStaff && (
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex gap-3 items-center">
          <select
            className="border rounded px-3 py-2"
            value={nextStatus}
            onChange={(e) => setNextStatus(e.target.value)}
          >
            <option value="">Update status...</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
            ))}
          </select>
          <button onClick={handleStatusUpdate} className="bg-secondary text-white px-4 py-2 rounded">
            Update
          </button>
        </div>
      )}

      <h2 className="font-semibold mb-2">Timeline</h2>
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <Timeline events={complaint.timeline} />
      </div>

      <h2 className="font-semibold mb-2">Comments</h2>
      <div className="bg-white rounded-lg shadow p-4 space-y-3 mb-3">
        {complaint.comments?.map((c) => (
          <div key={c.id} className="border-b pb-2 last:border-none">
            <div className="text-sm font-medium">{c.author_name}</div>
            <div className="text-sm text-gray-600">{c.text}</div>
          </div>
        ))}
        {!complaint.comments?.length && <div className="text-gray-400 text-sm">No comments yet.</div>}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button onClick={handleComment} className="bg-primary text-white px-4 py-2 rounded">Post</button>
      </div>
    </div>
  );
}
