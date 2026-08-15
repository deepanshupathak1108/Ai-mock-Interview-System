const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const aptitudeRoutes = require("./routes/aptitudeRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/resume",resumeRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/aptitude", aptitudeRoutes);

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You accessed a protected route",
    userId: req.user.id
  });
});

app.get("/", (req, res) => {
  res.send("AI Mock Interview API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});