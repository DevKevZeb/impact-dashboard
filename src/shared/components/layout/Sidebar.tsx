import { 
    LayoutDashboard, 
    Settings, 
    Briefcase, 
    Users, 
    FileBarChart,
    Building2,
    Flag,
    Globe,
    FolderKanban,
    Link as LinkIcon,
    Wallet,
    FileText,
    ChevronDown,
    ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";
import { SCOPES } from "@/features/auth/utils/permissions";

interface SidebarProps {
    isOpen: boolean;
}

type MenuItem = {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    path?: string;
    requiredScopes?: string[]; // Scopes needed to see this item
    children?: { title: string; path: string; icon?: React.ComponentType<{ className?: string }>; requiredScopes?: string[] }[];
};

const menuItems: MenuItem[] = [
    {
    title: "Dashboard",
    icon: LayoutDashboard,
    children: [
        { title: "Admin Dashboard", path: "/app", icon: LinkIcon },
        { title: "Project Dashboard", path: "/app/dashboard", icon: LinkIcon },
        { title: "Country Dashboard", path: "/app/country-kpa", icon: LinkIcon, requiredScopes: [SCOPES.COUNTRIES_READ, SCOPES.KPAS_READ] },
    ],
    },
    {
    title: "Configuration",
    icon: Settings,
    children: [
        { title: "Agencies", path: "/app/config/agencies", icon: Building2, requiredScopes: [SCOPES.AGENCIES_READ] },
        { title: "Countries", path: "/app/config/countries", icon: Globe, requiredScopes: [SCOPES.COUNTRIES_READ] },
        { title: "Indicator Types", path: "/app/config/indicator-types", icon: LinkIcon, requiredScopes: [SCOPES.INDICATOR_TYPES_READ] },
        { title: "KPAs", path: "/app/config/kpas", icon: Building2, requiredScopes: [SCOPES.KPAS_READ] },
        { title: "Program States", path: "/app/config/program-states", icon: LinkIcon, requiredScopes: [SCOPES.PROGRAM_STATES_READ] },
        { title: "Project States", path: "/app/config/project-states", icon: LinkIcon, requiredScopes: [SCOPES.PROJECT_STATES_READ] },
        { title: "SDGs", path: "/app/config/sdgs", icon: Flag, requiredScopes: [SCOPES.SDGS_READ] },

    ],
    },
    {
    title: "Programs & Projects",
    icon: Briefcase,
    children: [
        { title: "Programs", path: "/app/programs", icon: FolderKanban, requiredScopes: [SCOPES.PROGRAMS_READ] },
        { title: "Projects", path: "/app/projects", icon: FolderKanban, requiredScopes: [SCOPES.PROJECTS_READ] },
    ],
},
    {
    title: "Resources",
    icon: Users,
    children: [
        { title: "Donors", path: "/app/resources/donors", icon: Wallet, requiredScopes: [SCOPES.DONORS_READ] },
        { title: "Beneficiaries", path: "/app/resources/beneficiaries", icon: Users, requiredScopes: [SCOPES.BENEFICIARIES_READ] },
    //   { title: "Contacts", path: "/resources/contacts", icon: Contact },
    ],
    },
    {
    title: "Administration",
    icon: ShieldCheck,
    children: [
        { title: "Users", path: "/app/admin/users", icon: Users, requiredScopes: [SCOPES.USERS_READ] },
        { title: "Pending Approvals", path: "/app/admin/users", icon: Users, requiredScopes: [SCOPES.USERS_READ] },
        { title: "User Management", path: "/app/admin/users/active", icon: Users, requiredScopes: [SCOPES.USERS_READ] },
    ],
    },
    {
    title: "Reports",
    icon: FileBarChart,
    children: [
        { title: "Performance", path: "/app/reports/performance", icon: FileText },
        { title: "Budget Analysis", path: "/app/reports/budget", icon: FileText },
        { title: "Impact Report", path: "/app/reports/impact", icon: FileText },
    ],
    },
];

export function Sidebar({ isOpen }: SidebarProps) {
    const location = useLocation();
    const [expandedItems, setExpandedItems] = useState<string[]>(["Configuration", "Programs & Projects"]);

    const toggleExpand = (title: string) => {
    setExpandedItems((prev) =>
        prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
    };

    // Get hasScope function from auth store
    const hasScope = useAuthStore((state) => state.hasScope);

    // Filter menu items based on permissions
    const filterMenuItem = (item: MenuItem): MenuItem | null => {
        // If item has children, filter them
        if (item.children) {
            const filteredChildren = item.children
                .filter(child => {
                    // Check if user has required scopes for this child
                    if (child.requiredScopes && child.requiredScopes.length > 0) {
                        // Check if user has at least one of the required scopes
                        return child.requiredScopes.some(scope => hasScope(scope));
                    }
                    return true; // No scopes required, show by default
                });

            // If no children remain after filtering, hide the parent
            if (filteredChildren.length === 0) return null;

            return { ...item, children: filteredChildren };
        }

        // If item has required scopes, check them
        if (item.requiredScopes && item.requiredScopes.length > 0) {
            // Check if user has at least one of the required scopes
            return item.requiredScopes.some(scope => hasScope(scope)) ? item : null;
        }

        return item; // No scopes required, show by default
    };

    const filteredMenuItems = menuItems
        .map(filterMenuItem)
        .filter((item): item is NonNullable<typeof item> => item !== null);

    return (
    <aside
        className={cn(
        "fixed left-0 top-16 bottom-0 z-40 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out overflow-y-auto",
        isOpen ? "w-64" : "w-0 lg:w-20"
        )}
    >
        <div className="py-4 flex flex-col gap-1">
        {filteredMenuItems.map((item) => {
            const isActive = item.path === location.pathname || item.children?.some(child => child.path === location.pathname);
            const isExpanded = expandedItems.includes(item.title);
            const Icon = item.icon;

            return (
            <div key={item.title} className="px-3">
                {item.children ? (
                <>
                    <button
                    onClick={() => isOpen && toggleExpand(item.title)}
                    className={cn(
                        "w-full flex items-center justify-between p-2.5 rounded-lg transition-colors group",
                        isActive ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                    title={!isOpen ? item.title : undefined}
                    >
                    <div className="flex items-center gap-3">
                        <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-emerald-600" : "text-gray-500 group-hover:text-gray-700")} />
                        <span className={cn("font-medium text-sm transition-opacity duration-200", isOpen ? "opacity-100" : "opacity-0 hidden lg:block")}>
                        {item.title}
                        </span>
                    </div>
                    {isOpen && (
                        <ChevronDown
                        className={cn(
                            "w-4 h-4 transition-transform duration-200",
                            isExpanded ? "transform rotate-180" : ""
                        )}
                        />
                    )}
                    </button>

                    {/* Submenu */}
                    <div
                    className={cn(
                        "overflow-hidden transition-all duration-300 ease-in-out space-y-0.5",
                        isExpanded && isOpen ? "max-h-[500px] mt-1 opacity-100" : "max-h-0 opacity-0"
                    )}
                    >
                    {item.children.map((child, index) => {
                        const isChildActive = location.pathname === child.path;
                        return (
                        <Link
                            key={index}
                            to={child.path}
                            className={cn(
                            "flex items-center gap-3 pl-10 pr-3 py-2 rounded-lg text-sm transition-colors",
                            isChildActive
                                ? "text-emerald-700 font-medium bg-emerald-50/50"
                                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                            )}
                        >
                          {/* <div className={cn("w-1.5 h-1.5 rounded-full", isChildActive ? "bg-emerald-600" : "bg-gray-300")} /> */}
                            <span className="truncate">{child.title}</span>
                        </Link>
                        );
                    })}
                    </div>
                </>
                ) : (
                <Link
                    to={item.path!}
                    className={cn(
                    "flex items-center gap-3 p-2.5 rounded-lg transition-colors group",
                    isActive ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                    title={!isOpen ? item.title : undefined}
                >
                    <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-emerald-600" : "text-gray-500 group-hover:text-gray-700")} />
                    <span className={cn("font-medium text-sm transition-opacity duration-200", isOpen ? "opacity-100" : "opacity-0 hidden lg:block")}>
                    {item.title}
                    </span>
                </Link>
                )}
            </div>
            );
        })}
        </div>
    </aside>
    );
}
