import { BookOpenIcon, ClipboardListIcon, LayoutDashboard, UsersIcon } from "lucide-react";

export const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: BookOpenIcon, label: "Truyện", href: "/manga" },
  { icon: ClipboardListIcon, label: "Công việc", href: "/task" },
  { icon: UsersIcon, label: "Thành viên", href: "/member" },
] as const;