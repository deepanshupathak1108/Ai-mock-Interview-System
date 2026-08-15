const express = require("express");

const router = express.Router();

const { addQuestion, getQuestions, submitTest } = require("../controllers/aptitudeController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/add-question", addQuestion);

router.get("/questions", getQuestions);

router.post("/submit-test", authMiddleware, submitTest);

module.exports = router;