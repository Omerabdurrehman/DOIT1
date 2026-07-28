import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { complaintService, locationService } from "../../services/complaintService";

export default function ComplaintCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    subject: "", description: "", division: "", district: "", tehsil: "",
    area: "", address: "", landmark: "",
  });
  const [images, setImages] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    locationService.divisions().then(({ data }) => setDivisions(data.results || data));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      images.forEach((img) => formData.append("uploaded_images", img));

      const { data } = await complaintService.create(formData);
      toast.success(`Complaint ${data.complaint_number || ""} submitted successfully.`);
      navigate("/citizen/complaints");
    } catch (err) {
      toast.error("Failed to submit complaint. Please check the form.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Report a Garbage/Waste Issue</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <input name="subject" required className="w-full border rounded px-3 py-2" onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea name="description" required rows={4} className="w-full border rounded px-3 py-2" onChange={handleChange} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Division</label>
            <select name="division" required className="w-full border rounded px-3 py-2" onChange={handleChange}>
              <option value="">Select division</option>
              {divisions.map((d) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">District</label>
            <input name="district" required className="w-full border rounded px-3 py-2" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tehsil</label>
            <input name="tehsil" required className="w-full border rounded px-3 py-2" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Area</label>
            <input name="area" required className="w-full border rounded px-3 py-2" onChange={handleChange} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Exact Address</label>
          <input name="address" required className="w-full border rounded px-3 py-2" onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Landmark (optional)</label>
          <input name="landmark" className="w-full border rounded px-3 py-2" onChange={handleChange} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Photos (1–5)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages(Array.from(e.target.files).slice(0, 5))}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary text-white rounded py-2 font-semibold disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
}
