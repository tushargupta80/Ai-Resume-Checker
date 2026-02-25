const { validationResult } = require("express-validator");
const Job = require("../models/Job");

exports.createJob = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, company, description, requiredSkills = [] } = req.body;
    const skills = Array.isArray(requiredSkills)
      ? requiredSkills
      : String(requiredSkills)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

    const job = await Job.create({
      recruiterId: req.user.id,
      title,
      company,
      description,
      requiredSkills: skills
    });

    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
};

exports.getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
};
