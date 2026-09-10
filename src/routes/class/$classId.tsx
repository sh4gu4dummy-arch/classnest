import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/class/$classId")({
  component: ClassLayout,
});

function ClassLayout() {
  return <Outlet />;
}
