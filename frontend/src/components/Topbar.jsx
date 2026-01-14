import { Search, Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { socket } from "../socket";

export default function Topbar() {

  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);   
  const bellRef = useRef();                

  useEffect(() => {
    fetchMe();
  }, []);

  const fetchMe = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/me`,
        { withCredentials: true }
      );
      setUser(res.data);
    } catch {
      console.log("User not logged in");
    }
  };

  useEffect(() => {
    if(user){
      socket.emit("register", user._id);
    }
  }, [user]);

  useEffect(() => {
    socket.on("hired", (data) => {
      setNotifications(prev => [data, ...prev]);
    });
    socket.on("new_bid", (data) => {
      setNotifications(prev => [data, ...prev]);
    });
    socket.on("bid_rejected", (data) => {
      setNotifications(prev => [data, ...prev]);
    });

    return () => {
      socket.off("hired");
      socket.off("new_bid");
      socket.off("bid_rejected");
    };
  }, []);

  useEffect(()=>{
    const close = (e)=>{
      if(bellRef.current && !bellRef.current.contains(e.target)){
        setOpen(false);
      }
    }
    document.addEventListener("click",close);
    return ()=>document.removeEventListener("click",close);
  },[])

  return (
    <div className="h-full px-6 flex items-center justify-between bg-white">
      
      <h1 className="text-lg font-semibold text-slate-800">Overview</h1>

      <div className="flex items-center gap-6">

        <div ref={bellRef} className="relative">

          <button
            onClick={()=>setOpen(!open)}
            className="relative p-2 text-gray-500 hover:text-indigo-600"
          >
            <Bell size={20} />

            {notifications.length > 0 && !open && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-72 bg-white border rounded-xl shadow-lg z-50">

              <p className="font-semibold px-4 py-3 border-b">
                Notifications
              </p>

              {notifications.length === 0 ? (
                <p className="text-sm text-gray-500 p-4 text-center">
                  No notifications
                </p>
              ) : (
                notifications.map((n,i)=>(
                  <div
                    key={i}
                    className="px-4 py-3 text-sm hover:bg-gray-50 border-b last:border-none"
                  >
                    {n.message}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-gray-200"></div>

        {user && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs">
              {user.name.charAt(0)}
            </div>

            <div className="hidden md:block">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-500">User</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
