import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HOME_BY_ROLE = {
  citizen: "/citizen",
  admin: "/admin",
  manager: "/manager",
  worker: "/worker",
};

export default function RoleRoute({ allowed, children }) {
  const { user } = useAuth();
  if (!allowed.includes(user.role)) {
    return <Navigate to={HOME_BY_ROLE[user.role] || "/login"} replace />;
  }
  return children;
}
