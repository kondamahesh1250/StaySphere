import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import GoogleLogin from "../pages/GoogleLogin";
import API from "../services/api";
import { ClipLoader } from "react-spinners";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    c_password: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { name, email, password, c_password } = formData;

    if (!name || !email || !password || !c_password) {
      toast.error("All fields are required!");
      return;
    }

    if (password !== c_password) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const { data } = await API.post(`/users/register`, formData);
      if (data) {
        toast.success("Registration Successful! Please Login");
        setTimeout(() => navigate("/login"), 1500);
      }

      setFormData({ name: "", email: "", password: "", c_password: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="row w-100">
        {/* Form Section */}
        <div className="col-md-5 mx-auto">
          <div className="card shadow p-4">
            <h3 className="text-center mb-4">Register</h3>

            <form onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                />
                <label htmlFor="name">Name</label>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
                <label htmlFor="email">Email</label>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                />
                <label htmlFor="password">Password</label>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="c_password"
                  name="c_password"
                  value={formData.c_password}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                />
                <label htmlFor="c_password">Confirm Password</label>
              </div>

              <button
                className="btn btn-dark w-100 mb-3 d-flex justify-content-center align-items-center"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <ClipLoader size={20} color="#fff" />
                    <span className="ms-2">Registering...</span>
                  </>
                ) : (
                  "Register"
                )}
              </button>
            </form>

            {/* Google Section */}
            <div className="text-center mb-3 border ">
              <GoogleLogin name="Sign up with Google" />
            </div>

            <p className="text-center mb-0">
              Already have an account? <a href="/login">Login</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
