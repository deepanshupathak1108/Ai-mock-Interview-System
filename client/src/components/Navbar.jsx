import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      
      <div className="nav-logo">MockAI</div>

      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
        <NavLink to="/mock" onClick={() => setMenuOpen(false)}>Mock</NavLink>
        <NavLink to="/practice" onClick={() => setMenuOpen(false)}>Practice</NavLink>
        <NavLink to="/resume" onClick={() => setMenuOpen(false)}>Resume</NavLink>
        <NavLink to="/about" onClick={() => setMenuOpen(false)}>About</NavLink>
        <NavLink to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
      </div>

      <div className="nav-right">
        <NavLink to="/login" className="login-btn">Login</NavLink>

        <div 
          className={`hamburger ${menuOpen ? "open" : ""}`} 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

    </nav>
  );
}

export default Navbar;