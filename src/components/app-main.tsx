import * as React from "react";

import { cn } from "#/lib/utils.ts";

/** Shared container width so main and footer line up */
export const containerClass = "mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8";

export function AppMain({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className="flex min-w-0 flex-1 flex-col">
      <div className={cn(containerClass, "flex flex-1 flex-col gap-6 py-6 md:py-8", className)}>
        {children}
      </div>
    </main>
  );
}

/** Use at the top of each page */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
