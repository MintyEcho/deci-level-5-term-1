import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function NavBar() {
  const { token, user, logout } = useAuth();

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/products">Products</Link>
      {token && <Link to="/cart">Cart</Link>}
      {token && <Link to="/profile">Profile</Link>}
      {user?.role === "admin" && <Link to="/admin">Admin</Link>}
      {!token && <Link to="/login">Login</Link>}
      {!token && <Link to="/register">Register</Link>}
      {token && <button onClick={logout}>Logout</button>}
    </nav>
  );
}
