import { cn } from "@/lib/utils";
import { useNavActive } from "@/shared/hooks/useIsNavitemActive";
import { publicNavigation } from "@/shared/types/navigation";
import { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useClickOutside } from "@/shared/hooks/uselickOutside";
import { ChevronDown, ChevronUp, CircleUserRound } from "lucide-react";


export function PublicMobileNavbar({ onNavigate, ignoreRef, }: { onNavigate: () => void, ignoreRef?: React.RefObject<HTMLElement | null> }) {
  const [open, setOpen] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, onNavigate, ignoreRef);
  const { isItemActive, isPathActive } = useNavActive();


  return (
    <div ref={ref} className="absolute top-full left-0 w-full bg-white border-t shadow-lg  min-[1290px]:hidden z-50" >
      <div className="divide-y">
        <div>
          {publicNavigation.map((item) => {
            const isActive = isItemActive(item);
            const expanded = open === item.label;

            return (
              <div key={item.label}>
                {!item.children && item.to && (
                  <NavLink to={item.to} onClick={onNavigate} className={cn( "block px-6 py-4 text-left cursor-pointer text-base", isActive ? "selected-nav-label-color font-medium" : "nav-label-color" )} >
                    {item.label}
                  </NavLink>
                )}

                {item.children && (
                  <>
                    <button onClick={() =>setOpen(expanded ? null : item.label)} className={cn( "w-full flex cursor-pointer items-center justify-between px-6 py-4 text-left", isActive && "selected-nav-label-color font-medium" )} >
                      {item.label}
                      <span className="ml-2 flex items-center">
                        {expanded ? (
                          <ChevronUp className="w-5 h-5 selected-nav-label-color" />
                        ) : (
                          <ChevronDown className="w-5 h-5 nav-label-color" />
                        )}
                      </span>

                    </button>

                    {expanded && (
                      <div className="pl-8 pb-3 bg-slate-50">
                        {item.children.map((child) => {
                          return (
                          <NavLink key={child.to} to={child.to} onClick={onNavigate} className={cn( "block pb-2 text-sm font-medium cursor-pointer", isPathActive(child.to) ? "selected-nav-label-color" : "nav-label-color" )} >
                            {child.label}
                          </NavLink>
                        )
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
        <div className="py-4 flex items-center gap-2  justify-center">
          <NavLink to="/login" className="btn-secondary flex space-x-2 items-center">
            <CircleUserRound className="text-white w-5 h-5"/>
            <span>Login</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
