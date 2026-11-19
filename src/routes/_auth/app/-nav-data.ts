import { ClipboardList, FolderKanban, ListChecks, PieChart, BookOpen } from "lucide-react";

import type { NavItem } from "#/components/shadcn-space/blocks/sidebar-01/nav-main.tsx";

// Adjust hrefs to match your real route files
export const navData: NavItem[] = [
  { label: "Dashboards", isSection: true },
  { title: "Beranda", icon: PieChart, href: "/app", exact: true },
  { title: "Tugas", icon: ClipboardList, href: "/app/tugas" },

  { label: "Belajar", isSection: true },
  { title: "Project", icon: FolderKanban, href: "/app/project" },
  { title: "Materi", icon: BookOpen, href: "/app/materi" },
  { title: "Quiz", icon: ListChecks, href: "/app/quiz" },
];
