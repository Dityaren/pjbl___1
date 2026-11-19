import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  ListChecks,
  RotateCcw,
  Search,
  Trophy,
  XCircle,
} from "lucide-react";
import * as React from "react";

import { PageHeader } from "#/components/app-main.tsx";
import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Card, CardContent } from "#/components/ui/card.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs.tsx";
import { cn } from "#/lib/utils.ts";

export const Route = createFileRoute("/_auth/app/quiz/")({
  component: QuizPage,
});

const PASSING_SCORE = 70;

type Question = {
  id: string;
  text: string;
  options: string[];
  answer: number; // index of the correct option
};

type Quiz = {
  id: string;
  title: string;
  topic: string;
  description: string;
  duration: number; // menit
  questions: Question[];
  bestScore?: number;
  attempts: number;
};

// TODO: ganti dengan data asli (loader / query)
const initialQuizzes: Quiz[] = [
  {
    id: "1",
    title: "Dasar Project-Based Learning",
    topic: "Dasar PjBL",
    description: "Uji pemahamanmu tentang konsep dan tahapan PjBL.",
    duration: 10,
    attempts: 1,
    bestScore: 80,
    questions: [
      {
        id: "q1",
        text: "Apa ciri utama pembelajaran berbasis project?",
        options: [
          "Siswa menghafal materi sebanyak mungkin",
          "Siswa menghasilkan produk nyata dari masalah yang dikaji",
          "Guru menjelaskan seluruh materi di depan kelas",
          "Penilaian hanya dari ujian tertulis",
        ],
        answer: 1,
      },
      {
        id: "q2",
        text: "Tahap pertama dalam PjBL adalah...",
        options: [
          "Menyusun jadwal",
          "Mengevaluasi pengalaman",
          "Penentuan pertanyaan mendasar",
          "Menguji hasil",
        ],
        answer: 2,
      },
      {
        id: "q3",
        text: "Apa tujuan refleksi di akhir project?",
        options: [
          "Menentukan peringkat siswa",
          "Menilai proses dan hasil belajar untuk perbaikan",
          "Mengulang seluruh project",
          "Mengganti topik project",
        ],
        answer: 1,
      },
    ],
  },
  {
    id: "2",
    title: "Desain Media Pembelajaran",
    topic: "Media Pembelajaran",
    description: "Prinsip tata letak, warna, dan tipografi untuk media.",
    duration: 8,
    attempts: 0,
    questions: [
      {
        id: "q1",
        text: "Mana yang membantu keterbacaan teks pada slide?",
        options: [
          "Kontras warna yang cukup antara teks dan latar",
          "Teks sekecil mungkin agar muat banyak",
          "Memakai banyak jenis huruf sekaligus",
          "Latar bergambar ramai di belakang teks",
        ],
        answer: 0,
      },
      {
        id: "q2",
        text: "Storyboard digunakan untuk...",
        options: [
          "Menyimpan nilai siswa",
          "Merencanakan alur dan tampilan media sebelum dibuat",
          "Mengompres video",
          "Membagi kelompok",
        ],
        answer: 1,
      },
    ],
  },
  {
    id: "3",
    title: "Evaluasi dan Refleksi",
    topic: "Evaluasi",
    description: "Cek pemahamanmu tentang menilai hasil project.",
    duration: 5,
    attempts: 2,
    bestScore: 50,
    questions: [
      {
        id: "q1",
        text: "Rubrik penilaian berfungsi untuk...",
        options: [
          "Menyembunyikan kriteria dari siswa",
          "Memberi kriteria penilaian yang jelas dan terukur",
          "Mengurangi jumlah tugas",
          "Menentukan anggota kelompok",
        ],
        answer: 1,
      },
      {
        id: "q2",
        text: "Refleksi yang baik berisi...",
        options: [
          "Hanya pujian untuk kelompok",
          "Salinan laporan project",
          "Apa yang dipelajari, kendala, dan rencana perbaikan",
          "Daftar anggota kelompok",
        ],
        answer: 2,
      },
    ],
  },
];

type Filter = "semua" | "belum" | "selesai";

