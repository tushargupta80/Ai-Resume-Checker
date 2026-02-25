const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/auth");
const roles = require("../middleware/roles");
const { uploadResume, getMyResumes } = require("../controllers/resumeController");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`)
});

const fileFilter = (_, file, cb) => {
  if (file.mimetype !== "application/pdf") return cb(new Error("Only PDF files allowed"));
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

router.post("/upload", auth, roles("jobseeker"), upload.single("resume"), uploadResume);
router.get("/my-resumes", auth, roles("jobseeker"), getMyResumes);

module.exports = router;
