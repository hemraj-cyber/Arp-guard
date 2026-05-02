import React, { useEffect, useState, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "sonner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const formatApiError = (detail) => {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).filter(Boolean).join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/auth/me`);
        setUser(data);
      } catch (error) {
        setUser(false);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post(`${BACKEND_URL}/api/auth/login`, { email, password });
    setUser(data);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post(`${BACKEND_URL}/api/auth/register`, { name, email, password });
    setUser(data);
    return data;
  };

  const logout = async () => {
    await axios.post(`${BACKEND_URL}/api/auth/logout`);
    setUser(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center bg-background text-primary font-mono text-xl">INITIALIZING SECURE LINK...</div>;
  if (user === false) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  // Adding the dark mode class globally to the html root to ensure Shadcn acts properly
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <AuthProvider>
      <Toaster theme="dark" position="top-right" toastOptions={{ style: { borderRadius: '0px', border: '1px solid #262626', background: '#0A0A0A', color: '#fff', fontFamily: 'JetBrains Mono' } }} />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
