import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { AuthContext } from "../components/AuthContext";
import API from "../services/api";

const GoogleLogin = ({ name }) => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handlelogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (tokenResponse) => {
      try {
        const { code } = tokenResponse;

        const { data } = await API.post(`/users/googlesign`, { code });

        const token = data.token || data;
        login(token, data.role);

        if (data.role === "admin") {
          navigate("/admin/dashboard", { replace: true });
          toast.success("Welcome Admin!");
        } else {
          navigate("/user/dashboard", { replace: true });
          toast.success("Login Successful!");
        }
      } catch (error) {
        toast.error("Login failed");
      }
    },
    onError: () => {
      toast.error("Google login failed");
    },
  });

  return (
    <div className="w-100">
      <button
        className="btn btn-light w-100 d-flex align-items-center justify-content-center gap-2 shadow-sm"
        onClick={() => handlelogin()}
      >
        <img
          src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
          alt="Google Logo"
          width="20"
          height="20"
        />
        <span>{name}</span>
      </button>
    </div>
  );
};

export default GoogleLogin;