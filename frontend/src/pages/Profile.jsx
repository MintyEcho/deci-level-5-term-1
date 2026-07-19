import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api";

export default function Profile() {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.put("/auth/profile", { name, email });
      setMessage("Profile updated");
    } catch {
      setMessage("Update failed");
    }
  }

  if (!user) return <div className="mx-auto max-w-sm px-6 py-16 text-sm text-gray-500">Loading...</div>;

  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h2 className="mb-1 text-2xl font-bold text-gray-900">My Profile</h2>
      <p className="mb-6 text-sm uppercase tracking-wide text-brand-600">{user.role}</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Save
        </button>
      </form>
      {message && <p className="mt-3 text-sm text-gray-600">{message}</p>}
      <button
        onClick={logout}
        className="mt-6 text-sm font-medium text-red-600 hover:text-red-700"
      >
        Logout
      </button>
    </div>
  );
}
