import "./Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* HERO */}
      <div className="hero">
        <h1>Ace Your Next Interview 🚀</h1>
        <p>Practice with AI-powered interviews and get instant feedback.</p>

        <div className="hero-buttons">
          <button className="btn primary" onClick={() => navigate("/mock")}>
            Get Started →
          </button>

          <button className="btn secondary" onClick={() => navigate("/About")}>
            Learn More ↓
          </button>
        </div>
      </div>

      {/* FEATURES */}
      <div className="features">
        <h2>Features</h2>

        <div className="feature-grid">
          <div className="card">
            <h3>🤖 AI Interview</h3>
            <p>Practice real-time interview questions</p>
          </div>

          <div className="card">
            <h3>🎤 Voice Support</h3>
            <p>Speak answers like real interview</p>
          </div>

          <div className="card">
            <h3>📊 Instant Feedback</h3>
            <p>Get score and improvement tips</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="cta">
        <h2>Ready to crack your interview?</h2>

        <button className="btn primary" onClick={() => navigate("/Practice")}>
          Start Now 🚀
        </button>
      </div>
    </div>
  );
}

export default Home;
