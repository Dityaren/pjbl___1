import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/profil/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_auth/app/profil/"!</div>;
}
