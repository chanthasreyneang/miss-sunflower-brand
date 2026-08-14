import { useState } from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { getAuthErrorMessage } from "../utils/authErrors";
import "./Auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const { resetPassword } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <h2>Reset Password</h2>
        <p className="auth-card-subtitle">We'll email you a link to reset your password.</p>

        {sent ? (
          <div className="text-center">
            <FiCheckCircle style={{ fontSize: 40, color: "var(--color-success)", marginBottom: 12 }} />
            <p>
              If an account exists for <strong>{email}</strong>, a reset link is on its way.
              Check your inbox (and spam folder).
            </p>
            <Link to="/login" className="btn btn-primary btn-block" style={{ marginTop: 12 }}>
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your account email"
              />
            </div>

            {error && <p className="form-error" style={{ marginBottom: 16 }}>{error}</p>}

            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? "Sending..." : "Send Reset Link"}
            </button>

            <p className="auth-footer-link">
              Remembered your password? <Link to="/login">Sign In</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
