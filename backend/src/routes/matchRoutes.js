const router = require("express").Router();
const auth = require("../middleware/auth");
const roles = require("../middleware/roles");
const { analyze, getResults } = require("../controllers/matchController");
const { analyzeValidator } = require("../validators/matchValidators");

router.post("/analyze", auth, roles("jobseeker"), analyzeValidator, analyze);
router.get("/results", auth, getResults);

module.exports = router;
