export default function MatchResult({ item, role }) {
  return (
    <div className="glass-card space-y-3 p-5">
      <p className="font-['Space_Grotesk'] text-xl font-semibold text-slate-900">
        {item.jobId?.title} - {item.jobId?.company}
      </p>
      {role === "recruiter" && (
        <p className="text-sm text-slate-700">
          Candidate: {item.userId?.name} ({item.userId?.email})
        </p>
      )}
      <div className="stat-tile">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Match Percentage</p>
        <p className="mt-1 text-2xl font-bold text-blue-700">{item.matchPercentage}%</p>
      </div>
      <p className="text-sm text-emerald-700"><span className="font-semibold">Matching:</span> {item.matchingSkills?.join(", ") || "-"}</p>
      <p className="text-sm text-rose-700"><span className="font-semibold">Missing:</span> {item.missingSkills?.join(", ") || "-"}</p>
      <p className="text-sm text-slate-700"><span className="font-semibold">Suggestions:</span> {item.suggestions?.join(" | ") || "-"}</p>
    </div>
  );
}
