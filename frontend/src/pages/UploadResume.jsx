import { useEffect, useState } from "react";
import api from "../services/api";
import ResumeCard from "../components/ResumeCard";

export default function UploadResume() {
  const [file, setFile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data } = await api.get("/resume/my-resumes");
    setResumes(data);
  };

  useEffect(() => { load(); }, []);

  const upload = async (e) => {
    e.preventDefault();
    setError("");
    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    const form = new FormData();
    form.append("resume", file);
    setLoading(true);
    try {
      await api.post("/resume/upload", form);
      setFile(null);
      load();
    } catch (err) {
      setError(err?.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell space-y-6">
      <form onSubmit={upload} className="glass-card p-6">
        <h1 className="section-title text-2xl">Upload Resume</h1>
        <p className="mt-2 text-sm text-slate-600">Upload PDF resumes to extract text, run ATS analysis, and improve your match score.</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input className="input-field file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-semibold file:text-blue-700" type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0])} />
          <button disabled={loading} className="btn-primary sm:w-auto">
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
        {error && <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
      </form>
      <div className="grid md:grid-cols-2 gap-4">
        {resumes.map((r) => <ResumeCard key={r._id} resume={r} />)}
      </div>
    </div>
  );
}
