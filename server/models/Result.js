const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  score: Number,
  level: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Result", resultSchema);