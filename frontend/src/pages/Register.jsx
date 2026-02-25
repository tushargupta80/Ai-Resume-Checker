import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "jobseeker" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role
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
        <div className="hidden bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 p-8 text-white md:block">
          <h2 className="font-['Space_Grotesk'] text-3xl font-bold">Create Profile</h2>
          <p className="mt-3 text-sm text-cyan-50">
            Join as a job seeker or recruiter and unlock AI-based scoring, matching, and role-fit guidance.
          </p>
        </div>
        <form onSubmit={submit} className="space-y-4 p-8">
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-slate-900">Register</h1>
          <input className="input-field" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="input-field" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input type="password" className="input-field" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <select className="input-field" onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="jobseeker">Job Seeker</option>
          <option value="recruiter">Recruiter</option>
          </select>
          {error && <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
          <button disabled={loading} className="btn-primary w-full">
            {loading ? "Registering..." : "Register"}
          </button>
          <Link className="text-sm font-semibold text-blue-700 hover:text-blue-900" to="/login">Already have account?</Link>
        </form>
      </div>
    </div>
  );
}
