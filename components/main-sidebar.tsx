"use client";

import { sidebarItems } from "@/types/sidebar-item";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./logo";

const MainSidebar = () => {
  const router = useRouter();
  const pathName = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathName === "/";
    return pathName.startsWith(href);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="group">
        <SidebarHeader className="px-4 py-3">
          <Logo />
        </SidebarHeader>
        <SidebarMenu className="px-4 group-data-[collapsible=icon]:px-2">
          {sidebarItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                onClick={() => router.push(item.href)}
                className={
                  isActive(item.href) ? "bg-primary/80 hover:bg-primary/90" : ""
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default MainSidebar;
