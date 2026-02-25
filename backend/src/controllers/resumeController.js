const fs = require("fs/promises");
const Resume = require("../models/Resume");
const { extractResumeText } = require("../services/resumeTextService");

exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "PDF file is required" });

    const buffer = await fs.readFile(req.file.path);
    let extractedText = "";
    try {
      extractedText = await extractResumeText(buffer);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }

    const resume = await Resume.create({
      userId: req.user.id,
      fileUrl: `/uploads/${req.file.filename}`,
      extractedText
    });

    res.status(201).json(resume);
  } catch (err) {
    next(err);
  }
};

exports.getMyResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(resumes);
  } catch (err) {
    next(err);
  }
};
