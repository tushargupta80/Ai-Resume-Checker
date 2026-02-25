import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import JobCard from "../components/JobCard";

export default function Dashboard() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [matches, setMatches] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [jobForm, setJobForm] = useState({ title: "", company: "", description: "", requiredSkills: "" });

  const load = async () => {
    if (user.role === "jobseeker") {
      const [r, m] = await Promise.all([api.get("/resume/my-resumes"), api.get("/match/results")]);
      setResumes(r.data);
      setMatches(m.data);
    } else {
      const [j, m] = await Promise.all([api.get("/jobs/all"), api.get("/match/results")]);
      setJobs(j.data);
      setMatches(m.data);
    }
  };

  useEffect(() => { load(); }, []);

  const createJob = async (e) => {
    e.preventDefault();
    await api.post("/jobs/create", {
      ...jobForm,
      requiredSkills: jobForm.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean)
    });
    setJobForm({ title: "", company: "", description: "", requiredSkills: "" });
    load();
  };

  const latestResume = resumes[0];
  const latestMatch = matches[0];

  const chartData = [
    { name: "Resume Score", value: latestResume?.resumeScore || 0 },
    { name: "ATS Score", value: latestResume?.atsScore || 0 },
    { name: "Match %", value: latestMatch?.matchPercentage || 0 }
  ];

  return (
    <div className="app-shell space-y-6">
      <section className="glass-card p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Overview</p>
        <h1 className="section-title mt-2">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">
          Signed in as <span className="font-semibold text-slate-800">{user.role}</span>.
        </p>
      </section>

      {user.role === "jobseeker" && (
        <section className="glass-card p-6">
          <div className="mb-5 grid gap-3 sm:grid-cols-3">
            {chartData.map((item) => (
              <div key={item.name} className="stat-tile">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.name}</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>
          <h2 className="mb-2 font-['Space_Grotesk'] text-xl font-semibold">Performance Overview</h2>
          <div className="h-72 rounded-xl border border-slate-200 bg-white p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="value" fill="#0f5eff" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {user.role === "recruiter" && (
        <form onSubmit={createJob} className="glass-card space-y-3 p-6">
          <h2 className="font-['Space_Grotesk'] text-2xl font-semibold">Post Job</h2>
          <input className="input-field" placeholder="Title" value={jobForm.title} onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })} />
          <input className="input-field" placeholder="Company" value={jobForm.company} onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })} />
          <textarea className="input-field min-h-[120px]" placeholder="Description" value={jobForm.description} onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })} />
          <input className="input-field" placeholder="Required skills (comma separated)" value={jobForm.requiredSkills} onChange={(e) => setJobForm({ ...jobForm, requiredSkills: e.target.value })} />
          <button className="btn-primary">Create Job</button>
        </form>
      )}

      {user.role === "recruiter" && (
        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((j) => <JobCard key={j._id} job={j} />)}
        </div>
      )}
    </div>
  );
}
