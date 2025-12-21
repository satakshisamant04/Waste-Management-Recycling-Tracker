import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Layout from "../components/Layout";
import toast from "react-hot-toast";

function Profile() {
  const [user, setUser] = useState(null);
  const [goal, setGoal] = useState("");
  const navigate = useNavigate();

  // Protect route
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  // Fetch profile
  useEffect(() => {
    API.get("/users/profile")
      .then((res) => {
        setUser(res.data.user);
        setGoal(res.data.user.monthlyGoal || "");
      })
      .catch(() => navigate("/"));
  }, [navigate]);

  // Update goal
  const updateGoal = async () => {
    if (!goal || goal <= 0) {
      toast.error("Please enter a valid goal");
      return;
    }

    try {
      await API.put("/users/goal", { monthlyGoal: goal });
      toast.success("Monthly goal updated");
    } catch {
      toast.error("Failed to update goal");
    }
  };

  if (!user) {
    return (
      <Layout>
        <p className="text-center mt-10 text-gray-500 dark:text-gray-400">
          Loading profile...
        </p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">
          My Profile
        </h2>

        <div className="space-y-4">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Name
            </p>
            <p className="font-semibold text-lg">{user.name}</p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Email
            </p>
            <p className="font-semibold text-lg">{user.email}</p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Points
            </p>
            <p className="font-semibold text-lg text-green-600">
              {user.points}
            </p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Badge
            </p>
            <p className="font-semibold text-lg">
              {user.badge}
            </p>
          </div>

          {/* 🎯 MONTHLY GOAL */}
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
              Monthly Recycling Goal (kg)
            </p>

            <input
              type="number"
              min="1"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              placeholder="e.g. 30"
            />

            <button
              onClick={updateGoal}
              className="mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Update Goal
            </button>
          </div>
        </div>

        <button
          onClick={() => navigate("/edit-profile")}
          className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Edit Profile
        </button>

        <button
          onClick={() => navigate("/change-password")}
          className="mt-3 w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800"
        >
          Change Password
        </button>
      </div>
    </Layout>
  );
}

export default Profile;
