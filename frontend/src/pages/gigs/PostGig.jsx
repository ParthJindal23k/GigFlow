import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Rocket, IndianRupee, FileText, Type } from "lucide-react";

export default function PostGig() {
  const [form, setForm] = useState({ title: "", description: "", budget: "" });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/gigs`, form, { withCredentials: true });
      nav("/dashboard");
    } catch (error) {
      console.error("Failed to post gig", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-600 rounded-xl text-white">
          <Rocket size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Post a New Gig</h2>
          <p className="text-slate-500 text-sm">Tell the community what you need help with.</p>
        </div>
      </div>

      <form onSubmit={submit} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <Type size={16} className="text-slate-400" /> Project Title
          </label>
          <input
            placeholder="e.g. Build a Modern Landing Page in React"
            className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <p className="text-xs text-slate-400 mt-1.5">Be descriptive to attract the best talent.</p>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <FileText size={16} className="text-slate-400" /> Detailed Description
          </label>
          <textarea
            placeholder="Describe the scope of work, technical requirements, and timeline..."
            rows="6"
            className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <IndianRupee size={16} className="text-slate-400" /> Budget
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
            <input
              placeholder="5000"
              type="number"
              className="w-full border border-slate-200 rounded-lg p-3 pl-8 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="pt-4 flex gap-3">
          <button 
            type="button" 
            onClick={() => nav(-1)}
            className="flex-1 px-6 py-3 border border-slate-200 rounded-lg font-semibold text-slate-600 hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button 
            disabled={loading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-6 py-3 rounded-lg font-semibold shadow-lg shadow-indigo-100 transition-all"
          >
            {loading ? "Posting..." : "Create Gig"}
          </button>
        </div>
      </form>
    </div>
  );
}