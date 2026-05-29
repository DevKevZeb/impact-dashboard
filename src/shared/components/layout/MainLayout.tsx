import { useEffect, useState } from "react";
import { Outlet, useMatch } from "react-router-dom";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

export function MainLayout() {
  const isDashboard = useMatch("/app/dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    const saved = window.localStorage.getItem("sidebar-open");
    return saved ? saved === "true" : true;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("sidebar-open", String(isSidebarOpen));
    }
  }, [isSidebarOpen]);

  if (isDashboard) {
    return (
      <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
        <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <Sidebar isOpen={isSidebarOpen} collapseToZero />
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label={isSidebarOpen ? "Hide sidebar" : "Show sidebar"} className={cn( "fixed top-18 z-40 hidden lg:flex", "items-center justify-center w-8 h-8 rounded-full", "bg-white border border-gray-200 shadow-md -translate-x-1/2", "text-[#1E3291] hover:bg-[#1E3291] hover:text-white hover:border-[#1E3291]", "transition-all duration-300 ease-in-out", isSidebarOpen ? "left-64" : "left-4" )} >
          {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
        </button>
        <main className={cn( "pt-16 flex-1 min-h-0 overflow-x-hidden overflow-y-auto transition-all duration-300 ease-in-out", isSidebarOpen ? "lg:pl-64" : "lg:pl-0" )} >
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <Sidebar isOpen={isSidebarOpen} />
      
      <main 
        className={cn(
          "pt-16 transition-all duration-300 ease-in-out min-h-screen",
          isSidebarOpen ? "lg:pl-64" : "lg:pl-20"
        )}
      >
        <div className="container mx-auto p-6 max-w-7xl animate-in fade-in duration-500">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
