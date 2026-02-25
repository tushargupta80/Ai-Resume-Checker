const { body } = require("express-validator");

exports.analyzeValidator = [
  body("resumeId").notEmpty().withMessage("resumeId is required"),
  body("jobId").notEmpty().withMessage("jobId is required")
];
