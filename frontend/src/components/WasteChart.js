import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function WasteChart({ typeStats }) {
  if (!typeStats) return null;

  const data = {
    labels: Object.keys(typeStats),
    datasets: [
      {
        data: Object.values(typeStats),
        backgroundColor: [
          "#22c55e",
          "#3b82f6",
          "#f59e0b",
          "#ef4444",
        ],
      },
    ],
  };

  return <Pie data={data} />;
}

export default WasteChart;
