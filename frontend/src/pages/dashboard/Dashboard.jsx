import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Search, IndianRupee, Clock, ArrowRight, Filter } from "lucide-react";

export default function Dashboard() {
  const [gigs, setGigs] = useState([]);
  const [search, setSearch] = useState("");

  const fetchGigs = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/gigs?search=${search}`,
      { withCredentials: true }
    );
    setGigs(res.data);
  };

  useEffect(() => { fetchGigs(); }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Explore Gigs</h2>
          <p className="text-slate-500 text-sm">Find the perfect project to work on today.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              placeholder="Search by title..."
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64 transition-all"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={fetchGigs}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gigs.map((g) => (
          <div key={g._id} className="group bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  g.status === 'open' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {g.status.toUpperCase()}
                </span>
                <div className="flex items-center text-slate-900 font-bold text-lg">
                  <IndianRupee size={16} />
                  {g.budget}
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                {g.title}
              </h3>
              <p className="text-slate-600 text-sm mt-2 line-clamp-2 leading-relaxed">
                {g.description || "No description provided for this gig."}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
               <div className="flex items-center gap-2 text-slate-400 text-xs">
  <Clock size={14} />
  <span>
    Posted on {g.createdAt ? new Date(g.createdAt).toLocaleDateString() : "Unknown"}
  </span>
</div>
               <Link
                to={`/gig/${g._id}`}
                className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:gap-2 transition-all"
              >
                View Details <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {gigs.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-500">No gigs found matching your search.</p>
        </div>
      )}
    </div>
  );
}