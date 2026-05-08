import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "./AuthContext";
import logo from "./logo.webp";
import { headItems } from "./navitems";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { token, role, logout, username } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logout Successful!", { autoClose: 2000 });
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt="logo" width="40" className="me-2" />
          <span className="fst-italic">Stay<span className="fw-bolder fs-5 text-warning">S</span>phere</span>
        </Link>

        {/* Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          <ul className="navbar-nav m-auto mb-2 ms-2 ms-lg-auto mb-lg-0 ">
            {headItems.map((item) => (
              <li key={item.id} className="nav-item">
                <Link
                  className="nav-link"
                  to={item.url}
                  onClick={() => setIsOpen(false)}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Side */}
          {token ? (
            <div className="dropdown">
              <button
                className="btn btn-outline-light dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                <i className="fa-regular fa-user me-2"></i>
                {username ? username.split(" ")[0] : role === "admin" ? "Admin" : ""}
              </button>

              <ul className="dropdown-menu dropdown-menu-start text-start">
                <li>
                  {role === "admin" ? (
                    <>
                      <Link className="dropdown-item" to="/admin/dashboard">
                        <i className="fa-solid fa-chart-bar"></i>
                        Dashboard
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link className="dropdown-item" to="/user/dashboard">
                        <i className="fa-solid fa-chart-bar me-2"></i>
                        Dashboard
                      </Link>
                    </>
                  )}
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <i className="fa-solid fa-right-from-bracket me-2"></i>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <Link className="btn btn-outline-light" to="/login">
                Login
              </Link>
              <Link className="btn btn-warning" to="/register">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
