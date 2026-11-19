import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/materi/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_auth/app/materi/"!</div>;
}
