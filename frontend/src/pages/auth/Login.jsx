import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Briefcase, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";


export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, form, { withCredentials: true });
      navigate("/dashboard");
    } catch (err) {
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 items-center justify-center p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/50 rounded-full -ml-48 -mb-48"></div>
        
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Briefcase className="text-indigo-600" size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight">GigFlow</span>
          </div>
          <h1 className="text-4xl font-extrabold mb-6 leading-tight">
            Connect with the best talent in the industry.
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed">
            Join thousands of freelancers and clients getting work done faster than ever before.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h2>
            <p className="text-slate-500">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="name@company.com"
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <button 
                  type="button"
                  onClick={() => navigate("/forgot")} 
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-3.5 rounded-lg font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2 group"
            >
              Sign In <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm">
              Don't have an account? 
              <button
                onClick={() => navigate("/register")}
                className="text-indigo-600 font-bold ml-1 hover:underline"
              >
                Create an account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}