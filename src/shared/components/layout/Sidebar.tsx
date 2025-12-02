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
    ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
    isOpen: boolean;
}

type MenuItem = {
    title: string;
    icon: any;
    path?: string;
    children?: { title: string; path: string; icon?: any }[];
};

const menuItems: MenuItem[] = [
    {
    title: "Dashboard",
    icon: LayoutDashboard,
    children: [
        { title: "Admin Dashboard", path: "/", icon: LinkIcon },
        { title: "Project Dashboard", path: "/dashboard", icon: LinkIcon },
        { title: "Country Dashboard", path: "/dashboard", icon: LinkIcon },
    ],
    },
    {
    title: "Configuration",
    icon: Settings,
    children: [
        { title: "Countries", path: "/config/countries", icon: Globe },
        { title: "Agencies", path: "/config/agencies", icon: Building2 },
        { title: "SDGs", path: "/config/sdgs", icon: Flag },
    ],
    },
    {
    title: "Programs & Projects",
    icon: Briefcase,
    children: [
        { title: "Programs", path: "/programs", icon: FolderKanban },
        { title: "Projects", path: "/projects", icon: FolderKanban },
    ],
},
    {
    title: "Resources",
    icon: Users,
    children: [
        { title: "Donors", path: "/resources/donors", icon: Wallet },
        { title: "Beneficiaries", path: "/resources/beneficiaries", icon: Users },
    //   { title: "Contacts", path: "/resources/contacts", icon: Contact },
    ],
    },
    {
    title: "Reports",
    icon: FileBarChart,
    children: [
        { title: "Performance", path: "/reports/performance", icon: FileText },
        { title: "Budget Analysis", path: "/reports/budget", icon: FileText },
        { title: "Impact Report", path: "/reports/impact", icon: FileText },
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

    return (
    <aside
        className={cn(
        "fixed left-0 top-16 bottom-0 z-40 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out overflow-y-auto",
        isOpen ? "w-64" : "w-0 lg:w-20"
        )}
    >
        <div className="py-4 flex flex-col gap-1">
        {menuItems.map((item) => {
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
                    {item.children.map((child) => {
                        const isChildActive = location.pathname === child.path;
                        return (
                        <Link
                            key={child.path}
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
