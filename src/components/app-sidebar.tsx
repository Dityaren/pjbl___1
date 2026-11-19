"use client";

import { PieChart, CircleUserRound, ClipboardList, Table } from "lucide-react";

import Logo from "#/assets/logo/logo";
import { SignOutButton } from "#/components/sign-out-button.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar.tsx";
import { Card, CardContent } from "#/components/ui/card.tsx";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "#/components/ui/sidebar.tsx";
import { useAuthSuspense } from "#/lib/auth/hooks";

import { NavItem, NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

export function AppSidebar({ items }: { items: NavItem[] }) {
  const { user } = useAuthSuspense();

  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader className="px-4 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <a href="#" className="h-full w-full">
              <Logo />
            </a>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content (scrolls) */}
      <SidebarContent className="px-4">
        <NavMain items={items} />

        <Card className="mt-5 bg-secondary px-4 py-6 shadow-none ring-0">
          <CardContent className="flex flex-col items-center gap-3 p-0">
            <img
              src="https://images.shadcnspace.com/assets/backgrounds/download-img.png"
              alt="sidebar-img"
              width={74}
              height={74}
              className="h-20 w-20"
            />
            <p className="text-center text-base font-semibold text-card-foreground">
              Semangat Belajar!
            </p>
          </CardContent>
        </Card>
      </SidebarContent>

      {/* Footer: user */}
      <SidebarFooter className="border-t px-4 py-3">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
