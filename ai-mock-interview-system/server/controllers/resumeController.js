const multer = require("multer");
const pdfParse = require("pdf-parse");
const ai = require("../config/ai");

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("resume");

exports.uploadResume = (req, res) => {

  upload(req, res, async (err) => {

    if (err) {
      console.log("Upload Error:", err);
      return res.status(500).json({ message: "File upload error" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      console.log("File received:", req.file.originalname);

      const data = await pdfParse(req.file.buffer);
      const text = data.text;

      if (!text || text.trim() === "") {
        return res.json({
          questions: "Resume is empty or unreadable"
        });
      }

      const prompt = `
You are an AI interviewer.

Resume:
${text}

Generate 5 short interview questions based on this resume.
`;

      const questions = await ai(prompt);

      res.json({ questions });

    } catch (error) {
      console.log("Processing Error:", error);
      res.status(500).json({ message: "Resume processing failed" });
    }
  });
};