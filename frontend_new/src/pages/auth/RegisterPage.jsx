import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "../../services/authService";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "", email: "", phone_number: "", password: "", confirm_password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.register(form);
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (err) {
      const data = err.response?.data;
      toast.error(data ? Object.values(data).flat().join(" ") : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow w-full max-w-md">
        <h1 className="text-2xl font-bold text-primary mb-6">Create a Citizen Account</h1>

        {[
          ["full_name", "Full Name", "text"],
          ["email", "Email", "email"],
          ["phone_number", "Phone Number", "text"],
          ["password", "Password", "password"],
          ["confirm_password", "Confirm Password", "password"],
        ].map(([name, label, type]) => (
          <div key={name} className="mb-4">
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input
              type={type}
              name={name}
              required
              className="w-full border rounded px-3 py-2"
              value={form[name]}
              onChange={handleChange}
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white rounded py-2 font-semibold disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Already have an account? <Link to="/login" className="text-secondary font-medium">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
