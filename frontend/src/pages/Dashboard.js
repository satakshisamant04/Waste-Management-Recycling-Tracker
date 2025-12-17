import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Layout from "../components/Layout";
import AddWaste from "../components/AddWaste";
import RecentActivity from "../components/RecentActivity";
import WasteChart from "../components/WasteChart";

function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [profile, setProfile] = useState(null);
  const [refreshActivity, setRefreshActivity] = useState(0);
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName");

  // Protect dashboard route
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  const fetchAnalytics = () => {
    API.get("/waste/analytics").then((res) =>
      setAnalytics(res.data)
    );
  };

  const fetchProfile = () => {
    API.get("/users/profile").then((res) =>
      setProfile(res.data.user)
    );
  };

  useEffect(() => {
    fetchAnalytics();
    fetchProfile();
  }, []);

  if (!analytics || !profile) {
    return (
      <Layout>
        <p className="text-center mt-10 text-gray-500 dark:text-gray-400">
          Loading dashboard...
        </p>
      </Layout>
    );
  }

  // ✅ Recycling percentage calculation
  const recyclingPercentage =
    analytics.totalWaste > 0
      ? ((analytics.recycledWaste / analytics.totalWaste) * 100).toFixed(1)
      : 0;

  return (
    <Layout>
      {/* ✅ Welcome Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          👋 Welcome back, {userName || "User"}
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Thanks for making the planet greener 🌱
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* Total Waste */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Total Waste
          </p>
          <p className="text-3xl font-semibold text-green-600">
            {analytics.totalWaste} kg
          </p>
        </div>

        {/* Recycled Waste */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Recycled Waste
          </p>
          <p className="text-3xl font-semibold text-blue-600">
            {analytics.recycledWaste} kg
          </p>
        </div>

        {/* Recycling Percentage */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Recycling Rate
          </p>
          <p className="text-3xl font-semibold text-purple-600">
            {recyclingPercentage}%
          </p>
        </div>

        {/* Points */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Points
          </p>
          <p className="text-3xl font-semibold text-yellow-500">
            {profile.points}
          </p>
        </div>
      </div>

      {/* Add Waste */}
      <AddWaste
        onAdded={() => {
          fetchAnalytics();
          fetchProfile();
          setRefreshActivity((p) => p + 1);
        }}
      />

      {/* Recent Activity */}
      <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded shadow">
        <RecentActivity refresh={refreshActivity} />
      </div>

      {/* Chart */}
      <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded shadow">
        <WasteChart typeStats={analytics.typeStats} />
      </div>
    </Layout>
  );
}

export default Dashboard;