function QuizPage() {
  const [quizzes, setQuizzes] = React.useState(initialQuizzes);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<Filter>("semua");
  const [query, setQuery] = React.useState("");

  const active = quizzes.find((q) => q.id === activeId);

  const handleFinish = (id: string, score: number) => {
    // TODO: simpan hasil ke backend
    setQuizzes((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              attempts: q.attempts + 1,
              bestScore: Math.max(q.bestScore ?? 0, score),
            }
          : q,
      ),
    );
  };

  const counts = React.useMemo(
    () => ({
      semua: quizzes.length,
      belum: quizzes.filter((q) => q.attempts === 0).length,
      selesai: quizzes.filter((q) => q.attempts > 0).length,
    }),
    [quizzes],
  );

  const scored = quizzes.filter((q) => q.bestScore !== undefined);
  const average = scored.length
    ? Math.round(scored.reduce((sum, q) => sum + (q.bestScore ?? 0), 0) / scored.length)
    : 0;

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return quizzes
      .filter((z) => filter === "semua" || (filter === "belum" ? z.attempts === 0 : z.attempts > 0))
      .filter((z) => !q || z.title.toLowerCase().includes(q) || z.topic.toLowerCase().includes(q));
  }, [quizzes, filter, query]);

  if (active) {
    return (
      <QuizRunner
        key={active.id}
        quiz={active}
        onFinish={(score) => handleFinish(active.id, score)}
        onExit={() => setActiveId(null)}
      />
    );
  }

  return (
    <>
      <PageHeader title="Quiz" description="Uji pemahamanmu dan lihat hasilnya langsung." />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={ListChecks} label="Total quiz" value={counts.semua} />
        <StatCard icon={CheckCircle2} label="Sudah dikerjakan" value={counts.selesai} />
        <StatCard icon={Trophy} label="Rata-rata nilai" value={average} />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList>
            <TabsTrigger value="semua">Semua ({counts.semua})</TabsTrigger>
            <TabsTrigger value="belum">Belum ({counts.belum})</TabsTrigger>
            <TabsTrigger value="selesai">Selesai ({counts.selesai})</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari quiz..."
            className="pl-8"
          />
        </div>
      </div>

      {/* List */}
      {visible.length === 0 ? (
        <Card className="shadow-none">
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
            <ListChecks className="size-8 text-muted-foreground" />
            <p className="font-medium">Tidak ada quiz</p>
            <p className="text-sm text-muted-foreground">
              Coba ubah filter atau kata kunci pencarianmu.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {visible.map((quiz) => (
            <li key={quiz.id}>
              <QuizCard quiz={quiz} onStart={() => setActiveId(quiz.id)} />
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

function QuizCard({ quiz, onStart }: { quiz: Quiz; onStart: () => void }) {
  const passed = (quiz.bestScore ?? 0) >= PASSING_SCORE;

  return (
    <Card className="h-full shadow-none transition-colors hover:bg-muted/40">
      <CardContent className="flex h-full flex-col gap-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="leading-snug font-medium">{quiz.title}</h3>
            {quiz.bestScore !== undefined && (
              <Badge
                className={cn(
                  "shrink-0 border-transparent",
                  passed
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : "bg-amber-500/15 text-amber-600 dark:text-amber-400",
                )}
              >
                Terbaik: {quiz.bestScore}
              </Badge>
            )}
          </div>
          <p className="line-clamp-2 text-sm text-muted-foreground">{quiz.description}</p>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <Badge variant="outline" className="font-normal">
              {quiz.topic}
            </Badge>
            <span className="flex items-center gap-1">
              <ListChecks className="size-3.5" />
              {quiz.questions.length} soal
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {quiz.duration} menit
            </span>
          </div>

          <Button size="sm" variant={quiz.attempts === 0 ? "default" : "outline"} onClick={onStart}>
            {quiz.attempts === 0 ? "Mulai" : "Coba lagi"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function QuizRunner({
  quiz,
  onFinish,
  onExit,
}: {
  quiz: Quiz;
  onFinish: (score: number) => void;
  onExit: () => void;
}) {
  const [index, setIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<number, number>>({});
  const [submitted, setSubmitted] = React.useState(false);

  const total = quiz.questions.length;
  const question = quiz.questions[index];
  const answeredCount = Object.keys(answers).length;

  const correctCount = quiz.questions.filter((q, i) => answers[i] === q.answer).length;
  const score = Math.round((correctCount / total) * 100);

  const handleSubmit = () => {
    setSubmitted(true);
    onFinish(score);
  };

  const handleRetry = () => {
    setAnswers({});
    setIndex(0);
    setSubmitted(false);
  };

  if (submitted) {
    const passed = score >= PASSING_SCORE;

    return (
      <>
        <PageHeader title={quiz.title} description="Hasil quiz" />

        <Card className="shadow-none">
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <div
              className={cn(
                "flex size-14 items-center justify-center rounded-full",
                passed
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : "bg-amber-500/15 text-amber-600 dark:text-amber-400",
              )}
            >
              <Trophy className="size-7" />
            </div>
            <p className="text-4xl font-bold">{score}</p>
            <p className="text-muted-foreground">
              {correctCount} dari {total} jawaban benar
            </p>
            <p className="font-medium">
              {passed
                ? "Bagus! Kamu lulus quiz ini."
                : `Belum lulus. Nilai minimal ${PASSING_SCORE}, coba lagi ya.`}
            </p>
            <div className="mt-2 flex gap-2">
              <Button variant="outline" onClick={onExit}>
                <ArrowLeft />
                Daftar quiz
              </Button>
              <Button onClick={handleRetry}>
                <RotateCcw />
                Coba lagi
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Review */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            Pembahasan
          </h2>
          {quiz.questions.map((q, i) => {
            const correct = answers[i] === q.answer;
            return (
              <Card key={q.id} className="shadow-none">
                <CardContent className="space-y-2">
                  <div className="flex items-start gap-2">
                    {correct ? (
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                    )}
                    <p className="font-medium">
                      {i + 1}. {q.text}
                    </p>
                  </div>
                  <p className="pl-6 text-sm text-muted-foreground">
                    Jawabanmu:{" "}
                    <span className="text-foreground">
                      {answers[i] !== undefined ? q.options[answers[i]] : "Tidak dijawab"}
                    </span>
                  </p>
                  {!correct && (
                    <p className="pl-6 text-sm text-muted-foreground">
                      Jawaban benar:{" "}
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {q.options[q.answer]}
                      </span>
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </>
    );
  }

  const isLast = index === total - 1;

  return (
    <>
      <PageHeader
        title={quiz.title}
        description={`Soal ${index + 1} dari ${total} · ${answeredCount} terjawab`}
        actions={
          <Button variant="ghost" size="sm" onClick={onExit}>
            <ArrowLeft />
            Keluar
          </Button>
        }
      />

      {/* Progress */}
      <div
        role="progressbar"
        aria-valuenow={index + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        className="h-2 overflow-hidden rounded-full bg-secondary"
      >
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      <Card className="shadow-none">
        <CardContent className="space-y-5">
          <h2 className="text-lg leading-snug font-medium">{question.text}</h2>

          <div role="radiogroup" className="flex flex-col gap-2">
            {question.options.map((option, i) => {
              const selected = answers[index] === i;
              return (
                <button
                  key={i}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setAnswers((prev) => ({ ...prev, [index]: i }))}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors hover:bg-muted/50",
                    selected && "border-primary bg-primary/5",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                      selected && "border-primary bg-primary text-primary-foreground",
                    )}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  {option}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="outline" disabled={index === 0} onClick={() => setIndex((i) => i - 1)}>
          <ArrowLeft />
          Sebelumnya
        </Button>

        {isLast ? (
          <Button disabled={answeredCount < total} onClick={handleSubmit}>
            Selesai
            <CheckCircle2 />
          </Button>
        ) : (
          <Button onClick={() => setIndex((i) => i + 1)}>
            Berikutnya
            <ArrowRight />
          </Button>
        )}
      </div>
    </>
  );
}
