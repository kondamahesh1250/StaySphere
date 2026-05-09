import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { token } = useParams();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords must be same");
      return;
    }

    try {
      const { data } = await API.post(`/users/reset-password/${token}`, {
        password,
      });

      toast.success(data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow w-50 mx-auto">
        <h3 className="mb-4">Reset Password</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Enter Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {/* <button className="btn btn-secondary w-100">Reset Password</button> */}
          <button
            className="btn btn-secondary w-100 d-flex justify-content-center align-items-center"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <ClipLoader size={20} color="#fff" />
                <span className="ms-2">Resetting...</span>
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
