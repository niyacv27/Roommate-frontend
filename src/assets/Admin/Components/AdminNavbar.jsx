import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../ContextAPI/AuthContext";
import { useApp } from "../../../ContextAPI/AppContext";

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const { darkMode, setDarkMode, notifications } = useApp();
  const navigate = useNavigate();

  const unread = notifications.filter((n) => !n.read).length;

  const logoutUser = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">

      <div className="container-page flex min-h-16 items-center justify-between gap-4">

        {/* Admin Logo */}
        <Link to="/admin" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-700 text-lg text-white">
            R
          </span>

          <span className="text-lg font-black text-slate-900 dark:text-white">
            RoomMate{" "}
            <span className="text-teal-600">Radar</span>
          </span>
        </Link>

        {/* Admin Navigation */}
        <nav className="hidden items-center gap-5 md:flex">

          <NavLink
            to="/admin"
            className="text-sm font-semibold text-slate-600 hover:text-teal-700 dark:text-slate-300"
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/rooms"
            className="text-sm font-semibold text-slate-600 hover:text-teal-700 dark:text-slate-300"
          >
            Room Approvals
          </NavLink>

          <NavLink
            to="/admin/users"
            className="text-sm font-semibold text-slate-600 hover:text-teal-700 dark:text-slate-300"
          >
            Users
          </NavLink>

        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2">

          {/* Dark Mode */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700"
          >
            {darkMode ? "☀ Light" : "☾ Dark"}
          </button>

          {/* Notifications */}
          <Link
            to="/notifications"
            className="relative rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700"
          >
            🔔

            {unread > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] text-white">
                {unread}
              </span>
            )}
          </Link>

          {/* Admin Name */}
          <span className="hidden rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold dark:bg-slate-800 sm:block">
            {user?.name || "Platform Admin"}
          </span>

          {/* Logout */}
          <button
            onClick={logoutUser}
            className="rounded-lg bg-teal-700 px-3 py-2 text-sm font-bold text-white hover:bg-teal-800"
          >
            Logout
          </button>

        </div>
      </div>
    </header>
  );
}