import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const navigate = useNavigate();

  const login = (token, role) => {
    setToken(token);
    setRole(role);
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUsername(null);
    // localStorage.removeItem("token");
    // localStorage.removeItem("role");
    localStorage.clear();
  };

  const handleUser = (name) => {
    setUsername(name);
    // localStorage.setItem("username", name);
  }

  return (
    <AuthContext.Provider value={{ token, role, login, logout, handleUser, username }}>
      {children}
    </AuthContext.Provider>
  );
}
