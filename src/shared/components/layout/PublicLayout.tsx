import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";
import Footer from "./Footer";
import ScrollToTop from "../ScrollTop";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <ScrollToTop/>
      <header className="fixed top-0 w-full h-28 border-b bg-white z-50">
        <PublicNavbar/>
      </header>
      <main className="pt-20 min-h-screen">
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
}