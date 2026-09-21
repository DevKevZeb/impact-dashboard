// navigation.ts
export interface NavItem {
  label: string;
  to?: string;
  children?: {
    label: string;
    to: string;
  }[];
}

export const publicNavigation: NavItem[] = [
  {
    label: "HOME",
    to: "/",
  },
  {
    label: "DEVELOPMENT",
    children: [
      { label: "Programs", to: "/development/programs" },
      { label: "Projects", to: "/development/projects" },
      { label: "Progress", to: "/development/progress" },
    ],
  },
  {
    label: "RESOURCES",
    children: [
      { label: "E-Biz Toolkits", to: "/resources/toolkits" },
      { label: "Reports", to: "/resources/reports" },
    ],
  },
  {
    label: "STATISTICS",
    to: "/statistics",
  },
  {
    label: "ABOUT",
    to: "/about",
  },
];
