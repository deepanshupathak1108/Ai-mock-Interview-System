const AptitudeQuestion = require("../models/AptitudeQuestion");
const AptitudeResult = require("../models/AptitudeResult");

exports.addQuestion = async (req, res) => {
  try {

    const { question, options, correctAnswer, category, difficulty } = req.body;

    const newQuestion = new AptitudeQuestion({
      question,
      options,
      correctAnswer,
      category,
      difficulty
    });

    await newQuestion.save();

    res.status(201).json({
      message: "Question added successfully",
      question: newQuestion
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }
};

exports.getQuestions = async (req, res) => {
  try {

    const questions = await AptitudeQuestion.find().select("-correctAnswer");

    res.json(questions);

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }
};

exports.submitTest = async (req, res) => {
  try {

    const { answers } = req.body;

    let score = 0;

    for (let answer of answers) {

      const question = await AptitudeQuestion.findById(answer.questionId);

      if (question && question.correctAnswer === answer.selectedAnswer) {
        score++;
      }

    }

    const total = answers.length;

    const status = score >= Math.ceil(total * 0.6) ? "PASS" : "FAIL";

    const result = new AptitudeResult({
      userId: req.user.id,
      score,
      total,
      status
    });

    await result.save();

    res.json({
      message: "Test submitted successfully",
      score,
      total,
      status
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }
};