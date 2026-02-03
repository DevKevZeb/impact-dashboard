import { NavLink } from "react-router-dom";
import { publicNavigation } from "@/shared/types/navigation";
import { cn } from "@/lib/utils";
import { useNavActive } from "@/shared/hooks/useIsNavitemActive";

export function PublicDesktopNavbar() {
  const { isItemActive, isPathActive } = useNavActive();

  return (
    <nav className="hidden lg:flex items-center gap-8">
      {publicNavigation.map((item) => {
        
        return (
          <div key={item.label} className="relative group">
            {!item.children && item.to && (
              <NavLink to={item.to} end className={cn(
                    "relative pb-2 text-md font-medium", 
                    isItemActive(item) ? "selected-nav-label-color" : "nav-label-color" )}>
                <span className={cn(
                    "absolute left-0 -top-5 h-[2px] w-full rounded-full transition",
                    isItemActive(item) ? "span-line-color opacity-100" : "span-line-color opacity-0 group-hover:opacity-40" )}
                />
                <span>{item.label}</span>
              </NavLink>
            )}

            {item.children && (
              <>
                <span className={cn(
                    "relative pb-2 text-md font-medium cursor-pointer",
                    isItemActive(item) ? "selected-nav-label-color" : "nav-label-color" )}
                >
                  <span className={cn(
                      "absolute left-0 -top-5 h-[2px] w-full rounded-full transition",
                      isItemActive(item) ? "span-line-color opacity-100" : "span-line-color opacity-0 group-hover:opacity-40" )}
                  />
                  <span>{item.label}</span>
                </span>

                <div className="absolute left-0 top-full mt-3 w-48 rounded-md bg-white shadow-lg border opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all">
                  <ul className="py-2">
                    {item.children.map((child) => {
                    
                      return (<NavLink key={child.to} to={child.to} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" >
                        <span className={cn(
                            "relative pb-2 text-sm font-medium cursor-pointer",
                            isPathActive(child.to) ? "selected-nav-label-color" : "nav-label-color" )}
                        >
                          {child.label}
                        </span>
                      </NavLink>
                    )})}
                  </ul>
                </div>
              </>
            )}
          </div>
        );
      })}
    </nav>
  );
}
