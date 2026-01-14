import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Briefcase, ChevronRight, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";


export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
        form,
        { withCredentials: true }
      );
      setIsSuccess(true);
    } catch (err) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white p-10 rounded-2xl border border-slate-200 text-center shadow-sm">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h2>
          <p className="text-slate-500 mb-8">We've sent a verification link to <span className="font-semibold text-slate-800">{form.email}</span>.</p>
          <button 
            onClick={() => navigate("/login")}
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-all"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white font-sans">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Create an account</h2>
            <p className="text-slate-500">Start hiring or earning on GigFlow today.</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="name@company.com"
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">Password</label>
              <input
                type="password"
                placeholder="Min. 8 characters"
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 group"
            >
              {loading ? "Creating Account..." : "Get Started"} 
              {!loading && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm">
              Already have an account? 
              <button onClick={() => navigate("/login")} className="text-indigo-600 font-bold ml-1 hover:underline">
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 items-center justify-center p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10 max-w-md text-center">
            <div className="inline-flex items-center gap-3 mb-8 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                <Briefcase size={20} className="text-indigo-400" />
                <span className="text-sm font-medium">Join 5,000+ professionals</span>
            </div>
            <h1 className="text-4xl font-extrabold mb-6 leading-tight">
                The future of work is here.
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
                "GigFlow has completely changed how we scale our engineering team. It's fast, secure, and reliable."
            </p>
            <div className="mt-8 flex items-center justify-center gap-2">
                <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700"></div>
                    ))}
                </div>
                <span className="text-xs text-slate-500">Trusted by world-class teams</span>
            </div>
        </div>
      </div>
    </div>
  );
}