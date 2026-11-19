import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/quiz/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_auth/app/quiz/"!</div>;
}
