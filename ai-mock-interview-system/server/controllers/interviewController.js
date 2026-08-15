const generateAI = require("../config/ai");
const ai = require("../config/ai");
const Result = require("../models/Result");
exports.generateQuestion = async (req, res) => {
  try {
    const { topic } = req.body;

    let prompt = "";

    if (topic.includes("HR")) {
      prompt = `
  Generate ONE common HR interview question.

  Rules:
  - Ask simple and standard HR questions
  - Use commonly asked interview questions
  - Examples:
    - Tell me about yourself
    - What are your strengths and weaknesses?
    - Why should we hire you?
    - What are your hobbies?
    - Where do you see yourself in 5 years?

  Do NOT generate complex or unusual questions.
  ASK ONLY ONE QUESTION. Do not include explanations or formatting.
  `;
    } else {
      prompt = `
Generate ONLY ONE short interview question about ${topic}.

Rules:
- Do NOT give answer
- Do NOT give options
- Keep it very short (1 line)
- Example:
  What is polymorphism in Java?

Only return the question text.
Do not repeat the question again and again.
`;
    }

    const question = await generateAI(prompt);

    res.json({
      question,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "AI generation failed",
    });
  }
};

exports.evaluateAnswer = async (req, res) => {
  try {
    const { question, answer } = req.body;

    const prompt = `
You are an AI interviewer.

Question: ${question}
User Answer: ${answer}

👉 Do the following:
1. Give the correct answer
2. Give score out of 10
3. Give short feedback

👉 Return ONLY JSON:
{
  "correctAnswer": "text",
  "score": number,
  "feedback": "text"
}
`;

    const result = await ai(prompt);

    let parsed;

    try {
      parsed = JSON.parse(result);
    } catch (err) {
      parsed = {
        correctAnswer: "Not available",
        score: 5,
        feedback: "Average answer",
      };
    }

    res.json(parsed);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Evaluation failed",
    });
  }
};

exports.startInterview = async (req, res) => {
  try {
    const { topic } = req.body;

    res.json({
      message: "Interview started",
      topic,
      questionNumber: 1,
    });
  } catch (error) {
    res.status(500).json({ message: "Error starting interview" });
  }
};

exports.saveResult = async (req, res) => {
  try {
    const { score, level } = req.body;

    const newResult = new Result({ score, level });
    await newResult.save();

    res.json({ message: "Result saved" });
  } catch (err) {
    res.status(500).json({ message: "Error saving result" });
  }
};

exports.getResults = async (req, res) => {
  try {
    const results = await Result.find().sort({ date: -1 });

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Error fetching results" });
  }
};
