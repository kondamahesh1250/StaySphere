import { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post("/users/forgot-password", {
        email,
      });

      toast.success(data.message);
      setEmail("");
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow w-50 mx-auto">
        <h3 className="mb-4">Forgot Password</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* <button className="btn btn-secondary w-100">Send Reset Link</button> */}
          <button
            className="btn btn-secondary w-100 d-flex justify-content-center align-items-center"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <ClipLoader size={20} color="#fff" />
                <span className="ms-2">Sending link...</span>
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
