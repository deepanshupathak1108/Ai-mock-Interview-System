import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div style={styles.nav}>
      <Link to="/">Home</Link>
      <Link to="/mock">Mock</Link>
      <Link to="/practice">Practice</Link>
      <Link to="/resume">Resume</Link>
      <Link to="/About">About</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/login">Login</Link>
      
    </div>
  );
}

export default Navbar;

const styles = {
  nav: {
    position: "absolute",
    top: 0,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    gap: "40px",
    padding: "15px",
    zIndex: 10,       
    color: "#333",
  },
};