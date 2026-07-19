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

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h2>My Profile</h2>
      <p>Role: {user.role}</p>
      <form onSubmit={handleSubmit}>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit">Save</button>
      </form>
      {message && <p>{message}</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
