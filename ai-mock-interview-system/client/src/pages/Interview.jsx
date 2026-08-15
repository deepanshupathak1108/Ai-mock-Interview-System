/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./Interview.css";
import { FaMicrophone, FaPlay, FaStop, FaChartBar } from "react-icons/fa";

function Interview() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");

  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalScore, setTotalScore] = useState(0);

  const [level, setLevel] = useState("core");

  const [corePassed, setCorePassed] = useState(false);
  const [techPassed, setTechPassed] = useState(false);

  const [voiceMode, setVoiceMode] = useState(true);
  const [chat, setChat] = useState([]);

  const [isFinished, setIsFinished] = useState(false);

  const recognitionRef = useRef(null);

  // 🔊 AI Speak
  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  };

  // 🔥 Get Question
  const getQuestion = async () => {
    let topic = "";

    if (level === "core") topic = "Java basics";
    if (level === "technical") topic = "Data Structures";
    if (level === "hr") topic = "HR interview";

    const res = await axios.post(
      "http://localhost:5000/api/interview/generate-question",
      { topic },
    );

    const q = res.data.question;

    setQuestion(q);
    setChat((prev) => [...prev, { sender: "ai", text: q }]);

    if (voiceMode) speak(q);
  };

  // 🔥 Next Question
  const nextQuestion = () => {
    setQuestion("");
    setAnswer("");
    setScore(null);
    setFeedback("");
    setCorrectAnswer("");

    setQuestionNumber((prev) => prev + 1);

    setTimeout(() => {
      getQuestion();
    }, 300);
  };

  // 🔥 Submit Answer
  const submitAnswer = async () => {
    if (!answer) return;

    setChat((prev) => [...prev, { sender: "user", text: answer }]);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/interview/evaluate-answer",
        {
          question,
          answer,
        },
      );

      const scoreValue = res.data?.score || 0;
      const feedbackValue = res.data?.feedback || "No feedback";
      const correctValue = res.data?.correctAnswer || "Not available";

      setScore(scoreValue);
      setFeedback(feedbackValue);
      setCorrectAnswer(correctValue);

      setChat((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `✅ Score: ${scoreValue}/10\n💬 ${feedbackValue}\n📘 Correct: ${correctValue}`,
        },
      ]);

      setTotalScore((prev) => {
        const updatedTotal = prev + scoreValue;

        if (questionNumber === 5 && !isFinished) {
          setIsFinished(true);

          axios.post("http://localhost:5000/api/interview/save-result", {
            score: updatedTotal,
            level,
          });

          if (level === "core" && updatedTotal >= 20) {
            setCorePassed(true);
            alert("Core Passed ✅ Technical Unlocked");
          }

          if (level === "technical" && updatedTotal >= 20) {
            setTechPassed(true);
            alert("Technical Passed ✅ HR Unlocked");
          }

          setChat((prev) => [
            ...prev,
            {
              sender: "ai",
              text: `🎯 Interview Finished!\nTotal Score: ${updatedTotal}/50`,
            },
          ]);
        }

        return updatedTotal;
      });

      if (questionNumber < 5) {
        setTimeout(() => nextQuestion(), 2500);
      }

      setAnswer("");
    } catch (err) {
      console.log(err);
      alert("Evaluation failed ❌");
    }
  };

  // 🎤 Speech Setup (NO AUTO SUBMIT)
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = true;

    recognition.onresult = (event) => {
      const text = event.results[event.results.length - 1][0].transcript;

      setAnswer(text); // ✅ ONLY SET TEXT
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    try {
      recognitionRef.current.stop();
    } catch (e) {
      /* empty */
    }
    recognitionRef.current.start();
  };

  const stopListening = () => {
    recognitionRef.current.stop();
  };

  // 🔥 Start Level
  const startLevel = (newLevel) => {
    setLevel(newLevel);
    setChat([]);
    setQuestion("");
    setAnswer("");
    setScore(null);
    setFeedback("");
    setCorrectAnswer("");
    setQuestionNumber(1);
    setTotalScore(0);
    setIsFinished(false);
  };

  return (
    <div className="wrapper">
      {/* LEFT */}
      <div className="left">
        <h2 className="heading">AI Mock Interview</h2>

        {/* LEVEL */}
        <div className="level-box">
          <button onClick={() => startLevel("core")}>Core</button>
          <button
            disabled={!corePassed}
            onClick={() => startLevel("technical")}
          >
            {corePassed ? "Technical" : "Technical 🔒"}
          </button>
          <button disabled={!techPassed} onClick={() => startLevel("hr")}>
            {techPassed ? "HR" : "HR 🔒"}
          </button>
        </div>

        {/* CONTROLS */}
        <div className="controls">
          <button
            className="voice-btn"
            onClick={() => setVoiceMode(!voiceMode)}
          >
            <FaMicrophone /> Voice ON
          </button>

          {question === "" && (
            <button className="start-btn" onClick={getQuestion}>
              <FaPlay /> Start Interview
            </button>
          )}
        </div>

        {/* CHAT */}
        <div className="chat-box">
          {chat.map((msg, i) => (
            <div key={i} style={{ marginBottom: "10px" }}>
              <p>{msg.text}</p>
            </div>
          ))}
        </div>

        {/* VOICE CONTROLS */}
        {voiceMode && (
          <div className="controls">
            <button className="voice-btn" onClick={startListening}>
              <FaMicrophone /> Start
            </button>

            <button className="start-btn" onClick={stopListening}>
              <FaStop /> Stop
            </button>
          </div>
        )}

        {/* INPUT */}
        <textarea
          className="textarea"
          placeholder="...start your answer here..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />

        {/* SUBMIT */}
        <button className="submit-btn" onClick={submitAnswer}>
          Submit Answer
        </button>
      </div>

      {/* RIGHT */}
      <div className="right">
        {/* PROGRESS */}
        <div className="card">
          <h3>
            <FaChartBar /> Progress
          </h3>
          <p>{questionNumber}/5</p>
          <p>Total Score: {totalScore}</p>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(questionNumber / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* TIPS */}
        <div className="card">
          <h3>💡 Tips</h3>
          <p>✔ Speak clearly</p>
          <p>✔ Give examples</p>
          <p>✔ Stay confident</p>
        </div>

        {/* MODE */}
        <div className="card">
          <h3>🎤 Mode</h3>
          <p>{voiceMode ? "Voice Interview" : "Text Interview"}</p>
        </div>
      </div>
    </div>
  );
}
const styles = {
  wrapper: {
    display: "flex",
    height: "100vh",
    background: "linear-gradient(135deg,#0f0c29,#302b63,#24243e)",
    color: "#fff",
  },

  left: {
    flex: 2,
    padding: "30px",
    overflowY: "auto",
  },

  right: {
    flex: 1,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  heading: {
    fontSize: "28px",
    marginBottom: "15px",
  },

  levelBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
  },

  voiceBtn: {
    padding: "10px 15px",
    borderRadius: "10px",
    background: "#ff7a18",
    border: "none",
    color: "#fff",
    marginBottom: "15px",
    cursor: "pointer",
  },

  startBtn: {
    padding: "12px 20px",
    background: "#00c6ff",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    cursor: "pointer",
    marginBottom: "15px",
  },

  chatBox: {
    height: "300px",
    overflowY: "auto",
    marginBottom: "15px",
  },

  textarea: {
    width: "100%",
    height: "100px",
    borderRadius: "10px",
    padding: "10px",
    marginTop: "10px",
    border: "none",
  },

  submitBtn: {
    marginTop: "10px",
    padding: "12px",
    background: "linear-gradient(135deg,#ff7a18,#ffb347)",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    cursor: "pointer",
  },

  smallBtn: {
    margin: "5px",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },

  card: {
    background: "rgba(255,255,255,0.08)",
    padding: "20px",
    borderRadius: "15px",
    backdropFilter: "blur(10px)",
  },
};

export default Interview;
