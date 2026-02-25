const router = require("express").Router();
const auth = require("../middleware/auth");
const roles = require("../middleware/roles");
const { createJob, getAllJobs } = require("../controllers/jobController");
const { createJobValidator } = require("../validators/jobValidators");

router.post("/create", auth, roles("recruiter"), createJobValidator, createJob);
router.get("/all", auth, getAllJobs);

module.exports = router;
