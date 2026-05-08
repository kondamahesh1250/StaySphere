import { Route, Routes, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";

import Navbar from "./components/Navbar.jsx";
import LandingPage from "./components/LandingPage.jsx";
import HomeScreen from "./pages/HomeScreen.jsx";
import RoomDetails from "./pages/RoomDetails.jsx";
import BookingScreen from "./pages/BookingScreen.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AdminScreen from "./pages/AdminScreen.jsx";
import UserScreen from "./pages/UserScreen.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import { AuthContext } from "./components/AuthContext.jsx";

const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes

function App() {
  const navigate = useNavigate();
  const { token, logout } = useContext(AuthContext);

  useEffect(() => {
    let timeout;

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(logoutUser, INACTIVITY_TIMEOUT);
    };

    const logoutUser = () => {
      toast.warning("You have been logged out due to inactivity.", {
        autoClose: 2000,
      });

      logout();

      navigate("/login");
    };

    // Check if the token is expired
    const checkTokenExpiry = () => {
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp < currentTime) {
            toast.error("Session Expired! Please log in again.", {
              autoClose: 2000,
            });

            setTimeout(() => {
              logout();
              navigate("/login");
            }, 1000);
          }
        } catch (error) {
          console.error("Invalid token:", error);
          navigate("/login");
        }
      }
    };

    // Event listeners for user activity
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("touchstart", resetTimer);

    if(localStorage.getItem("guestUser")) {
      return;
    }

    // Check token expiry on app load
    checkTokenExpiry();
    resetTimer();

    // Check token expiry every minute
    const tokenCheckInterval = setInterval(checkTokenExpiry, 1 * 60 * 1000); // 1 minute

    return () => {
      clearTimeout(timeout);
      clearInterval(tokenCheckInterval);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
    };
  }, [navigate]);

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/homescreen" element={<HomeScreen />} />
        <Route path="/viewroom/:id" element={<RoomDetails />} />
        <Route path="/book/:id/:fromDate/:toDate" element={<BookingScreen />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user/dashboard" element={<UserScreen />} />
        <Route path="/admin/dashboard" element={<AdminScreen />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
