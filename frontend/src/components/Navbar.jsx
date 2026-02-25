import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition ${
      isActive ? "bg-blue-100 text-blue-700" : "text-slate-700 hover:bg-slate-100"
    }`;

  return (
    <nav className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-slate-900">
          AI Resume Analyzer
        </Link>
        {user && (
          <div className="flex items-center gap-1 md:gap-2">
            <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
            {user.role === "jobseeker" && <NavLink to="/upload" className={linkClass}>Upload Resume</NavLink>}
            {user.role === "jobseeker" && <NavLink to="/jobs" className={linkClass}>Job Match</NavLink>}
            <NavLink to="/results" className={linkClass}>Results</NavLink>
            <button className="btn-primary ml-2 px-3 py-2" onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
