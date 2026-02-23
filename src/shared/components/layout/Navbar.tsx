import { Search, Bell, HelpCircle, Menu } from "lucide-react";
import { UserMenu } from "@/features/auth/components/UserMenu";
import logoSrc from "@/assets/PEI ePulse Logo for WebApp.png";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#DEF0F8]">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center gap-4 lg:gap-8">
          <button onClick={onMenuClick} className="lg:hidden p-1 hover:bg-white/20 rounded-md transition-colors" >
            <Menu className="w-6 h-6 text-slate-800" />
          </button>
          
          <img src={logoSrc} alt="PEI ePulse Logo" className="h-16   w-auto" />

          <div className="hidden md:flex relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 t group-focus-within:text-sky-600 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-1.5 bg-white/20 border border-white/20 rounded-full text-sm   focus:outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-500 w-64 transition-all duration-200 backdrop-blur-sm hover:bg-white/30 focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          <button className="p-2 hover:bg-white/20 rounded-full transition-colors relative group">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-400 rounded-full border-2 border-emerald-500"></span>
          </button>
          
          <button className="p-2 hover:bg-white/20 rounded-full transition-colors hidden sm:block group">
            <HelpCircle className="w-5 h-5 " />
          </button>

          <div className="h-8 w-px bg-white/20 mx-1 hidden sm:block"></div>

          <UserMenu />
        </div>
      </div>
    </header>
  );
}
