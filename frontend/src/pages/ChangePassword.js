import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Layout from "../components/Layout";
import toast from "react-hot-toast";

function ChangePassword() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.oldPassword || !form.newPassword) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await API.put("/users/change-password", form);
      toast.success("Password changed. Please login again.");

      localStorage.clear();
      navigate("/");
    } catch (error) {
      toast.error("Password change failed");
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Change Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600"
            placeholder="Old Password"
            onChange={(e) =>
              setForm({ ...form, oldPassword: e.target.value })
            }
          />

          <input
            type="password"
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600"
            placeholder="New Password"
            onChange={(e) =>
              setForm({ ...form, newPassword: e.target.value })
            }
          />

          <button className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
            Update Password
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default ChangePassword;
