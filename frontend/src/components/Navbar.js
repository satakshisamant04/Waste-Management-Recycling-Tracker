import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const userName = localStorage.getItem("userName") || "User";
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b dark:border-gray-700 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <h1
          onClick={() => navigate("/dashboard")}
          className="text-xl font-bold text-green-600 cursor-pointer"
        >
          🌱 Waste Tracker
        </h1>

        {/* Right Section */}
        <div className="relative">
          {/* Avatar Button */}
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <div className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden md:block text-gray-700 dark:text-gray-300 font-medium">
              {userName}
            </span>
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-3 w-52 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700">
              
              {/* Profile */}
              <button
                onClick={() => {
                  navigate("/profile");
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                👤 Profile
              </button>

              {/* Admin Dashboard */}
              {isAdmin && (
                <button
                  onClick={() => {
                    navigate("/admin");
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  🧑‍💼 Admin Dashboard
                </button>
              )}

              {/* Divider */}
              <div className="border-t dark:border-gray-700 my-1"></div>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
              </button>

<button
  onClick={() => {
    navigate("/history");
    setOpen(false);
  }}
  className="w-full text-left px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
>
  📜 Waste History
</button>


              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
