import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function NavBar() {
  const { token, user, logout } = useAuth();

  const linkClass = "text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors";

  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/80 px-6 py-4 backdrop-blur">
      <Link to="/" className="text-lg font-bold text-brand-600">
        Shop
      </Link>
      <div className="flex items-center gap-6">
        <Link to="/products" className={linkClass}>
          Products
        </Link>
        {token && (
          <Link to="/cart" className={linkClass}>
            Cart
          </Link>
        )}
        {token && (
          <Link to="/profile" className={linkClass}>
            Profile
          </Link>
        )}
        {user?.role === "admin" && (
          <Link to="/admin" className={linkClass}>
            Admin
          </Link>
        )}
        {!token && (
          <Link to="/login" className={linkClass}>
            Login
          </Link>
        )}
        {!token && (
          <Link
            to="/register"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
          >
            Register
          </Link>
        )}
        {token && (
          <button
            onClick={logout}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
