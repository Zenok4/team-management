import MainHeader from "@/components/main-header";
import MainSidebar from "@/components/main-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Team Manager",
  description: "Manage your team effectively",
};

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <MainSidebar />
      <div className="flex flex-col p-4 gap-2 w-full">
        <MainHeader />
        <Separator orientation="horizontal" className="w-full mb-2" />
        {children}
      </div>
    </SidebarProvider>
  );
}
