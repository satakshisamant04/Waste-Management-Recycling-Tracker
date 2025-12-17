import { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

function AddWaste({ onAdded }) {
  const [form, setForm] = useState({
    type: "",
    quantity: "",
    recycled: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.type || !form.quantity) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await API.post("/waste/add", form);
      toast.success("Waste added successfully");
      setForm({ type: "", quantity: "", recycled: false });
      onAdded();
    } catch {
      toast.error("Failed to add waste");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Add Waste</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          className="w-full p-2 rounded border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="">Select waste type</option>
          <option value="plastic">Plastic</option>
          <option value="organic">Organic</option>
          <option value="metal">Metal</option>
          <option value="paper">Paper</option>
        </select>

        <input
          type="number"
          className="w-full p-2 rounded border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          placeholder="Quantity (kg)"
          value={form.quantity}
          onChange={(e) =>
            setForm({ ...form, quantity: e.target.value })
          }
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.recycled}
            onChange={(e) =>
              setForm({ ...form, recycled: e.target.checked })
            }
          />
          Mark as recycled
        </label>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Waste
        </button>
      </form>
    </div>
  );
}

export default AddWaste;
