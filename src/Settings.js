import React from "react";
import { useNavigate } from "react-router-dom";

function Settings({ setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Clear user data from localStorage
    navigate("/");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Settings</h2>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}

export default Settings;
