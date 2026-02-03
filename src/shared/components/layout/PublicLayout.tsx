import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="fixed top-0 w-full h-16 border-b bg-white z-50">
        <PublicNavbar/>
      </header>
      <main className="pt-16">
        <Outlet />
      </main>

      <footer className="border-t py-6 text-center text-sm text-slate-500">
        © 2026 MyApp. All rights reserved.
      </footer>
    </div>
  );
}