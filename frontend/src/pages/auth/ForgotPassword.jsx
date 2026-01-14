import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/forgot`, { email });
      setMsg("Reset link has been sent to your inbox.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not find an account with that email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200 w-full max-w-md">
        
        <button 
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back to Login
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Forgot Password?</h2>
          <p className="text-slate-500 mt-2">Enter your email and we'll send you a link to reset your password.</p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <div className="relative">
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">Email Address</label>
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="email"
                    placeholder="name@company.com"
                    className="w-full p-3 pl-10 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-all flex items-center justify-center"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          {msg && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium border border-emerald-100">
              <CheckCircle2 size={18} /> {msg}
            </div>
          )}
          
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-100">
              <AlertCircle size={18} /> {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}