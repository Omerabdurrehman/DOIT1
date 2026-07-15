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
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-primary text-white md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <div className="text-sm font-semibold">Admin Portal</div>
            <div className="text-xs text-white/80">Operations dashboard</div>
          </div>
          <div className="text-right text-xs">
            <div className="font-medium">{user?.full_name}</div>
            <button onClick={logout} className="mt-1 text-white/80 underline">
              Logout
            </button>
          </div>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-3 pb-3">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-3 py-2 text-sm ${isActive ? "bg-white/20 font-semibold" : "bg-white/10"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <div className="flex flex-col md:flex-row">
        <aside className="hidden w-64 flex-col bg-primary text-white md:flex md:min-h-screen">
          <div className="border-b border-white/20 p-4 text-lg font-bold">Admin Portal</div>
          <nav className="flex-1 space-y-1 p-2">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `block rounded px-3 py-2 ${isActive ? "bg-white/20 font-semibold" : "hover:bg-white/10"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="border-t border-white/20 p-4 text-sm">
            <div className="mb-2">{user?.full_name}</div>
            <button onClick={logout} className="w-full rounded bg-white/10 px-3 py-2 hover:bg-white/20">
              Log out
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
