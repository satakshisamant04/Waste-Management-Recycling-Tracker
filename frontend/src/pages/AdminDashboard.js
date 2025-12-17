import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Layout from "../components/Layout";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/users/profile").then((res) => {
      if (res.data.user.role !== "admin") {
        navigate("/dashboard");
      }
    });

    API.get("/admin/users").then((res) => setUsers(res.data));
    API.get("/admin/stats").then((res) => setStats(res.data));
    API.get("/admin/leaderboard").then((res) =>
      setLeaderboard(res.data)
    );
  }, [navigate]);

  if (!stats) {
    return (
      <Layout>
        <p className="text-center mt-10 text-gray-500 dark:text-gray-400">
          Loading admin dashboard...
        </p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6">
        🧑‍💼 Admin Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Total Waste
          </p>
          <p className="text-2xl font-semibold">
            {stats.totalWaste} kg
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Recycled Waste
          </p>
          <p className="text-2xl font-semibold">
            {stats.recycledWaste} kg
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6">
        <h3 className="font-semibold mb-3">🏆 Leaderboard</h3>
        {leaderboard.map((u, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span>{u.name}</span>
            <span>{u.points} pts</span>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="font-semibold mb-3">All Users</h3>
        {users.map((u) => (
          <p key={u._id} className="text-sm">
            {u.name} – {u.email}
          </p>
        ))}
      </div>
    </Layout>
  );
}

export default AdminDashboard;
