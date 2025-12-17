import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Layout from "../components/Layout";
import toast from "react-hot-toast";

function EditProfile() {
  const [form, setForm] = useState({ name: "", email: "" });
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/users/profile").then((res) => {
      setForm({
        name: res.data.user.name,
        email: res.data.user.email,
      });
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.put("/users/update", form);
      localStorage.setItem("userName", form.name);
      toast.success("Profile updated");
      navigate("/profile");
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600"
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <button className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
            Save Changes
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default EditProfile;
