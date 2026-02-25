export default function ResumeCard({ resume }) {
  return (
    <div className="glass-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-['Space_Grotesk'] text-xl font-semibold">Resume</p>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
          {new Date(resume.createdAt).toLocaleDateString()}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="stat-tile">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Score</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{resume.resumeScore}</p>
        </div>
        <div className="stat-tile">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">ATS</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{resume.atsScore}</p>
        </div>
      </div>
      <a
        href={`${import.meta.env.VITE_API_URL.replace("/api", "")}${resume.fileUrl}`}
        target="_blank"
        className="mt-4 inline-flex rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
      >
        View PDF
      </a>
    </div>
  );
}
