import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./dashboard.css";

function Dashboard() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/interview/results"
      );
      setResults(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 📊 CALCULATIONS
  const total = results.length;
  const avg =
    total > 0
      ? Math.round(results.reduce((a, b) => a + b.score, 0) / total)
      : 0;

  const best =
    total > 0 ? Math.max(...results.map((r) => r.score)) : 0;

  return (
    <div className="dashboard">

      <h1 className="dashboard-title">📊 Performance Dashboard</h1>

      {/* 🔥 TOP CARDS */}
      <div className="top-cards">

        <div className="top-card">
          <h3>Total Interviews</h3>
          <h2>{total}</h2>
        </div>

        <div className="top-card">
          <h3>Average Score</h3>
          <h2>{avg}/50</h2>
        </div>

        <div className="top-card highlight">
          <h3>Best Score</h3>
          <h2>{best}/50</h2>
        </div>

      </div>

      {/* 📊 CHART */}
      <div className="chart-box">
        <h3>Performance Chart</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={results}>
            <XAxis dataKey="level" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="score" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 📦 HISTORY */}
      <div className="cards">

        {results.map((r, i) => (
          <div key={i} className="card">

            <span className={`badge ${r.level}`}>
              {r.level.toUpperCase()}
            </span>

            <h2>{r.score}/50</h2>

            <p>{new Date(r.date).toLocaleString()}</p>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Dashboard;