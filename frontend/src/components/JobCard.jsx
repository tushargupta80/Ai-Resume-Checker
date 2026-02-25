export default function JobCard({ job, onAnalyze, disabled }) {
  return (
    <div className="glass-card p-5">
      <h3 className="font-['Space_Grotesk'] text-xl font-semibold text-slate-900">{job.title}</h3>
      <p className="mt-1 text-sm font-semibold text-blue-700">{job.company}</p>
      <p className="mt-3 text-sm text-slate-600">{job.description.slice(0, 180)}...</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {(job.requiredSkills?.length ? job.requiredSkills : ["N/A"]).map((skill) => (
          <span key={`${job._id}-${skill}`} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
            {skill}
          </span>
        ))}
      </div>
      {onAnalyze && (
        <button
          onClick={() => onAnalyze(job._id)}
          disabled={disabled}
          className="btn-primary mt-4 w-full"
        >
          Analyze Match
        </button>
      )}
    </div>
  );
}
