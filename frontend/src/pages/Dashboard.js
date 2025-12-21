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
  const [community, setCommunity] = useState(null);
  const [refreshActivity, setRefreshActivity] = useState(0);
  const [range, setRange] = useState("all");

  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");

  // 🔐 Protect route
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  // 📊 Fetch analytics
  const fetchAnalytics = async () => {
    const res = await API.get("/waste/analytics", {
      params: { range },
    });
    setAnalytics(res.data);
  };

  // 👤 Fetch profile
  const fetchProfile = async () => {
    const res = await API.get("/users/profile");
    setProfile(res.data.user);
  };

  // 🌍 Community comparison
  const fetchCommunity = async () => {
    const res = await API.get("/waste/community");
    setCommunity(res.data);
  };

  useEffect(() => {
    fetchAnalytics();
    fetchProfile();
    fetchCommunity();
  }, [range]);

  if (!analytics || !profile) {
    return (
      <Layout>
        <p className="text-center mt-10 text-gray-500 dark:text-gray-400">
          Loading dashboard...
        </p>
      </Layout>
    );
  }

  // ♻ Recycling %
  const recyclingPercentage =
    analytics.totalWaste > 0
      ? ((analytics.recycledWaste / analytics.totalWaste) * 100).toFixed(1)
      : 0;

  // 🎯 Goal progress
  const progress = Math.min(
    (analytics.recycledWaste / analytics.monthlyGoal) * 100,
    100
  );

  // 📥 Export CSV
  const downloadCSV = async () => {
    try {
      const res = await API.get("/waste/export", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "waste-report.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("Failed to download report");
    }
  };

  return (
    <Layout>
      {/* 👋 Welcome */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          👋 Welcome back, {userName || "User"}
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Thanks for making the planet greener 🌱
        </p>
      </div>

      {/* 🎛 Controls */}
      <div className="mb-4 flex flex-wrap gap-3">
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="p-2 border rounded dark:bg-gray-800"
        >
          <option value="all">All Time</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>

        <button
          onClick={downloadCSV}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          📥 Download Report
        </button>
      </div>

      {/* 🎯 Monthly Goal */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Monthly Recycling Goal
        </p>

        <p className="font-semibold mb-2">
          {analytics.recycledWaste} / {analytics.monthlyGoal} kg
        </p>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="bg-green-600 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {analytics.goalAchieved && (
          <p className="text-green-500 mt-2">
            🎉 Goal achieved! Bonus points added
          </p>
        )}
      </div>

      {/* 🌍 Environmental Impact */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-3">
          🌍 Environmental Impact
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              CO₂ Saved
            </p>
            <p className="text-2xl font-bold text-green-500">
              {analytics.co2Saved} kg
            </p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Trees Equivalent
            </p>
            <p className="text-2xl font-bold text-emerald-400">
              🌳 {analytics.treesEquivalent}
            </p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Car Emissions Reduced
            </p>
            <p className="text-2xl font-bold text-blue-500">
              🚗 {((analytics.co2Saved / 4600) * 100).toFixed(0)}%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              of a car’s yearly emissions
            </p>
          </div>
        </div>
      </div>

      {/* 🌍 Community Comparison ⭐⭐⭐⭐ */}
      {community && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6">
          <h3 className="text-lg font-semibold mb-3">
            🌍 Community Comparison
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your recycling rate
          </p>
          <p className="text-xl font-semibold text-green-600">
            {community.userRate}%
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Community average
          </p>
          <p className="text-lg font-semibold text-blue-500">
            {community.communityAvg}%
          </p>

          <p className="mt-3 text-sm text-green-500">
            🎉 You’re doing better than{" "}
            <span className="font-bold">
              {community.percentile}%
            </span>{" "}
            of users
          </p>
        </div>
      )}

      {/* 📊 Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Total Waste
          </p>
          <p className="text-3xl font-semibold text-green-600">
            {analytics.totalWaste} kg
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Recycled Waste
          </p>
          <p className="text-3xl font-semibold text-blue-600">
            {analytics.recycledWaste} kg
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Recycling Rate
          </p>
          <p className="text-3xl font-semibold text-purple-600">
            {recyclingPercentage}%
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Points
          </p>
          <p className="text-3xl font-semibold text-yellow-500">
            {profile.points}
          </p>
        </div>
      </div>

      {/* ➕ Add Waste */}
      <AddWaste
        onAdded={() => {
          fetchAnalytics();
          fetchProfile();
          fetchCommunity();
          setRefreshActivity((p) => p + 1);
        }}
      />

      {/* 🕒 Recent Activity */}
      <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded shadow">
        <RecentActivity refresh={refreshActivity} />
      </div>

      {/* 📈 Chart */}
      <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded shadow">
        <WasteChart typeStats={analytics.typeStats} />
      </div>
    </Layout>
  );
}

export default Dashboard;
