import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({
        email: form.email.trim(),
        password: form.password
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell flex min-h-[calc(100vh-72px)] items-center justify-center">
      <div className="glass-card grid w-full max-w-4xl overflow-hidden md:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-8 text-white md:block">
          <h2 className="font-['Space_Grotesk'] text-3xl font-bold">Welcome Back</h2>
          <p className="mt-3 text-sm text-blue-50">
            Continue your AI-powered resume optimization and track job matching insights in one place.
          </p>
        </div>
        <form onSubmit={submit} className="space-y-4 p-8">
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-slate-900">Login</h1>
          <input className="input-field" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input type="password" className="input-field" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error && <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
          <button disabled={loading} className="btn-primary w-full">
            {loading ? "Logging in..." : "Login"}
          </button>
          <Link className="text-sm font-semibold text-blue-700 hover:text-blue-900" to="/register">Create account</Link>
        </form>
      </div>
    </div>
  );
}
