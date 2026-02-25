import { useEffect, useState } from "react";
import api from "../services/api";
import MatchResult from "../components/MatchResult";
import { useAuth } from "../context/AuthContext";

export default function Results() {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/match/results")
      .then((res) => setResults(res.data))
      .catch((err) => setError(err?.response?.data?.message || "Unable to load results."));
  }, []);

  return (
    <div className="app-shell space-y-6">
      <section className="glass-card p-6">
        <h1 className="section-title text-2xl">Match Results</h1>
        <p className="mt-2 text-sm text-slate-600">
          View analyzed matches, skill alignment, and improvement guidance.
        </p>
      </section>
      {error && <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
      {results.length === 0 && !error && (
        <p className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
          No match results yet. Run analysis from Job Match to populate this page.
        </p>
      )}
      <div className="grid gap-4">
        {results.map((item) => <MatchResult key={item._id} item={item} role={user.role} />)}
      </div>
    </div>
  );
}
