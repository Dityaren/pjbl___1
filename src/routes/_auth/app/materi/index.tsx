import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, CheckCircle2, Circle, Clock, FileText, PlayCircle, Search } from "lucide-react";
import * as React from "react";

import { PageHeader } from "#/components/app-main.tsx";
import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Card, CardContent } from "#/components/ui/card.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs.tsx";
import { cn } from "#/lib/utils.ts";

export const Route = createFileRoute("/_auth/app/materi/")({
  component: MateriPage,
});

type MaterialType = "artikel" | "video" | "pdf";

type Material = {
  id: string;
  title: string;
  description: string;
  type: MaterialType;
  topic: string;
  duration: number; // menit
  completed: boolean;
};

// TODO: ganti dengan data asli (loader / query)
const materials: Material[] = [
  {
    id: "1",
    title: "Pengantar Project-Based Learning",
    description: "Memahami konsep, tujuan, dan tahapan pembelajaran berbasis project.",
    type: "artikel",
    topic: "Dasar PjBL",
    duration: 10,
    completed: true,
  },
  {
    id: "2",
    title: "Menentukan Pertanyaan Mendasar",
    description: "Cara merumuskan pertanyaan yang memandu seluruh proses project.",
    type: "video",
    topic: "Dasar PjBL",
    duration: 15,
    completed: true,
  },
  {
    id: "3",
    title: "Prinsip Desain Media Pembelajaran",
    description: "Panduan tata letak, warna, dan tipografi untuk media yang efektif.",
    type: "pdf",
    topic: "Media Pembelajaran",
    duration: 20,
    completed: false,
  },
  {
    id: "4",
    title: "Membuat Storyboard",
    description: "Langkah menyusun storyboard sebelum membuat media pembelajaran.",
    type: "video",
    topic: "Media Pembelajaran",
    duration: 12,
    completed: false,
  },
  {
    id: "5",
    title: "Teknik Evaluasi dan Refleksi",
    description: "Menilai hasil project dan menulis refleksi dari proses belajarmu.",
    type: "artikel",
    topic: "Evaluasi",
    duration: 8,
    completed: false,
  },
];

const typeConfig: Record<
  MaterialType,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  artikel: { label: "Artikel", icon: BookOpen },
  video: { label: "Video", icon: PlayCircle },
  pdf: { label: "PDF", icon: FileText },
};

type Filter = "semua" | MaterialType;

function MateriPage() {
  const [items, setItems] = React.useState(materials);
  const [filter, setFilter] = React.useState<Filter>("semua");
  const [query, setQuery] = React.useState("");

  const toggleCompleted = (id: string) =>
    setItems((prev) => prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m)));

  const done = items.filter((m) => m.completed).length;
  const progress = items.length ? Math.round((done / items.length) * 100) : 0;

  const counts = React.useMemo(
    () => ({
      semua: items.length,
      artikel: items.filter((m) => m.type === "artikel").length,
      video: items.filter((m) => m.type === "video").length,
      pdf: items.filter((m) => m.type === "pdf").length,
    }),
    [items],
  );

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((m) => filter === "semua" || m.type === filter)
      .filter((m) => !q || m.title.toLowerCase().includes(q) || m.topic.toLowerCase().includes(q));
  }, [items, filter, query]);

  // Kelompokkan per topik
  const grouped = React.useMemo(() => {
    const map = new Map<string, Material[]>();
    for (const m of visible) {
      map.set(m.topic, [...(map.get(m.topic) ?? []), m]);
    }
    return Array.from(map.entries());
  }, [visible]);

  return (
    <>
      <PageHeader title="Materi" description="Pelajari materi dan tandai yang sudah selesai." />

      {/* Progress */}
      <Card className="shadow-none">
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Progres belajarmu</p>
              <p className="text-sm text-muted-foreground">
                {done} dari {items.length} materi selesai
              </p>
            </div>
            <p className="text-2xl font-semibold">{progress}%</p>
          </div>
          <div
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-2 overflow-hidden rounded-full bg-secondary"
          >
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList>
            <TabsTrigger value="semua">Semua ({counts.semua})</TabsTrigger>
            <TabsTrigger value="artikel">Artikel ({counts.artikel})</TabsTrigger>
            <TabsTrigger value="video">Video ({counts.video})</TabsTrigger>
            <TabsTrigger value="pdf">PDF ({counts.pdf})</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari materi..."
            className="pl-8"
          />
        </div>
      </div>

      {/* List per topik */}
      {grouped.length === 0 ? (
        <Card className="shadow-none">
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
            <BookOpen className="size-8 text-muted-foreground" />
            <p className="font-medium">Tidak ada materi</p>
            <p className="text-sm text-muted-foreground">
              Coba ubah filter atau kata kunci pencarianmu.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-8">
          {grouped.map(([topic, list]) => (
            <section key={topic} className="space-y-3">
              <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                {topic}
              </h2>
              <ul className="grid gap-4 md:grid-cols-2">
                {list.map((material) => (
                  <li key={material.id}>
                    <MaterialCard
                      material={material}
                      onToggle={() => toggleCompleted(material.id)}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
  );
}

function MaterialCard({ material, onToggle }: { material: Material; onToggle: () => void }) {
  const { label, icon: Icon } = typeConfig[material.type];

  return (
    <Card className="h-full shadow-none transition-colors hover:bg-muted/40">
      <CardContent className="flex h-full flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-5" />
          </div>
          <div className="min-w-0 space-y-1">
            <h3 className="leading-snug font-medium">{material.title}</h3>
            <p className="line-clamp-2 text-sm text-muted-foreground">{material.description}</p>
          </div>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="font-normal">
              {label}
            </Badge>
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {material.duration} menit
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={onToggle}
              className={cn(material.completed && "text-emerald-600 dark:text-emerald-400")}
            >
              {material.completed ? <CheckCircle2 /> : <Circle />}
              {material.completed ? "Selesai" : "Tandai selesai"}
            </Button>
            <Button size="sm" variant={material.completed ? "outline" : "default"}>
              {material.completed ? "Buka lagi" : "Pelajari"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
