import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Interview from "./pages/Interview";
import Practice from "./pages/Practice";
import Dashboard from "./pages/Dashboard";
import Resume from "./pages/Resume";
import Login from "./pages/Login";
import About from "./pages/About";


function AppContent() {
  const location = useLocation();

  return (
    <>
      {/* Navbar hide on login */}
      {location.pathname !== "/login" && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mock" element={<Interview />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;