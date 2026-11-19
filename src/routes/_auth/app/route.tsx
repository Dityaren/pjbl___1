import { createFileRoute, Outlet } from "@tanstack/react-router";

import { AppFooter } from "#/components/app-footer.tsx"; // adjust paths
import { AppHeader } from "#/components/app-header.tsx";
import { AppMain } from "#/components/app-main.tsx";
import { AppSidebar } from "#/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "#/components/ui/sidebar";

import { navData } from "./-nav-data";

export const Route = createFileRoute("/_auth/app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar items={navData} />

      <SidebarInset className="min-h-svh">
        <AppHeader />

        <AppMain>
          <Outlet />
        </AppMain>

        <AppFooter />
      </SidebarInset>
    </SidebarProvider>
  );
}
