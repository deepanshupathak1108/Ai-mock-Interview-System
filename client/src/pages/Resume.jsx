import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./Practice.css"; // 🔥 reuse same UI

function Resume() {

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);

  const [chat, setChat] = useState([]);
  const [answer, setAnswer] = useState("");

  const [score, setScore] = useState(0);

  const chatEndRef = useRef(null);

  // 🔥 Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // 🚀 Upload Resume
  const uploadResume = async () => {

    if (!file) return alert("Upload resume");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/resume/upload",
        formData
      );

      const qList = res.data.questions
        .split("\n")
        .filter(q => q.trim() !== "");

      setQuestions(qList);

      setChat([{ sender: "ai", text: qList[0] }]);

    } catch (err) {
      console.log(err);
      alert("Upload failed");
    }

    setLoading(false);
  };

  // ✅ Submit Answer
  const submitAnswer = async () => {

    if (!answer) return;

    const question = questions[currentQ];

    setChat(prev => [...prev, { sender: "user", text: answer }]);

    const res = await axios.post(
      "http://localhost:5000/api/interview/evaluate-answer",
      { question, answer }
    );

    const newScore = score + res.data.score;
    setScore(newScore);

    setChat(prev => [
      ...prev,
      {
        sender: "ai",
        text: `Score: ${res.data.score}/10\n${res.data.feedback}`
      }
    ]);

    setAnswer("");

    const next = currentQ + 1;

    if (next < questions.length) {
      setCurrentQ(next);

      setTimeout(() => {
        setChat(prev => [
          ...prev,
          { sender: "ai", text: questions[next] }
        ]);
      }, 800);

    } else {
      setChat(prev => [
        ...prev,
        {
          sender: "ai",
          text: `🎉 Interview Completed\nTotal Score: ${newScore}`
        }
      ]);
    }
  };

  return (
    <div className="practice-wrapper">
      <div className="practice-box">

        <h1 className="practice-title">Resume AI Interview</h1>

        <p className="practice-desc">
          Upload your resume and experience an AI-driven mock interview tailored to your profile.
        </p>

        {/* UPLOAD */}
        {questions.length === 0 && (
          <div>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <br /><br />

            <button className="btn primary" onClick={uploadResume}>
              {loading ? "Processing..." : "Upload Resume"}
            </button>
          </div>
        )}

        {/* CHAT INTERVIEW */}
        {questions.length > 0 && (
          <>

            {/* CHAT */}
            <div className="chat-box">
              {chat.map((msg, i) => (
                <div key={i} className={`msg ${msg.sender}`}>
                  <div className="bubble">{msg.text}</div>
                </div>
              ))}

              <div ref={chatEndRef}></div>
            </div>

            {/* ANSWER */}
            <textarea
              className="answer-box"
              placeholder="Write your answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />

            <button className="btn secondary" onClick={submitAnswer}>
              Submit Answer
            </button>

            {/* SCORE */}
            <div className={`result-box ${
              score <= (questions.length * 4) ? "low"
              : score <= (questions.length * 7) ? "medium"
              : "high"
            }`}>
              <div className="score-header">
                <h3>Progress</h3>
                <span className="score-value">
                  {currentQ + 1}/{questions.length}
                </span>
              </div>

              <p className="score-feedback">
                Total Score: {score}
              </p>
            </div>

          </>
        )}

      </div>
    </div>
  );
}

export default Resume;

/* 🎨 STYLES */
const styles = {

  wrapper: {
    minHeight: "100vh",
    background: "radial-gradient(circle,#1e3a8a,#020617)",
    color: "#fff",
    padding: "30px",
    textAlign: "center"
  },

  title: {
    marginBottom: "20px"
  },

  uploadBox: {
    background: "rgba(255,255,255,0.1)",
    padding: "30px",
    borderRadius: "15px",
    display: "inline-block"
  },

  primaryBtn: {
    padding: "12px 25px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg,#38bdf8,#6366f1)",
    color: "#fff",
    cursor: "pointer"
  },

  chatContainer: {
    maxWidth: "700px",
    margin: "auto"
  },

  chatBox: {
    height: "350px",
    overflowY: "auto",
    background: "rgba(255,255,255,0.05)",
    padding: "15px",
    borderRadius: "15px"
  },

  textarea: {
    width: "100%",
    height: "100px",
    marginTop: "10px",
    borderRadius: "10px",
    border: "none",
    padding: "10px"
  },

  secondaryBtn: {
    marginTop: "10px",
    padding: "10px 20px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg,#f59e0b,#f97316)",
    color: "#fff",
    cursor: "pointer"
  },

  scoreBox: {
    marginTop: "15px"
  }
};