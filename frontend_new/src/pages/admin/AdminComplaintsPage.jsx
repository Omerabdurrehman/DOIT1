import { useEffect, useState } from "react";
import { complaintService } from "../../services/complaintService";
import ComplaintCard from "../../components/complaints/ComplaintCard";

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [filters, setFilters] = useState({ status: "", search: "" });

  const load = () => {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.search) params.search = filters.search;
    complaintService.list(params).then(({ data }) => setComplaints(data.results || data));
  };

  useEffect(() => { load(); }, [filters]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Complaints</h1>
      <div className="flex gap-3 mb-4">
        <input
          className="border rounded px-3 py-2 flex-1"
          placeholder="Search by tracking #, subject, district..."
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select
          className="border rounded px-3 py-2"
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Statuses</option>
          {["pending","acknowledged","assigned","in_progress","resolved","waiting_verification","closed","reopened","rejected"].map((s) => (
            <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {complaints.map((c) => (
          <ComplaintCard key={c.id} complaint={c} basePath="/admin/complaints" />
        ))}
      </div>
    </div>
  );
}
