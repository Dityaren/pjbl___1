import { containerClass } from "#/components/app-main.tsx"; // adjust path
import { cn } from "#/lib/utils.ts";

export function AppFooter() {
  return (
    <footer className="mt-auto border-t">
      <div
        className={cn(
          containerClass,
          "flex flex-col items-center justify-between gap-2 py-4 text-xs text-muted-foreground sm:flex-row",
        )}
      >
        <p>© {new Date().getFullYear()} ProjectLearn. All rights reserved.</p>

        <div className="flex items-center gap-2">
          <span>PjBL Media</span>
          {import.meta.env.DEV && (
            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 font-medium text-amber-600 dark:text-amber-400">
              dev
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}
