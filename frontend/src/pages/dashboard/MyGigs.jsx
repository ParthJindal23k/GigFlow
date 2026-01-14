import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Briefcase, IndianRupee, Users, ArrowRight, Plus } from "lucide-react";

export default function MyGigs() {
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    fetchMyGigs();
  }, []);

  const fetchMyGigs = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/gigs/my`,
      { withCredentials: true }
    );
    setGigs(res.data);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Posted Gigs</h2>
          <p className="text-slate-500 text-sm">Manage your job listings and review incoming bids.</p>
        </div>
        <Link 
          to="/post" 
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-sm"
        >
          <Plus size={18} /> Post New Gig
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Project Title</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Budget</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {gigs.map((g) => (
                <tr key={g._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Briefcase size={18} />
                      </div>
                      <span className="font-semibold text-slate-900">{g.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-slate-700 font-medium">
                      <IndianRupee size={14} />
                      {g.budget}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      g.status === 'open' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {g.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/gig/${g._id}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      Manage Bids <Users size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {gigs.length === 0 && (
          <div className="text-center py-16 px-4">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="text-slate-300" size={32} />
            </div>
            <h3 className="text-slate-900 font-bold text-lg">No gigs posted yet</h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-2 mb-6">
              You haven't posted any job opportunities yet. Start by creating your first gig.
            </p>
            <Link 
              to="/post" 
              className="text-indigo-600 font-bold hover:underline inline-flex items-center gap-1"
            >
              Post your first gig <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}