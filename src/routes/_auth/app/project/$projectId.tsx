import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/project/$projectId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_auth/app/project/$projectId"!</div>;
}
