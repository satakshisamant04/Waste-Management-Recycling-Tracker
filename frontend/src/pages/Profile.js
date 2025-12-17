import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Layout from "../components/Layout";

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    API.get("/users/profile")
      .then((res) => setUser(res.data.user))
      .catch(() => navigate("/"));
  }, [navigate]);

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
