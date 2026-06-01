import { LayoutDashboard, Settings, Briefcase, Users, ChevronDown, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";
import { SCOPES } from "@/features/auth/utils/permissions";

interface SidebarProps {
  isOpen: boolean;
  /** When true, the sidebar collapses to w-0 on all screen sizes (no mini-sidebar). */
  collapseToZero?: boolean;
}

type MenuItem = {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
  requiredScopes?: string[];
  requiredAllScopes?: string[];
  requiredRoles?: string[];
  children?: {
    title: string;
    path: string;
    icon?: React.ComponentType<{ className?: string }>;
    requiredScopes?: string[];
    requiredAllScopes?: string[];
    requiredRoles?: string[];
    hideForAdmin?: boolean;
  }[];
};


const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    children: [
      { title: "Admin Dashboard", path: "/app/admin-dashboard", requiredRoles: ["admin"] },
      {
        title: "Country Dashboard",
        path: "/app/country-kpa",
        requiredRoles: ["admin", "country-manager"],
      },
      {
        title: "Project Dashboard", 
        path: "/app/dashboard",
        requiredAllScopes: [SCOPES.PROJECTS_READ, SCOPES.PROJECTS_WEIGHT],
        hideForAdmin: true,
      },
      {
        title: "Manage Users",
        path: "/app/country-dashboard-share",
        requiredRoles: ["country-manager"],
        hideForAdmin: true,
      },
    ],
  },
  {
    title: "Configuration",
    icon: Settings,
    children: [
      { title: "Countries", path: "/app/config/countries", requiredScopes: [SCOPES.COUNTRIES_READ] },
      { title: "Indicator Types", path: "/app/config/indicator-types", requiredScopes: [SCOPES.INDICATOR_TYPES_READ] },
      { title: "KPAs", path: "/app/config/kpas", requiredScopes: [SCOPES.KPAS_READ] },
      { title: "Program Status", path: "/app/config/program-states", requiredScopes: [SCOPES.PROGRAM_STATES_READ] },
      { title: "Project Status", path: "/app/config/project-states", requiredScopes: [SCOPES.PROJECT_STATES_READ] },
      { title: "SDGs", path: "/app/config/sdgs", requiredScopes: [SCOPES.SDGS_READ] },
    ],
  },
  {
    title: "Programs & Projects",
    icon: Briefcase,
    children: [
      { title: "Programs", path: "/app/programs", requiredScopes: [SCOPES.PROGRAMS_READ] },
      { title: "Projects", path: "/app/projects", requiredScopes: [SCOPES.PROJECTS_READ] },
      { 
        title: "Countries", 
        path: "/app/countries", 
        requiredRoles: ["project-manager"],
        hideForAdmin: true 
      },
    ],
  },
  {
    title: "Resources",
    icon: Users,
    children: [
      {
        title: "Donors",
        path: "/app/resources/donors",
        requiredRoles: ["admin", "country-manager"],
      },
      { title: "Beneficiaries", path: "/app/resources/beneficiaries", requiredScopes: [SCOPES.BENEFICIARIES_READ] },
      { title: "Implementing Agencies", path: "/app/resources/agencies", requiredScopes: [SCOPES.AGENCIES_READ] },
    ],
  },
  // Country Access menu removed per new UI structure (manage users moved under Users)
  {
    title: "Administration",
    icon: ShieldCheck,
    children: [
      { title: "Unverified Email Users", path: "/app/admin/users/unverified", requiredScopes: [SCOPES.USERS_READ] },
      { title: "Pending Approvals", path: "/app/admin/users", requiredScopes: [SCOPES.USERS_READ] },
      { title: "User Management", path: "/app/admin/users/active", requiredScopes: [SCOPES.USERS_READ] },
      { title: "Admin Management", path: "/app/admin/users/admins", requiredScopes: [SCOPES.USERS_WRITE] },
      { title: "Roles & Permissions", path: "/app/admin/roles-permissions", requiredScopes: [SCOPES.ROLES_READ, SCOPES.ROLES_WRITE] },
    ],
  },
];


