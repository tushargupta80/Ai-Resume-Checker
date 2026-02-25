const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    matchPercentage: { type: Number, required: true },
    matchingSkills: [{ type: String }],
    missingSkills: [{ type: String }],
    suggestions: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Match", matchSchema);
