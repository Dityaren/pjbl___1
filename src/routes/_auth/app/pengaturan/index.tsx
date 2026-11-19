import { createFileRoute } from "@tanstack/react-router";
import { Bell, MonitorSmartphone, Palette } from "lucide-react";
import * as React from "react";

import { PageHeader } from "#/components/app-main.tsx";
import { ThemeToggle } from "#/components/theme-toggle.tsx";
import { Button } from "#/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card.tsx";
import { Label } from "#/components/ui/label.tsx";
import { Switch } from "#/components/ui/switch.tsx";
import { authClient } from "#/lib/auth/auth-client";
import { cn } from "#/lib/utils.ts";

export const Route = createFileRoute("/_auth/app/pengaturan/")({
  component: PengaturanPage,
});

type Preferences = {
  tugasBaru: boolean;
  tenggat: boolean;
  nilai: boolean;
  materiBaru: boolean;
};

const defaultPreferences: Preferences = {
  tugasBaru: true,
  tenggat: true,
  nilai: true,
  materiBaru: false,
};

const STORAGE_KEY = "projectlearn:preferences";

const notificationOptions: {
  key: keyof Preferences;
  label: string;
  description: string;
}[] = [
  {
    key: "tugasBaru",
    label: "Tugas baru",
    description: "Beri tahu saya saat ada tugas baru.",
  },
  {
    key: "tenggat",
    label: "Pengingat tenggat",
    description: "Ingatkan saya sebelum tenggat pengumpulan.",
  },
  {
    key: "nilai",
    label: "Nilai dan umpan balik",
    description: "Beri tahu saya saat tugas atau quiz sudah dinilai.",
  },
  {
    key: "materiBaru",
    label: "Materi baru",
    description: "Beri tahu saya saat ada materi yang ditambahkan.",
  },
];

function usePreferences() {
  const [prefs, setPrefs] = React.useState<Preferences>(defaultPreferences);

  // Muat setelah mount supaya tidak terjadi hydration mismatch
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPrefs({ ...defaultPreferences, ...JSON.parse(raw) });
    } catch {
      // abaikan, pakai default
    }
  }, []);

  const update = (key: keyof Preferences, value: boolean) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: value };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // abaikan kalau storage tidak tersedia
      }
      return next;
    });
  };

  return [prefs, update] as const;
}

function PengaturanPage() {
  return (
    <>
      <PageHeader
        title="Pengaturan"
        description="Atur tampilan, notifikasi, dan keamanan akunmu."
      />

      <div className="max-w-3xl space-y-6">
        <AppearanceCard />
        <NotificationCard />
        <SessionCard />
      </div>
    </>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <CardHeader>
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" />
        </div>
        <div className="space-y-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </div>
    </CardHeader>
  );
}

function AppearanceCard() {
  return (
    <Card className="shadow-none">
      <SectionTitle icon={Palette} title="Tampilan" description="Pilih tema terang atau gelap." />
      <CardContent className="mt-4">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">Tema</p>
            <p className="text-sm text-muted-foreground">
              Tema juga bisa diganti dari tombol di header.
            </p>
          </div>
          <ThemeToggle />
        </div>
      </CardContent>
    </Card>
  );
}

function NotificationCard() {
  const [prefs, update] = usePreferences();

  return (
    <Card className="shadow-none">
      <SectionTitle
        icon={Bell}
        title="Notifikasi"
        description="Pilih kabar apa saja yang ingin kamu terima."
      />
      <CardContent className="mt-4 divide-y">
        {notificationOptions.map(({ key, label, description }) => (
          <div
            key={key}
            className={cn("flex items-center justify-between gap-4 py-4", "first:pt-0 last:pb-0")}
          >
            <div className="space-y-0.5">
              <Label htmlFor={`pref-${key}`}>{label}</Label>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <Switch
              id={`pref-${key}`}
              checked={prefs[key]}
              onCheckedChange={(value) => update(key, value)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function SessionCard() {
  const [pending, setPending] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleRevoke = async () => {
    setPending(true);
    setFeedback(null);

    const { error } = await authClient.revokeOtherSessions();

    setFeedback(
      error
        ? {
            type: "error",
            text: error.message ?? "Gagal keluar dari perangkat lain.",
          }
        : { type: "success", text: "Perangkat lain berhasil dikeluarkan." },
    );
    setPending(false);
  };

  return (
    <Card className="shadow-none">
      <SectionTitle
        icon={MonitorSmartphone}
        title="Sesi login"
        description="Kelola perangkat yang sedang masuk ke akunmu."
      />
      <CardContent className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-0.5">
          <p className="text-sm font-medium">Keluar dari perangkat lain</p>
          <p className="text-sm text-muted-foreground">
            Perangkat ini tetap masuk, semua perangkat lain akan keluar.
          </p>
        </div>
        <Button variant="outline" onClick={handleRevoke} disabled={pending}>
          {pending ? "Memproses..." : "Keluarkan perangkat lain"}
        </Button>
      </CardContent>

      {feedback && (
        <CardContent className="mt-3">
          <p
            role="status"
            className={cn(
              "text-sm",
              feedback.type === "success"
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-destructive",
            )}
          >
            {feedback.text}
          </p>
        </CardContent>
      )}
    </Card>
  );
}
