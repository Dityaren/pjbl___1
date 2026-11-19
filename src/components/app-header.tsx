"use client";

import { Link, useRouterState, type LinkProps } from "@tanstack/react-router";
import * as React from "react";

import { ThemeToggle } from "#/components/theme-toggle.tsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "#/components/ui/breadcrumb.tsx";
import { Separator } from "#/components/ui/separator.tsx";
import { SidebarTrigger } from "#/components/ui/sidebar.tsx";

// Map URL segments to display labels. Unknown segments fall back to a prettified version.
const segmentLabels: Record<string, string> = {
  tugas: "Tugas",
  project: "Project",
  materi: "Materi",
  quiz: "Quiz",
};

function prettify(segment: string) {
  const text = decodeURIComponent(segment).replace(/[-_]+/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function useCrumbs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return React.useMemo(() => {
    // "/app/project/123" -> ["project", "123"]
    const segments = pathname.split("/").filter(Boolean).slice(1);

    const crumbs = [{ label: "Beranda", href: "/app" }];
    segments.forEach((segment, i) => {
      crumbs.push({
        label: segmentLabels[segment] ?? prettify(segment),
        href: "/app/" + segments.slice(0, i + 1).join("/"),
      });
    });
    return crumbs;
  }, [pathname]);
}

export function AppHeader() {
  const crumbs = useCrumbs();

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 data-[orientation=vertical]:h-4" />

      <Breadcrumb className="min-w-0">
        <BreadcrumbList className="flex-nowrap">
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1;

            return (
              <React.Fragment key={crumb.href}>
                {/* On mobile, only show the current page */}
                <BreadcrumbItem className={isLast ? undefined : "hidden md:inline-flex"}>
                  {isLast ? (
                    <BreadcrumbPage className="truncate">{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink render={<Link to={crumb.href as LinkProps["to"]} />}>
                      {crumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
