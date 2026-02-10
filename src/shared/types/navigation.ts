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
      { label: "eCove Community", to: "/resources/ecove-community" },
      { label: "Training", to: "/resources/training" },
    ],
  },
  {
    label: "LIBRARY",
    children: [
      { label: "E-Biz ToolKits", to: "/library/toolkit-library" },
      { label: "Reports", to: "/library/reports" },
    ],
  },
  {
    label: "STATISTICS",
    to: "/statistics",
  },
  {
    label: "NEWS",
    to: "/news",
  },
  {
    label: "ABOUT",
    to: "/about",
  },
  {
    label: "TEAM",
    to: "/team",
  },
];
