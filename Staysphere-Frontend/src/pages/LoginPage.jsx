import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import API from "../services/api";
import { AuthContext } from "../components/AuthContext";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      toast.error("All fields are required!");
      return;
    }

    try {
      setLoading(true);
      const { data } = await API.post(`/users/login`, formData);
console.log(data)
      
      if (data.status === 200) {
        login(data.token, data.role);

        if (data.role === "admin") {
          navigate("/admin/dashboard", { replace: true });
          toast.success("Welcome Admin!");
        } else {
          navigate("/user/dashboard", { replace: true });
          toast.success("Login Successful!");
        }
      }
    } catch (error) {
      toast.error(
        error.response?.status === 400
          ? "Invalid Credentials!"
          : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleGuest() {
    const guestLogin = {
      name: "Guest User",
      email: "guestuser@gmail.com",
    };

    localStorage.setItem("guestUser", JSON.stringify(guestLogin));
    login("guest-token", "user");

    const redirectPath = sessionStorage.getItem("redirectAfterLogin");

    if (redirectPath) {
      sessionStorage.removeItem("redirectAfterLogin");
      return navigate(redirectPath, { replace: true });
    }

    toast.success("Welcome Guest!");
    navigate("/user/dashboard", { replace: true });
  }

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="row w-100">
        {/* Form Section */}
        <div className="col-md-5 mx-auto">
          <div className="card shadow p-4">
            <h3 className="text-center mb-4">Login</h3>

            <form onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                />
                <label>Email</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                />
                <label>Password</label>
              </div>

              <button
                className="btn btn-dark w-100 mb-3 d-flex justify-content-center align-items-center"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <ClipLoader size={20} color="#fff" />
                    <span className="ms-2">Logging in...</span>
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <button
              className="btn btn-outline-secondary w-100 mb-3"
              onClick={handleGuest}
            >
              Continue as Guest
            </button>

            <p className="text-center">
              Forgot Password? <Link to="/forgot-password">Reset Here</Link>
            </p>
            <p className="text-center">
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
