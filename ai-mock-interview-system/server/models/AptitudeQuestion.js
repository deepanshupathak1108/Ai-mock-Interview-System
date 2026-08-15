const mongoose = require("mongoose");

const aptitudeQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },

  options: {
    type: [String],
    required: true,
  },

  correctAnswer: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    enum: ["quantitative", "logical", "verbal"],
    required: true,
  },

  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "easy",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("AptitudeQuestion", aptitudeQuestionSchema);
