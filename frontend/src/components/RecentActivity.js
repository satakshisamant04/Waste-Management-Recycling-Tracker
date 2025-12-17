import { useEffect, useState } from "react";
import API from "../services/api";

function RecentActivity({ refresh }) {
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    API.get("/waste/activity")
      .then((res) => setActivity(res.data))
      .catch(() => {});
  }, [refresh]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        Recent Activity
      </h3>

      {activity.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No recent activity yet
        </p>
      ) : (
        <ul className="space-y-3">
          {activity.map((item) => (
            <li
              key={item.id}
              className="p-3 rounded bg-gray-100 dark:bg-gray-700"
            >
              <p className="text-sm">{item.message}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(item.date).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RecentActivity;
