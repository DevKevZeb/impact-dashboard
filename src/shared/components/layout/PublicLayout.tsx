import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";
import Footer from "./Footer";
import ScrollToTop from "../ScrollTop";
import { useEmbedMode } from "../../../hooks/useEmbedMode";
import { useEffect } from "react";

export function PublicLayout() {
  const isEmbedded = useEmbedMode();

  useEffect(() => {
    if (isEmbedded) {
      document.body.classList.add("embed-mode");
      document.documentElement.classList.add("embed-mode");
    }

    return () => {
      document.body.classList.remove("embed-mode");
      document.documentElement.classList.remove("embed-mode");
    };
  }, [isEmbedded]);

  return (
    <div className={isEmbedded ? "bg-slate-50" : "min-h-screen bg-slate-50"}>
      <ScrollToTop />

      {!isEmbedded && (
        <header className="fixed top-0 w-full h-28 border-b bg-white z-50">
          <PublicNavbar />
        </header>
      )}

      <main
        className={
          isEmbedded
            ? "pt-0"
            : "pt-20 min-h-screen"
        }
      >
        <Outlet />
      </main>

      {!isEmbedded && <Footer />}
    </div>
  );
}