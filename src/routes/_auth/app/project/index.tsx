import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarClock,
  CheckCircle2,
  FolderKanban,
  ListChecks,
  Loader,
  Search,
  Users,
} from "lucide-react";
import * as React from "react";

import { PageHeader } from "#/components/app-main.tsx";
import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Card, CardContent } from "#/components/ui/card.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs.tsx";
import { cn } from "#/lib/utils.ts";

export const Route = createFileRoute("/_auth/app/project/")({
  component: ProjectPage,
});

type ProjectStatus = "berjalan" | "selesai" | "belum";

type Project = {
  id: string;
  title: string;
  description: string;
  stage: string; // tahap PjBL saat ini
  deadline: string; // ISO string
  status: ProjectStatus;
  members: number;
  tasksDone: number;
  tasksTotal: number;
};

// TODO: ganti dengan data asli (loader / query)
const projects: Project[] = [
  {
    id: "1",
    title: "Media Pembelajaran Interaktif",
    description:
      "Merancang dan membuat media pembelajaran interaktif untuk materi pilihan kelompok.",
    stage: "Perancangan",
    deadline: "2026-12-10T23:59:00",
    status: "berjalan",
    members: 4,
    tasksDone: 3,
    tasksTotal: 8,
  },
  {
    id: "2",
    title: "Aplikasi Kelas Digital",
    description: "Membangun prototipe aplikasi sederhana untuk membantu kegiatan belajar di kelas.",
    stage: "Monitoring",
    deadline: "2026-12-20T23:59:00",
    status: "berjalan",
    members: 3,
    tasksDone: 6,
    tasksTotal: 10,
  },
  {
    id: "3",
    title: "Poster Edukasi Lingkungan",
    description: "Membuat poster digital tentang pengelolaan sampah di lingkungan sekolah.",
    stage: "Evaluasi",
    deadline: "2026-11-05T23:59:00",
    status: "selesai",
    members: 5,
    tasksDone: 6,
    tasksTotal: 6,
  },
  {
    id: "4",
    title: "Video Tutorial Praktikum",
    description: "Memproduksi video tutorial langkah-langkah praktikum beserta narasinya.",
    stage: "Penentuan pertanyaan",
    deadline: "2027-01-15T23:59:00",
    status: "belum",
    members: 4,
    tasksDone: 0,
    tasksTotal: 7,
  },
];

const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  berjalan: {
    label: "Berjalan",
    className: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  },
  selesai: {
    label: "Selesai",
    className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  },
  belum: {
    label: "Belum dimulai",
    className: "bg-secondary text-secondary-foreground",
  },
};

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

type Filter = "semua" | ProjectStatus;

function ProjectPage() {
  const [filter, setFilter] = React.useState<Filter>("semua");
  const [query, setQuery] = React.useState("");

  const counts = React.useMemo(
    () => ({
      semua: projects.length,
      berjalan: projects.filter((p) => p.status === "berjalan").length,
      selesai: projects.filter((p) => p.status === "selesai").length,
      belum: projects.filter((p) => p.status === "belum").length,
    }),
    [],
  );

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects
      .filter((p) => filter === "semua" || p.status === filter)
      .filter(
        (p) => !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
      );
  }, [filter, query]);

  return (
    <>
      <PageHeader title="Project" description="Kelola project belajarmu dan pantau progresnya." />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Loader} label="Berjalan" value={counts.berjalan} />
        <StatCard icon={CheckCircle2} label="Selesai" value={counts.selesai} />
        <StatCard icon={FolderKanban} label="Total project" value={counts.semua} />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList>
            <TabsTrigger value="semua">Semua ({counts.semua})</TabsTrigger>
            <TabsTrigger value="berjalan">Berjalan ({counts.berjalan})</TabsTrigger>
            <TabsTrigger value="selesai">Selesai ({counts.selesai})</TabsTrigger>
            <TabsTrigger value="belum">Belum ({counts.belum})</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari project..."
            className="pl-8"
          />
        </div>
      </div>

      {/* Grid */}
      {visible.length === 0 ? (
        <Card className="shadow-none">
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
            <FolderKanban className="size-8 text-muted-foreground" />
            <p className="font-medium">Tidak ada project</p>
            <p className="text-sm text-muted-foreground">
              Coba ubah filter atau kata kunci pencarianmu.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {visible.map((project) => (
            <li key={project.id}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <Card className="shadow-none">
      <CardContent className="flex items-center gap-4">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-2xl leading-none font-semibold">{value}</p>
          <p className="mt-1 text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const status = statusConfig[project.status];
  const progress =
    project.tasksTotal === 0 ? 0 : Math.round((project.tasksDone / project.tasksTotal) * 100);

  return (
    <Card className="h-full shadow-none transition-colors hover:bg-muted/40">
      <CardContent className="flex h-full flex-col gap-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="leading-snug font-medium">{project.title}</h3>
            <Badge className={cn("shrink-0 border-transparent", status.className)}>
              {status.label}
            </Badge>
          </div>
          <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
        </div>

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Tahap: {project.stage}</span>
            <span className="font-medium text-foreground">{progress}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-2 overflow-hidden rounded-full bg-secondary"
          >
            <div
              className={cn(
                "h-full rounded-full transition-all",
                project.status === "selesai" ? "bg-emerald-500" : "bg-primary",
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ListChecks className="size-3.5" />
              {project.tasksDone}/{project.tasksTotal} tugas
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="size-3.5" />
              {project.members} anggota
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarClock className="size-3.5" />
              {dateFormatter.format(new Date(project.deadline))}
            </span>
          </div>

          <Button size="sm" variant={project.status === "berjalan" ? "default" : "outline"}>
            {project.status === "berjalan"
              ? "Lanjutkan"
              : project.status === "belum"
                ? "Mulai"
                : "Lihat"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
