import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { IndianRupee, MessageSquare, Send, CheckCircle2, User } from "lucide-react";
import { toast } from "react-toastify";


export default function GigDetails() {
  const { id } = useParams();

  const [gig, setGig] = useState({});
  const [bids, setBids] = useState([]);
  const [message, setMessage] = useState("");
  const [price, setPrice] = useState("");

  const [me, setMe] = useState(null);

  useEffect(() => {
    fetchGig();
    fetchBids();
    fetchMe();   
  }, []);

  const fetchMe = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/me`,
      { withCredentials: true }
    );
    setMe(res.data);
  };

  const fetchGig = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/gigs`
    );
    setGig(res.data.find((g) => g._id === id));
  };

  const fetchBids = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/bids/${id}`,
      { withCredentials: true }
    );
    setBids(res.data);
  };

  const submitBid = async () => {

    if (me?._id === gig?.ownerId) {
      return toast.error("You cannot apply to your own gig");
    }

    if (!message || !price)
      return toast.error("Please fill all fields");

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/bids`,
        { gigId: id, message, price },
        { withCredentials: true }
      );

      setMessage("");
      setPrice("");
      fetchBids();

    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  const hire = async (bidId) => {

    if (me?._id !== gig?.ownerId) {
      return toast.error("Only owner can hire");
    }

    await axios.patch(
      `${import.meta.env.VITE_BACKEND_URL}/api/bids/${bidId}/hire`,
      {},
      { withCredentials: true }
    );

    fetchBids();
    fetchGig();
  };

  const reject = async (bidId) => {
    if (me?._id !== gig?.ownerId) {
      return toast.error("Only owner can reject bids");
    }

    await axios.patch(
      `${import.meta.env.VITE_BACKEND_URL}/api/bids/${bidId}/reject`,
      {},
      { withCredentials: true }
    );

    fetchBids();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Project Details
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">{gig?.title}</h2>
          <div className="flex items-center gap-6 text-slate-600 mb-8 pb-8 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <IndianRupee size={20} className="text-emerald-600" />
              <span className="text-xl font-bold text-slate-900">{gig?.budget}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${gig?.status === 'open' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              <span className="capitalize font-medium">{gig?.status}</span>
            </div>
          </div>
          <h4 className="font-bold text-slate-900 mb-2">Description</h4>
          <p className="text-slate-600 leading-relaxed text-lg">{gig?.description}</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare size={20} /> Proposals ({bids.length})
          </h3>
          {bids.map((b) => (
            <div key={b._id} className={`bg-white border rounded-xl p-5 transition-all ${b.status === 'hired'
                ? 'border-emerald-500 ring-1 ring-emerald-500'
                : b.status === 'rejected'
                  ? 'border-red-400 ring-1 ring-red-400'
                  : 'border-slate-200'
              }`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                    <User size={20} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Freelancer Proposal</p>
                    <p className="text-xs text-slate-400">Bid Amount: ₹{b.price}</p>
                  </div>
                </div>
                {b.status === 'hired' && (
                  <span className="flex items-center gap-1 text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full">
                    <CheckCircle2 size={16} /> Selected
                  </span>
                )}
                {b.status === 'rejected' && (
                  <span className="flex items-center gap-1 text-red-600 font-bold text-sm bg-red-50 px-3 py-1 rounded-full">
                    Rejected
                  </span>
                )}
              </div>
              <p className="mt-4 text-slate-600 text-sm italic">"{b.message}"</p>
            </div>
          ))}        </div>
      </div>

      {me?._id !== gig?.ownerId && (
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Submit a Proposal</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Your Bid (₹)</label>
                <input
                  type="number"
                  placeholder="Ex: 5000"
                  className="w-full border border-slate-200 rounded-lg p-3 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Cover Letter</label>
                <textarea
                  placeholder="Why should you be hired?"
                  rows="4"
                  className="w-full border border-slate-200 rounded-lg p-3 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <button
                onClick={submitBid}
                disabled={gig?.status !== 'open'}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Send size={18} /> {gig?.status === 'open' ? 'Send Proposal' : 'Gig Closed'}
              </button>
              <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest mt-4">
                Secure transactions via GigFlow
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
