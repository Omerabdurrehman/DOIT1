import { useState } from "react";
import { reportService } from "../../services/complaintService";

const PERIODS = ["daily", "weekly", "monthly", "yearly"];
const FORMATS = ["csv", "excel", "pdf"];

export default function AdminReportsPage() {
  const [period, setPeriod] = useState("monthly");
  const [format, setFormat] = useState("pdf");
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const { data } = await reportService.generate(period, format);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `complaints_report_${period}.${format === "excel" ? "xlsx" : format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Generate Reports</h1>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Period</label>
          <select className="w-full border rounded px-3 py-2" value={period} onChange={(e) => setPeriod(e.target.value)}>
            {PERIODS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Format</label>
          <select className="w-full border rounded px-3 py-2" value={format} onChange={(e) => setFormat(e.target.value)}>
            {FORMATS.map((f) => <option key={f} value={f}>{f.toUpperCase()}</option>)}
          </select>
        </div>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="bg-primary text-white rounded px-4 py-2 font-semibold disabled:opacity-50"
        >
          {downloading ? "Preparing..." : "Download Report"}
        </button>
      </div>
    </div>
  );
}
