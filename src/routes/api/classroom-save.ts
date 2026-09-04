import { createFileRoute } from "@tanstack/react-router";
import { readVault, writeVault } from "@/lib/classroom-vault.server";

export const Route = createFileRoute("/api/classroom-save")({
  server: {
    handlers: {
      GET: async () => {
        const data = await readVault();
        if (!data) {
          return Response.json({ empty: true });
        }
        return Response.json(data);
      },
      PUT: async ({ request }) => {
        try {
          const body = await request.json();
          const result = await writeVault(body);
          if (!result.ok) {
            return Response.json(result, { status: 409 });
          }
          return Response.json({ ok: true });
        } catch {
          return Response.json({ ok: false, error: "Bad request" }, { status: 400 });
        }
      },
    },
  },
});
