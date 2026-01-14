import { useEffect, useState } from "react";
import axios from "axios";
import { IndianRupee, Clock, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export default function MyBids() {
  const [bids, setBids] = useState([]);

  useEffect(() => {
    const fetchMyBids = async () => {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/bids/my-bids`, { withCredentials: true });
      setBids(res.data);
    };
    fetchMyBids();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'hired': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-amber-50 text-amber-700 border-amber-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-2xl font-bold text-slate-900">My Applications</h2>
        <p className="text-slate-500 text-sm">Track the status of your submitted proposals.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Project</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Your Bid</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bids.map((bid) => (
              <tr key={bid._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 line-clamp-1">{bid.gigId?.title || "Project Title"}</span>
                    <span className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <Clock size={12} /> Applied on {new Date(bid.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center font-medium text-slate-700">
                  <div className="flex items-center justify-center gap-1">
                    <IndianRupee size={14} /> {bid.price}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(bid.status)}`}>
                    {bid.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link 
                    to={`/gig/${bid.gigId?._id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    View Gig <ExternalLink size={14} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {bids.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 italic">You haven't applied to any gigs yet.</p>
            <Link to="/dashboard" className="text-indigo-600 font-bold text-sm mt-2 block">Browse Gigs</Link>
          </div>
        )}
      </div>
    </div>
  );
}