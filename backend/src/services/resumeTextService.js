const fs = require("fs/promises");
const os = require("os");
const path = require("path");
const { promisify } = require("util");
const { execFile } = require("child_process");
const pdfParse = require("pdf-parse");
const { createWorker } = require("tesseract.js");

const execFileAsync = promisify(execFile);

function normalizeText(text) {
  return (text || "").replace(/\s+/g, " ").trim();
}

async function extractWithPdfParse(buffer) {
  const parsed = await pdfParse(buffer);
  return {
    text: normalizeText(parsed.text),
    numPages: parsed.numpages || 1
  };
}

async function extractWithOcr(buffer, numPages) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "resume-ocr-"));
  const pdfPath = path.join(tempDir, "resume.pdf");
  await fs.writeFile(pdfPath, buffer);

  const gsPath = await resolveGhostscriptPath();
  const outPattern = path.join(tempDir, "page-%03d.png");

  const worker = await createWorker("eng");
  const chunks = [];

  try {
    await execFileAsync(gsPath, [
      "-dSAFER",
      "-dBATCH",
      "-dNOPAUSE",
      "-sDEVICE=png16m",
      "-r220",
      `-dFirstPage=1`,
      `-dLastPage=${Math.max(1, numPages)}`,
      `-sOutputFile=${outPattern}`,
      pdfPath
    ]);

    const images = (await fs.readdir(tempDir))
      .filter((f) => /^page-\d{3}\.png$/i.test(f))
      .sort();

    for (const file of images) {
      const imgPath = path.join(tempDir, file);
      const ocr = await worker.recognize(imgPath);
      const text = normalizeText(ocr?.data?.text);
      if (text) chunks.push(text);
    }
  } finally {
    await worker.terminate();
    await fs.rm(tempDir, { recursive: true, force: true });
  }

  return normalizeText(chunks.join(" "));
}

async function resolveGhostscriptPath() {
  const binName = process.platform === "win32" ? "gswin64c.exe" : "gs";
  const envPath = process.env.PATH || "";

  for (const p of envPath.split(path.delimiter)) {
    if (!p) continue;
    const full = path.join(p, binName);
    try {
      await fs.access(full);
      return full;
    } catch {
      // keep looking
    }
  }

  if (process.platform === "win32") {
    const base = "C:\\Program Files\\gs";
    try {
      const versions = await fs.readdir(base, { withFileTypes: true });
      const dirs = versions
        .filter((d) => d.isDirectory())
        .map((d) => d.name)
        .sort()
        .reverse();

      for (const dir of dirs) {
        const candidate = path.join(base, dir, "bin", "gswin64c.exe");
        try {
          await fs.access(candidate);
          return candidate;
        } catch {
          // keep looking
        }
      }
    } catch {
      // base not found
    }
  }

  throw new Error("Ghostscript executable not found. Install Ghostscript and restart backend.");
}

exports.extractResumeText = async (buffer) => {
  const parsed = await extractWithPdfParse(buffer);
  if (parsed.text) return parsed.text;

  try {
    const ocrText = await extractWithOcr(buffer, parsed.numPages);
    if (ocrText) return ocrText;
    throw new Error("OCR completed but no text was detected.");
  } catch (error) {
    throw new Error(
      "No extractable text found. OCR fallback failed or found no text. Ensure the PDF is clear and Ghostscript is installed."
    );
  }
};
