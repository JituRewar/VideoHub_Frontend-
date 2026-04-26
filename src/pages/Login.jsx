import { useState } from "react";
import { API } from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiLoader } from "react-icons/fi";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if(!email || !password) return setError("All fields required");
    try {
      setLoading(true);
      setError("");
      const res = await API.post("/v1/users/login", { email, password });
      setUser(res.data.data.user || res.data.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Invalid credentials. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100 w-full max-w-md">
        
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-black italic tracking-tighter text-red-600 inline-block mb-2">
            VideoHub
          </Link>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">
            Welcome Back
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all font-medium text-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
              <span className="text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer transition-colors">
                Forgot?
              </span>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all font-medium text-gray-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-medium p-3 rounded-lg flex items-start gap-2">
              <span className="mt-0.5">⚠️</span> 
              <span>{error}</span>
            </div>
          )}

          <button 
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-red-600/30 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center mt-2"
          >
            {loading ? <FiLoader className="animate-spin text-xl" /> : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center text-gray-500 text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-red-600 font-bold hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;