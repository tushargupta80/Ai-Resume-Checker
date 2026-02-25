import { useEffect, useState } from "react";
import api from "../services/api";
import JobCard from "../components/JobCard";

export default function JobMatch() {
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [resumeId, setResumeId] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      const [j, r] = await Promise.all([api.get("/jobs/all"), api.get("/resume/my-resumes")]);
      setJobs(j.data);
      setResumes(r.data);
      if (r.data[0]) setResumeId(r.data[0]._id);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load jobs or resumes.");
    }
  };

  useEffect(() => { load(); }, []);

  const analyze = async (jobId) => {
    setError("");
    try {
      await api.post("/match/analyze", { resumeId, jobId });
      alert("Analysis complete. Check Results.");
      load();
    } catch (err) {
      setError(err?.response?.data?.message || "Analysis failed. Please try again.");
    }
  };

  return (
    <div className="app-shell space-y-6">
      <section className="glass-card p-6">
        <h1 className="section-title text-2xl">Job Matching</h1>
        <p className="mt-2 text-sm text-slate-600">
          Choose a resume and compare it against open jobs to get AI-powered matching and skill-gap analysis.
        </p>
        {error && <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
        <select className="input-field mt-4 max-w-sm" value={resumeId} onChange={(e) => setResumeId(e.target.value)}>
        {resumes.map((r) => <option key={r._id} value={r._id}>{r._id.slice(-6)} (score {r.resumeScore})</option>)}
        </select>
      </section>
      {resumes.length === 0 && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
          Upload at least one resume before running job match analysis.
        </p>
      )}
      {jobs.length === 0 && (
        <p className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
          No jobs available yet. Ask a recruiter account to create jobs from the Dashboard.
        </p>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        {jobs.map((j) => (
          <JobCard key={j._id} job={j} onAnalyze={analyze} disabled={!resumeId} />
        ))}
      </div>
    </div>
  );
}
