import { useEffect, useState } from "react";
import { complaintService } from "../../services/complaintService";
import ComplaintCard from "../../components/complaints/ComplaintCard";

export default function ComplaintListPage() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    complaintService.list().then(({ data }) => setComplaints(data.results || data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Complaints</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {complaints.map((c) => (
          <ComplaintCard key={c.id} complaint={c} basePath="/citizen/complaints" />
        ))}
        {!complaints.length && <p className="text-gray-400">You haven't filed any complaints yet.</p>}
      </div>
    </div>
  );
}
