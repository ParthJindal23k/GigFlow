import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function AppLayout() {

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans text-slate-900 overflow-hidden">
      
      <div className="flex-shrink-0 w-64 h-full border-r border-gray-200 bg-white shadow-sm hidden md:block z-20">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col h-full relative overflow-hidden">

        <header className="flex-shrink-0 h-16 bg-white border-b border-gray-200 shadow-sm z-10">
          <Topbar />
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50/50">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}
