import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LayoutDashboard,
  PlusCircle,
  Briefcase,
  HandCoins,
  LogOut,
  Layers
} from "lucide-react";

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "My Gigs", path: "/my-gigs", icon: Briefcase },
    { name: "My Bids", path: "/my-bids", icon: HandCoins },
  ];

  const secondaryMenu = [
    { name: "Post a Gig", path: "/post", icon: PlusCircle },
  ];

  return (
    <aside className="h-full flex flex-col bg-white text-slate-900">
      
      <div className="h-16 flex items-center gap-2 px-6 border-b border-gray-100">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Briefcase className="text-white w-5 h-5" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
          GigFlow
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-6">
        
<div>
  <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
    Menu
  </p>
  <ul className="space-y-1">
    {menu.map((item) => {
      const Icon = item.icon;
      const isActive = pathname === item.path;
      return (
        <li key={item.name}> 
          <Link
            to={item.path}
            className={`
              flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
              ${isActive 
                ? "bg-indigo-50 text-indigo-700" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
            `}
          >
            <Icon size={18} className={isActive ? "text-indigo-600" : "text-slate-400"} />
            {item.name}
          </Link>
        </li>
      );
    })}
  </ul>
</div>

        <div>
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Actions
          </p>
          <ul className="space-y-1">
            {secondaryMenu.map((item) => (
               <li key={item.path}>
               <Link
                 to={item.path}
                 className="
                   flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                   text-slate-600 hover:bg-slate-50 hover:text-slate-900
                 "
               >
                 <IconWrapper icon={item.icon} />
                 {item.name}
               </Link>
             </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

const IconWrapper = ({ icon: Icon }) => <Icon size={18} className="text-slate-400" />;