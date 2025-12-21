import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

function WasteHistory() {
  const [waste, setWaste] = useState([]);
  const [type, setType] = useState("");
  const [recycled, setRecycled] = useState("");

  const fetchHistory = () => {
    API.get("waste/history", {
      params: {
        type: type || undefined,
        recycled: recycled || undefined,
      },
    }).then((res) => setWaste(res.data));
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6">📜 Waste History</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="p-2 border rounded dark:bg-gray-800"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="plastic">Plastic</option>
          <option value="organic">Organic</option>
          <option value="metal">Metal</option>
          <option value="paper">Paper</option>
        </select>

        <select
          className="p-2 border rounded dark:bg-gray-800"
          value={recycled}
          onChange={(e) => setRecycled(e.target.value)}
        >
          <option value="">All</option>
          <option value="true">Recycled</option>
          <option value="false">Not Recycled</option>
        </select>

        <button
          onClick={fetchHistory}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Apply Filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b dark:border-gray-700">
            <tr>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Quantity (kg)</th>
              <th className="p-3 text-left">Recycled</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {waste.map((w) => (
              <tr key={w._id} className="border-b dark:border-gray-700">
                <td className="p-3 capitalize">{w.type}</td>
                <td className="p-3">{w.quantity}</td>
                <td className="p-3">
                  {w.recycled ? "✅ Yes" : "❌ No"}
                </td>
                <td className="p-3">
                  {new Date(w.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {waste.length === 0 && (
          <p className="text-center p-4 text-gray-500">
            No waste records found
          </p>
        )}
      </div>
    </Layout>
  );
}

export default WasteHistory;
