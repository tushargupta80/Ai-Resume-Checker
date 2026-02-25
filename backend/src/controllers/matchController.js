const { validationResult } = require("express-validator");
const Resume = require("../models/Resume");
const Job = require("../models/Job");
const Match = require("../models/Match");
const { analyzeResumeAgainstJob } = require("../services/grokService");

exports.analyze = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { resumeId, jobId } = req.body;
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user.id });
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const ai = await analyzeResumeAgainstJob({
      resumeText: resume.extractedText,
      jobDescription: job.description
    });

    resume.resumeScore = ai.resumeScore || 0;
    resume.atsScore = ai.atsScore || 0;
    await resume.save();

    const match = await Match.create({
      userId: req.user.id,
      jobId: job._id,
      matchPercentage: ai.matchPercentage || 0,
      matchingSkills: ai.matchingSkills || [],
      missingSkills: ai.missingSkills || [],
      suggestions: ai.suggestions || []
    });

    res.status(201).json({
      match,
      analysis: {
        extractedSkills: ai.extractedSkills || [],
        resumeScore: ai.resumeScore || 0,
        atsScore: ai.atsScore || 0,
        matchPercentage: ai.matchPercentage || 0,
        matchingSkills: ai.matchingSkills || [],
        missingSkills: ai.missingSkills || [],
        suggestions: ai.suggestions || [],
        rewrittenBulletPoints: ai.rewrittenBulletPoints || [],
        careerRecommendations: ai.careerRecommendations || []
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getResults = async (req, res, next) => {
  try {
    if (req.user.role === "jobseeker") {
      const results = await Match.find({ userId: req.user.id })
        .populate("jobId")
        .sort({ createdAt: -1 });
      return res.json(results);
    }

    const jobs = await Job.find({ recruiterId: req.user.id }).select("_id");
    const jobIds = jobs.map((j) => j._id);
    const results = await Match.find({ jobId: { $in: jobIds } })
      .populate("userId", "name email")
      .populate("jobId", "title company")
      .sort({ createdAt: -1 });

    res.json(results);
  } catch (err) {
    next(err);
  }
};
