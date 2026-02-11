import { useRef, useState } from "react";
import { PublicDesktopNavbar } from "./PublicDesktopNavbar";
import { NavLink } from "react-router-dom";
import { PublicMobileNavbar } from "./PublicMobileNavbar";
import { CircleUserRound, Menu, Plus } from "lucide-react";
import logoSrc from "@/assets/Pacific-Ecommerce-Initiative.webp";

export default function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div className="relative h-auto bg-white shadow-md">
      <div className="container mx-auto h-28 flex items-center justify-between px-6">
        <img src={logoSrc} alt="Pacific E-commerce Initiative Logo" className="h-16 w-auto" />

        <PublicDesktopNavbar />

        <div className="hidden lg:flex items-center gap-3">
          <NavLink to="/register" className="btn-primary flex space-x-2 items-center">
            <Plus className="w-5 h-5"/>
            <span>Register</span>
          </NavLink>
          <NavLink to="/login" className="btn-secondary flex space-x-2 items-center">
            <CircleUserRound className="text-white w-5 h-5"/>
            <span>Login</span>
          </NavLink>
        </div>

        <button className="lg:hidden" ref={buttonRef} onClick={() => setMobileOpen(!mobileOpen)}>
          <Menu className="w-6 h-6"/>
        </button>
      </div>
      {mobileOpen && <PublicMobileNavbar ignoreRef={buttonRef} onNavigate={() => setMobileOpen(false)} />}  
    </div>
  );
}
