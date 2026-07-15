import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_LINKS = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/complaints", label: "All Complaints" },
  { to: "/admin/users", label: "Manage Users & Teams" },
  { to: "/admin/analytics", label: "Analytics" },
  { to: "/admin/reports", label: "Reports" },
  { to: "/admin/profile", label: "Profile" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-primary text-white flex flex-col">
        <div className="p-4 text-lg font-bold border-b border-white/20">Admin Portal</div>
        <nav className="flex-1 p-2 space-y-1">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `block px-3 py-2 rounded ${isActive ? "bg-white/20 font-semibold" : "hover:bg-white/10"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/20 text-sm">
          <div className="mb-2">{user?.full_name}</div>
          <button onClick={logout} className="w-full bg-white/10 hover:bg-white/20 rounded px-3 py-2">
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
