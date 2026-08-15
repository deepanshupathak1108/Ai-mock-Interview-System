const express = require("express");
const { saveResult, getResults } = require("../controllers/interviewController");

const router = express.Router();

const {
  generateQuestion,
  evaluateAnswer,startInterview
} = require("../controllers/interviewController");

router.post("/generate-question", generateQuestion);
router.post("/evaluate-answer", evaluateAnswer);
router.post("/start", startInterview);

module.exports = router;


router.post("/save-result", saveResult);
router.get("/results", getResults);