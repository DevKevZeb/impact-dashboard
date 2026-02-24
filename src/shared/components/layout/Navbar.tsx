import { Search, Bell, HelpCircle, Menu } from "lucide-react";
import { UserMenu } from "@/features/auth/components/UserMenu";
import logoSrc from "@/assets/PEI ePulse Logo for WebApp.png";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="navbar-container">
      <div className="navbar-wrapper">
        
        <div className="navbar-left-group">
          <button onClick={onMenuClick} className="navbar-menu-btn">
            <Menu className="w-6 h-6" />
          </button>
          
          <img src={logoSrc} alt="PEI ePulse Logo" className="h-16 w-auto" />

          <div className="navbar-search-wrapper">
            <div className="navbar-search-icon">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="navbar-search-input"
            />
          </div>
        </div>

        <div className="navbar-right-group">
          <button className="navbar-icon-btn hidden sm:block">
            <HelpCircle className="w-5 h-5" />
          </button>

          <button className="navbar-icon-btn">
            <Bell className="w-5 h-5" />
            <span className="navbar-badge"></span>
          </button>
          
          <div className="navbar-divider"></div>

          <UserMenu />
        </div>
        
      </div>
    </header>
  );
}