import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const HOME_BY_ROLE = {
  citizen: "/citizen",
  admin: "/admin",
  manager: "/manager",
  worker: "/worker",
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.full_name}!`);
      navigate(HOME_BY_ROLE[user.role] || "/login");
    } catch (err) {
      toast.error(err.response?.data?.non_field_errors?.[0] || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow w-full max-w-sm">
        <h1 className="text-2xl font-bold text-primary mb-1">Punjab Waste Complaint System</h1>
        <p className="text-sm text-gray-500 mb-6">Sign in to your account</p>

        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          required
          className="w-full border rounded px-3 py-2 mb-4"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          required
          className="w-full border rounded px-3 py-2 mb-2"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <div className="text-right mb-4">
          <Link to="/forgot-password" className="text-sm text-secondary">Forgot password?</Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white rounded py-2 font-semibold disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Don't have an account? <Link to="/register" className="text-secondary font-medium">Register</Link>
        </p>
      </form>
    </div>
  );
}
