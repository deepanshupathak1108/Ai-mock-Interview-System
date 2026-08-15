const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  interviewType: {
    type: String,
    enum: ["technical", "hr"],
    required: true
  },

  question: {
    type: String,
    required: true
  },

  answer: {
    type: String
  },

  score: {
    type: Number
  },

  feedback: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Interview", interviewSchema);