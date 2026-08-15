import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import loginImage from "../Images/login.webp";

function Login() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          email,
          password,
        });

        alert(res.data.message);
        navigate("/");
      } else {
        const res = await axios.post("http://localhost:5000/api/auth/register", {
          name,
          email,
          password,
        });

        alert(res.data.message);
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div style={styles.container}>
      
      {/* LEFT IMAGE SECTION */}
      <div style={styles.left}>
        <img src={loginImage} alt="login" style={styles.image} />

        <div style={styles.overlay}>
          <h1 style={styles.title}>AI Mock Interview</h1>
          <p style={styles.desc}>
            Practice smarter. Crack interviews faster 🚀
          </p>
        </div>
      </div>

      {/* RIGHT FORM SECTION */}
      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.heading}>
            {isLogin ? "Welcome Back 👋" : "Create Account 🚀"}
          </h2>

          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              style={styles.input}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            style={styles.input}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button style={styles.button} onClick={handleSubmit}>
            {isLogin ? "Login" : "Register"}
          </button>

          <p style={styles.switchText}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>

          <span style={styles.switchBtn} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Create Account" : "Login"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "Arial",
    width: "100%",
  },

  // LEFT SIDE (IMAGE)
  left: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, rgba(102,126,234,0.8), rgba(118,75,162,0.8))",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    textAlign: "center",
  },

  title: {
    fontSize: "36px",
    marginBottom: "10px",
  },

  desc: {
    fontSize: "16px",
    opacity: 0.9,
  },

  // RIGHT SIDE (FORM)
  right: {
    flex: 1,
    background: "#f8f9fc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "15px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: "400px",
  },

  heading: {
    marginBottom: "20px",
    color: "#333",
  },

  input: {
    display: "block",
    width: "90%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none",
  },

  button: {
    marginTop: "10px",
    padding: "12px",
    width: "90%",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },

  switchText: {
    marginTop: "15px",
    color: "#666",
  },

  switchBtn: {
    color: "#667eea",
    cursor: "pointer",
    fontWeight: "bold",
  },
};