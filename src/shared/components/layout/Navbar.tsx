import { Menu } from "lucide-react";
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
          
          <img src={logoSrc} alt="PEI ePulse Logo" className="h-14 w-auto" />
        </div>

        <div className="navbar-right-group">
          <UserMenu />
        </div>
        
      </div>
    </header>
  );
}