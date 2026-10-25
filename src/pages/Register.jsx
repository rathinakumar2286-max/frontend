import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { errorMessage } from "../services/api";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form);
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
        <h1>Create your account</h1>
        {error && <p className="form-error" role="alert">{error}</p>}
        <label>
          Full name
          <input value={form.name} onChange={set("name")} autoComplete="name" autoFocus required />
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={set("email")} autoComplete="email" required />
        </label>
        <label>
          Mobile number <span className="muted">(optional)</span>
          <input type="tel" value={form.mobile} onChange={set("mobile")} autoComplete="tel" />
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={set("password")} autoComplete="new-password" minLength={8} required />
          <span className="muted small">At least 8 characters</span>
        </label>
        <button className="btn btn-block" disabled={submitting}>
          {submitting ? "Creating account…" : "Create account"}
        </button>
        <p className="auth-alt">
          Already registered? <Link to="/login" state={location.state}>Log in</Link>
        </p>
      </form>
    </div>
  );
}
