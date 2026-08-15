import { useState } from "react";
import axios from "axios";

function Resume() {

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);

  const [chat, setChat] = useState([]);
  const [answer, setAnswer] = useState("");

  const [score, setScore] = useState(0);

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

      // start interview immediately
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

    // next question
    const next = currentQ + 1;

    if (next < questions.length) {
      setCurrentQ(next);

      setTimeout(() => {
        setChat(prev => [
          ...prev,
          { sender: "ai", text: questions[next] }
        ]);
      }, 1000);

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
    <div style={styles.wrapper}>

      <h2 style={styles.title}>Resume AI Interview</h2>

      {/* UPLOAD SECTION */}
      {questions.length === 0 && (
        <div style={styles.uploadBox}>

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <br /><br />

          <button style={styles.primaryBtn} onClick={uploadResume}>
            {loading ? "Processing..." : "Upload Resume"}
          </button>

        </div>
      )}

      {/* CHAT INTERVIEW */}
      {questions.length > 0 && (
        <div style={styles.chatContainer}>

          {/* CHAT */}
          <div style={styles.chatBox}>
            {chat.map((msg, i) => (
              <div
                key={i}
                style={{
                  textAlign: msg.sender === "ai" ? "left" : "right",
                  margin: "10px"
                }}
              >
                <span style={{
                  background: msg.sender === "ai"
                    ? "#1e293b"
                    : "linear-gradient(135deg,#f59e0b,#f97316)",
                  color: "#fff",
                  padding: "10px",
                  borderRadius: "10px",
                  display: "inline-block",
                  maxWidth: "70%"
                }}>
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          {/* INPUT */}
          <textarea
            style={styles.textarea}
            placeholder="Write your answer..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />

          <button style={styles.secondaryBtn} onClick={submitAnswer}>
            Submit Answer
          </button>

          {/* SCORE */}
          <div style={styles.scoreBox}>
            <p>Question: {currentQ + 1} / {questions.length}</p>
            <p>Total Score: {score}</p>
          </div>

        </div>
      )}

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