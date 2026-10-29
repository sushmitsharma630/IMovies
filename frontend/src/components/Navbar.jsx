import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark px-3">
      <Link className="navbar-brand fw-bold" to="/">🎬 IMovies</Link>
      <div className="ms-auto d-flex align-items-center gap-2">
        {user ? (
          <>
            <Link className="btn btn-outline-light btn-sm" to="/my-bookings">My Bookings</Link>
            <span className="text-light small d-none d-sm-inline">Hi, {user.name}</span>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="btn btn-outline-light btn-sm" to="/login">Login</Link>
            <Link className="btn btn-warning btn-sm" to="/register">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
