import { useEffect, useState } from "react";
import api from "../api/axios";

interface Dataset {
  id: number;
  filename: string;
  uploaded_at: string;
  total_equipment: number;
  avg_flowrate: number;
  avg_pressure: number;
  avg_temperature: number;
}

const History = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("history/");
        setDatasets(response.data);
      } catch (err) {
        setError("Failed to load history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const downloadReport = async (id: number) => {
    try {
      const response = await api.get(`report/${id}/`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `dataset_report_${id}.pdf`;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download PDF");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading history...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Upload History</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Filename</th>
              <th className="px-4 py-2">Uploaded</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Avg Flow</th>
              <th className="px-4 py-2">Avg Pressure</th>
              <th className="px-4 py-2">Avg Temp</th>
              <th className="px-4 py-2">Report</th>
            </tr>
          </thead>
          <tbody>
            {datasets.map((ds) => (
              <tr key={ds.id} className="text-center border-t">
                <td className="px-4 py-2">{ds.filename}</td>
                <td className="px-4 py-2">
                  {new Date(ds.uploaded_at).toLocaleString()}
                </td>
                <td className="px-4 py-2">{ds.total_equipment}</td>
                <td className="px-4 py-2">{ds.avg_flowrate}</td>
                <td className="px-4 py-2">{ds.avg_pressure}</td>
                <td className="px-4 py-2">{ds.avg_temperature}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => downloadReport(ds.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
