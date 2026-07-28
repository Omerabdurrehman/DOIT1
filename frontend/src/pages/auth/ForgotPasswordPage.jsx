import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "../../services/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow w-full max-w-sm">
        <h1 className="text-xl font-bold text-primary mb-4">Reset your password</h1>
        {sent ? (
          <p className="text-sm text-gray-600">
            If an account exists for that email, a reset link has been sent.
          </p>
        ) : (
          <>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full border rounded px-3 py-2 mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="w-full bg-primary text-white rounded py-2 font-semibold">
              Send reset link
            </button>
          </>
        )}
        <p className="text-sm text-gray-500 mt-4 text-center">
          <Link to="/login" className="text-secondary font-medium">Back to login</Link>
        </p>
      </form>
    </div>
  );
}
