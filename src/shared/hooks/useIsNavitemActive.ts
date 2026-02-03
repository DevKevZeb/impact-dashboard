// useNavActive.ts
import { useLocation } from "react-router-dom";
import type { NavItem } from "@/shared/types/navigation";

export function useNavActive() {
  const { pathname } = useLocation();

  const isItemActive = (item: NavItem) => {
    if (item.to) {
      return pathname === item.to;
    }

    if (item.children) {
      return item.children.some(child =>
        pathname === child.to || pathname.startsWith(child.to + "/")
      );
    }

    return false;
  };

  const isPathActive = (to: string) =>
    pathname === to || pathname.startsWith(to + "/");

  return { isItemActive, isPathActive };
}
