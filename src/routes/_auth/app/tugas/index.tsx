import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, CheckCircle2, ClipboardList, FolderKanban, Search } from "lucide-react";
import * as React from "react";

import { PageHeader } from "#/components/app-main.tsx";
import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Card, CardContent } from "#/components/ui/card.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs.tsx";
import { cn } from "#/lib/utils.ts";

export const Route = createFileRoute("/_auth/app/tugas/")({
  component: TugasPage,
});

type TaskStatus = "belum" | "dikumpulkan" | "dinilai";

type Task = {
  id: string;
  title: string;
  project: string;
  description: string;
  dueDate: string; // ISO string
  status: TaskStatus;
  score?: number;
};

// TODO: replace with your real data (loader / query)
const tasks: Task[] = [
  {
    id: "1",
    title: "Rancangan storyboard media",
    project: "Project Media Pembelajaran",
    description: "Buat storyboard untuk 5 slide pertama media pembelajaran.",
    dueDate: "2026-11-25T23:59:00",
    status: "belum",
  },
  {
    id: "2",
    title: "Laporan analisis kebutuhan",
    project: "Project Media Pembelajaran",
    description: "Kumpulkan hasil wawancara dan rangkum kebutuhan pengguna.",
    dueDate: "2026-11-17T23:59:00",
    status: "belum",
  },
  {
    id: "3",
    title: "Prototipe antarmuka",
    project: "Project Aplikasi Kelas",
    description: "Unggah prototipe tampilan halaman utama dalam format PDF.",
    dueDate: "2026-11-22T23:59:00",
    status: "dikumpulkan",
  },
  {
    id: "4",
    title: "Refleksi minggu pertama",
    project: "Project Aplikasi Kelas",
    description: "Tulis refleksi singkat tentang proses belajar minggu ini.",
    dueDate: "2026-11-10T23:59:00",
    status: "dinilai",
    score: 88,
  },
];

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  belum: {
    label: "Belum dikerjakan",
    className: "bg-secondary text-secondary-foreground",
  },
  dikumpulkan: {
    label: "Dikumpulkan",
    className: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  },
  dinilai: {
    label: "Dinilai",
    className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  },
};

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function getDueInfo(task: Task) {
  const due = new Date(task.dueDate).getTime();
  const diff = due - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  // Only unsubmitted tasks can be overdue or urgent
  if (task.status !== "belum") return { text: null, overdue: false };
  if (diff < 0) return { text: "Terlambat", overdue: true };
  if (days <= 1) return { text: "Hari ini / besok", overdue: false };
  return { text: `${days} hari lagi`, overdue: false };
}

type Filter = "semua" | TaskStatus;

function TugasPage() {
  const [filter, setFilter] = React.useState<Filter>("semua");
  const [query, setQuery] = React.useState("");

  const counts = React.useMemo(
    () => ({
      semua: tasks.length,
      belum: tasks.filter((t) => t.status === "belum").length,
      dikumpulkan: tasks.filter((t) => t.status === "dikumpulkan").length,
      dinilai: tasks.filter((t) => t.status === "dinilai").length,
    }),
    [],
  );

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks
      .filter((t) => filter === "semua" || t.status === filter)
      .filter((t) => !q || t.title.toLowerCase().includes(q) || t.project.toLowerCase().includes(q))
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [filter, query]);

  return (
    <>
      <PageHeader title="Tugas" description="Pantau tugas, tenggat, dan nilaimu di sini." />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={ClipboardList} label="Belum dikerjakan" value={counts.belum} />
        <StatCard icon={CalendarClock} label="Dikumpulkan" value={counts.dikumpulkan} />
        <StatCard icon={CheckCircle2} label="Dinilai" value={counts.dinilai} />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList>
            <TabsTrigger value="semua">Semua ({counts.semua})</TabsTrigger>
            <TabsTrigger value="belum">Belum ({counts.belum})</TabsTrigger>
            <TabsTrigger value="dikumpulkan">Dikumpulkan ({counts.dikumpulkan})</TabsTrigger>
            <TabsTrigger value="dinilai">Dinilai ({counts.dinilai})</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari tugas..."
            className="pl-8"
          />
        </div>
      </div>

      {/* List */}
      {visible.length === 0 ? (
        <Card className="shadow-none">
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
            <ClipboardList className="size-8 text-muted-foreground" />
            <p className="font-medium">Tidak ada tugas</p>
            <p className="text-sm text-muted-foreground">
              Coba ubah filter atau kata kunci pencarianmu.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ul className="flex flex-col gap-3">
          {visible.map((task) => (
            <li key={task.id}>
              <TaskCard task={task} />
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

function TaskCard({ task }: { task: Task }) {
  const status = statusConfig[task.status];
  const due = getDueInfo(task);

  return (
    <Card className="shadow-none transition-colors hover:bg-muted/40">
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-medium">{task.title}</h3>
            <Badge className={cn("border-transparent", status.className)}>{status.label}</Badge>
            {due.text && (
              <Badge variant={due.overdue ? "destructive" : "outline"} className="font-normal">
                {due.text}
              </Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground">{task.description}</p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <FolderKanban className="size-3.5" />
              {task.project}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarClock className="size-3.5" />
              {dateFormatter.format(new Date(task.dueDate))}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
          {task.status === "dinilai" && (
            <div className="text-right">
              <p className="text-2xl leading-none font-semibold">{task.score}</p>
              <p className="text-xs text-muted-foreground">Nilai</p>
            </div>
          )}
          {task.status === "belum" && <Button size="sm">Kerjakan</Button>}
          {task.status === "dikumpulkan" && (
            <Button size="sm" variant="outline">
              Lihat
            </Button>
          )}
          {task.status === "dinilai" && (
            <Button size="sm" variant="outline">
              Detail
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