export function Sidebar({ isOpen, collapseToZero = false }: SidebarProps) {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(["Configuration"]);
  const user = useAuthStore((state) => state.user);
  const hasScope = useAuthStore((state) => state.hasScope);
  const isAdmin = (user?.roles ?? []).some((role) => role.name === "admin");

  const isRouteActive = (targetPath: string) => {
    return (
      location.pathname === targetPath ||
      location.pathname.startsWith(`${targetPath}/`)
    );
  };

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  const filterMenuItem = (item: MenuItem): MenuItem | null => {
    if (isAdmin && item.title === "Programs & Projects") {
      return null;
    }

    if (item.children) {
      const filteredChildren = item.children.filter((child) => {
        if (isAdmin && child.hideForAdmin) {
          return false;
        }

        if (child.requiredRoles?.length) {
          const userRoles = (user?.roles ?? []).map((role) => role.name);
          return child.requiredRoles.some((role) => userRoles.includes(role));
        }

        if (child.requiredAllScopes?.length) {
          return child.requiredAllScopes.every((scope) => hasScope(scope));
        }

        if (child.requiredScopes?.length) {
          return child.requiredScopes.some((scope) => hasScope(scope));
        }
        return true;
      });

      if (filteredChildren.length === 0) return null;
      return { ...item, children: filteredChildren };
    }

    if (item.requiredAllScopes?.length) {
      return item.requiredAllScopes.every((scope) => hasScope(scope)) ? item : null;
    }

    if (item.requiredScopes?.length) {
      return item.requiredScopes.some((scope) => hasScope(scope)) ? item : null;
    }

    return item;
  };

  const filteredMenuItems = menuItems
    .map(filterMenuItem)
    .filter((item): item is MenuItem => item !== null);

  return (
    <aside
      className={cn(
        "fixed left-0 top-20 bottom-0 z-40 transition-all duration-300 overflow-y-auto",
        "bg-white border-r",
        isOpen ? "w-64" : collapseToZero ? "w-0" : "w-0 lg:w-20"
      )}
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className="pt-6 pb-4 flex flex-col gap-1">
        {filteredMenuItems.map((item) => {
          const isActive =
            (item.path ? isRouteActive(item.path) : false) ||
            item.children?.some((child) => isRouteActive(child.path));

          const isExpanded = expandedItems.includes(item.title);
          const Icon = item.icon;

          return (
            <div key={item.title} className="px-3">

              {/* PARENT ITEM */}
              <button
                onClick={() => isOpen && toggleExpand(item.title)}
                className={cn(
                  "w-full flex items-center justify-between p-2.5 rounded-xl transition-all",
                  isActive ? "font-medium" : "hover:bg-(--color-muted)"
                )}
                style={{
                  color: isActive
                    ? "var(--color-secondary)": "",
                  backgroundColor: isActive
                    ? "color-mix(in oklch, var(--color-primary) 12%, white)"
                    : "transparent",
                }}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 shrink-0" />
                  <span
                    className={cn(
                      "text-sm transition-opacity duration-200",
                      isOpen ? "opacity-100" : "opacity-0 hidden lg:block"
                    )}
                  >
                    {item.title}
                  </span>
                </div>

                {item.children && isOpen && (
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform",
                      isExpanded ? "rotate-180" : ""
                    )}
                  />
                )}
              </button>
              {item.children && (
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300 space-y-1",
                    isExpanded && isOpen ? "max-h-[500px] mt-1 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  {item.children.map((child) => {
                    const isChildActive = isRouteActive(child.path);

                    return (
                      <Link
                        key={child.path}
                        to={child.path}
                        className="flex items-center pl-10 pr-3 py-2 rounded-lg text-sm transition-all"
                        style={{
                          color: isChildActive? "var(--color-secondary)":"",
                          backgroundColor: isChildActive ? "color-mix(in oklch, var(--color-primary) 8%, white)" : "transparent",
                        }}
                      >
                        <span className="truncate">
                          {child.title}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}