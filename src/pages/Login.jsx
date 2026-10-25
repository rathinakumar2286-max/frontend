import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { errorMessage } from "../services/api";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form);
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth">
      <form className="auth-card" onSubmit={onSubmit} noValidate>
        <h1>Log in</h1>
        {location.state?.from && <p className="muted">Log in to add items to your cart and check out.</p>}
        {error && <p className="form-error" role="alert">{error}</p>}
        <label>
          Email or mobile number
          <input value={form.identifier} onChange={set("identifier")} autoComplete="username" autoFocus required />
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={set("password")} autoComplete="current-password" required />
        </label>
        <button className="btn btn-block" disabled={submitting}>
          {submitting ? "Logging in…" : "Log in"}
        </button>
        <p className="auth-alt">
          New here? <Link to="/register" state={location.state}>Create an account</Link>
        </p>
      </form>
    </div>
  );
}
