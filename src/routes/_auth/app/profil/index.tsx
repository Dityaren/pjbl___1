import { createFileRoute, useRouter } from "@tanstack/react-router";
import { CalendarDays, Mail, ShieldCheck, TriangleAlert } from "lucide-react";
import * as React from "react";

import { PageHeader } from "#/components/app-main.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar.tsx";
import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#/components/ui/card.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Label } from "#/components/ui/label.tsx";
import { authClient } from "#/lib/auth/auth-client";
import { useAuthSuspense } from "#/lib/auth/hooks";
import { cn } from "#/lib/utils.ts";

export const Route = createFileRoute("/_auth/app/profil/")({
  component: ProfilPage,
});

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

type Feedback = { type: "success" | "error"; text: string } | null;

function FeedbackText({ feedback }: { feedback: Feedback }) {
  if (!feedback) return null;
  return (
    <p
      role="status"
      className={cn(
        "text-sm",
        feedback.type === "success" ? "text-emerald-600 dark:text-emerald-400" : "text-destructive",
      )}
    >
      {feedback.text}
    </p>
  );
}

function ProfilPage() {
  const { user } = useAuthSuspense();

  if (!user) return null;

  return (
    <>
      <PageHeader title="Profil" description="Kelola informasi akun dan keamananmu." />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Identitas */}
        <Card className="h-fit shadow-none lg:col-span-1">
          <CardContent className="flex flex-col items-center gap-4 text-center">
            <Avatar className="size-24">
              <AvatarImage src={user.image ?? undefined} alt={user.name} />
              <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>

            <Badge
              variant="outline"
              className={cn(
                "gap-1 font-normal",
                user.emailVerified
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-600 dark:text-amber-400",
              )}
            >
              {user.emailVerified ? (
                <ShieldCheck className="size-3.5" />
              ) : (
                <TriangleAlert className="size-3.5" />
              )}
              {user.emailVerified ? "Email terverifikasi" : "Email belum terverifikasi"}
            </Badge>

            <div className="w-full space-y-2 border-t pt-4 text-left text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" />
                <span className="truncate">{user.email}</span>
              </p>
              <p className="flex items-center gap-2">
                <CalendarDays className="size-4 shrink-0" />
                Bergabung {dateFormatter.format(new Date(user.createdAt))}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <ProfileForm name={user.name} email={user.email} />
          <PasswordForm />
        </div>
      </div>
    </>
  );
}

function ProfileForm({ name, email }: { name: string; email: string }) {
  const router = useRouter();
  const [value, setValue] = React.useState(name);
  const [pending, setPending] = React.useState(false);
  const [feedback, setFeedback] = React.useState<Feedback>(null);

  const trimmed = value.trim();
  const unchanged = trimmed === name;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimmed || unchanged) return;

    setPending(true);
    setFeedback(null);

    const { error } = await authClient.updateUser({ name: trimmed });

    if (error) {
      setFeedback({
        type: "error",
        text: error.message ?? "Gagal menyimpan perubahan.",
      });
    } else {
      setFeedback({ type: "success", text: "Profil berhasil diperbarui." });
      await router.invalidate(); // muat ulang data user di sidebar dan halaman
    }
    setPending(false);
  };

  return (
    <Card className="shadow-none">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Informasi pribadi</CardTitle>
          <CardDescription>Nama ini tampil di sidebar dan di project kelompokmu.</CardDescription>
        </CardHeader>

        <CardContent className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama lengkap</Label>
            <Input
              id="name"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoComplete="name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} disabled readOnly />
            <p className="text-xs text-muted-foreground">
              Email tidak bisa diubah dari halaman ini.
            </p>
          </div>
        </CardContent>

        <CardFooter className="mt-4 flex items-center justify-between gap-3">
          <FeedbackText feedback={feedback} />
          <Button type="submit" className="ml-auto" disabled={pending || !trimmed || unchanged}>
            {pending ? "Menyimpan..." : "Simpan perubahan"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function PasswordForm() {
  const [current, setCurrent] = React.useState("");
  const [next, setNext] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [feedback, setFeedback] = React.useState<Feedback>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (next.length < 8) {
      setFeedback({ type: "error", text: "Password baru minimal 8 karakter." });
      return;
    }
    if (next !== confirm) {
      setFeedback({ type: "error", text: "Konfirmasi password tidak sama." });
      return;
    }

    setPending(true);
    setFeedback(null);

    const { error } = await authClient.changePassword({
      currentPassword: current,
      newPassword: next,
      revokeOtherSessions: true,
    });

    if (error) {
      setFeedback({
        type: "error",
        text: error.message ?? "Gagal mengganti password.",
      });
    } else {
      setFeedback({ type: "success", text: "Password berhasil diganti." });
      setCurrent("");
      setNext("");
      setConfirm("");
    }
    setPending(false);
  };

  return (
    <Card className="shadow-none">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Ganti password</CardTitle>
          <CardDescription>
            Perangkat lain akan otomatis keluar setelah password diganti.
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Password saat ini</Label>
            <Input
              id="current-password"
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-password">Password baru</Label>
              <Input
                id="new-password"
                type="password"
                value={next}
                onChange={(e) => setNext(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Konfirmasi password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="mt-4 flex items-center justify-between gap-3">
          <FeedbackText feedback={feedback} />
          <Button
            type="submit"
            className="ml-auto"
            disabled={pending || !current || !next || !confirm}
          >
            {pending ? "Menyimpan..." : "Ganti password"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
