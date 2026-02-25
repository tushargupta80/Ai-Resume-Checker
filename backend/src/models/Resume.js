const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileUrl: { type: String, required: true },
    extractedText: { type: String, required: true },
    resumeScore: { type: Number, default: 0 },
    atsScore: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);
