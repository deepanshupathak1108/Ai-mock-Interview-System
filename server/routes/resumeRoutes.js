const express = require("express");
const router = express.Router();

const { uploadResume } = require("../controllers/resumeController");

router.post("/upload", uploadResume);

module.exports = router;