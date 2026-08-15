import React from "react";
import "./about.css";
import loginImage from "../Images/img1.avif";

const About = () => {
  return (
    <section className="about modern-about">
      <div className="about-container">
        <div className="about-text">
          <h2 className="about-title">Who We Are</h2>

          <p className="about-description">
            At <strong>AI Mock Interview</strong>, we help students and job
            seekers prepare for real interviews using artificial intelligence.
            Our platform provides smart interview practice where users can
            answer questions, get instant feedback, and improve their
            performance with real-time evaluation.
          </p>

          <ul className="about-features">
            <li>✅ AI-Based Interview Questions</li>
            <li>✅ Voice & Text Interview Practice</li>
            <li>✅ Instant Score & Feedback</li>
            <li>✅ Real Interview Simulation</li>
          </ul>
        </div>

        <div className="about-image">
          <img src={loginImage} alt="AI Interview Practice" />
        </div>
      </div>
    </section>
  );
};

export default About;