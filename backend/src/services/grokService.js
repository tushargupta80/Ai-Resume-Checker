const axios = require("axios");

function parseAIJson(content) {
  try {
    return JSON.parse(content);
  } catch {
    const cleaned = content.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  }
}

exports.analyzeResumeAgainstJob = async ({ resumeText, jobDescription }) => {
  const prompt = `
You are an expert ATS and recruitment AI.
Analyze the resume and job description and return ONLY valid JSON with this exact shape:
{
  "extractedSkills": ["string"],
  "resumeScore": 0,
  "atsScore": 0,
  "matchPercentage": 0,
  "matchingSkills": ["string"],
  "missingSkills": ["string"],
  "suggestions": ["string"],
  "rewrittenBulletPoints": ["string"],
  "careerRecommendations": ["string"]
}

Rules:
- Scores and percentages must be integers 0-100.
- matchingSkills and missingSkills must be derived from job requirements.
- suggestions must be actionable.
- Keep arrays concise and relevant.

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

  const response = await axios.post(
    `${process.env.GROK_BASE_URL}/chat/completions`,
    {
      model: process.env.GROK_MODEL || "grok-2-latest",
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }]
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROK_API_KEY}`,
        "Content-Type": "application/json"
      },
      timeout: 30000
    }
  );

  const content = response.data.choices?.[0]?.message?.content || "{}";
  return parseAIJson(content);
};
