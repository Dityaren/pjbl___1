import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, ClipboardList, FolderKanban, ListChecks } from "lucide-react";

import { PageHeader } from "#/components/app-main.tsx";
import { Card, CardDescription, CardHeader, CardTitle } from "#/components/ui/card.tsx";
import { useAuth } from "#/lib/auth/hooks";
export const Route = createFileRoute("/_auth/app/")({
  component: BerandaPage,
});

const shortcuts = [
  {
    to: "/app/tugas",
    icon: ClipboardList,
    title: "Tugas",
    description: "Lihat tugas dan tenggat pengumpulan.",
  },
  {
    to: "/app/project",
    icon: FolderKanban,
    title: "Project",
    description: "Lanjutkan project belajarmu.",
  },
  {
    to: "/app/materi",
    icon: BookOpen,
    title: "Materi",
    description: "Pelajari materi yang tersedia.",
  },
  {
    to: "/app/quiz",
    icon: ListChecks,
    title: "Quiz",
    description: "Uji pemahamanmu dengan quiz.",
  },
] as const;

function BerandaPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0];

  return (
    <>
      <PageHeader
        title={firstName ? `Halo, ${firstName}!` : "Beranda"}
        description="Semangat Belajar! Lanjutkan dari mana saja."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {shortcuts.map(({ to, icon: Icon, title, description }) => (
          <Link key={to} to={to} className="group">
            <Card className="h-full shadow-none transition-colors group-hover:bg-muted/50">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="flex items-center justify-between">
                  {title}
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
