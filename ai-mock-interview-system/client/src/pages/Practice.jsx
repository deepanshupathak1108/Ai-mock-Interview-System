import {useState } from "react";
import axios from "axios";
import "./Practice.css";

function Practice() {

  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [setCorrectAnswer] = useState("");

  // 🎯 Get Question
  const getQuestion = async () => {
    if (!topic) return alert("Enter topic first");

    setLoading(true);

    const res = await axios.post(
      "http://localhost:5000/api/interview/generate-question",
      { topic }
    );

    const q = res.data.question;

    setQuestion(q);
    setChat((prev) => [...prev, { sender: "ai", text: q }]);

    setLoading(false);
  };

  // ✅ Submit Answer
  const submitAnswer = async () => {
  if (!answer) return;

  setChat((prev) => [...prev, { sender: "user", text: answer }]);

  const res = await axios.post(
    "http://localhost:5000/api/interview/evaluate-answer",
    { question, answer }
  );

  setScore(res.data.score);
  setFeedback(res.data.feedback);
  setCorrectAnswer(res.data.correctAnswer);

  setChat((prev) => [
    ...prev,
    {
      sender: "ai",
      text: `Score: ${res.data.score}/10\n${res.data.feedback}\n\n✅ Correct Answer:\n${res.data.correctAnswer}`,
    },
  ]);

  setAnswer("");
};
  return (
    <div className="practice-wrapper">

      <div className="practice-box">

        <h1 className="practice-title">Practice Interview</h1>

        {/* TOPIC INPUT */}
        <input
          className="topic-input"
          type="text"
          placeholder="Enter topic (Java, DBMS, OS...)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        {/* QUICK BUTTONS */}
        <div className="quick-topics">
          <button className="btn" onClick={() => setTopic("Java basics")}>Java</button>
          <button className="btn" onClick={() => setTopic("Data Structures")}>DSA</button>
          <button className="btn" onClick={() => setTopic("Android")}>Android</button>
          <button className="btn" onClick={() => setTopic("Software")}>Software</button>
          <button className="btn" onClick={() => setTopic("HR interview")}>HR</button>
        </div>

        {/* GET QUESTION */}
        <button className="btn primary" onClick={getQuestion}>
          {loading ? "Loading..." : "Get Question"}
        </button>

        {/* CHAT */}
        <div className="chat-box">
          {chat.map((msg, i) => (
            <div key={i} className={`msg ${msg.sender}`}>
              <span className="bubble">{msg.text}</span>
            </div>
          ))}
        </div>

        {/* ANSWER */}
        {question && (
          <>
            <textarea
              className="answer-box"
              placeholder="Write your answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />

            <button className="btn secondary" onClick={submitAnswer}>
              Submit Answer
            </button>

            <button className="btn primary" onClick={getQuestion}>
              Next Question 🔁
            </button>
          </>
        )}

        {/* RESULT */}
        {score !== null && (
          <div className="result-box">
            <h3>Score: {score}/10</h3>
            <p>{feedback}</p>
          </div>
        )}

      </div>

    </div>
  );
}

export default Practice;