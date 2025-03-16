import { Hono } from "hono";

export const EXPORT_ROUTER = new Hono();

EXPORT_ROUTER.get("/:version", async (c) => {
  const version = c.req.param("version");

  async function findCorrectVersion(version: string) {
    if (version === "16.0") {
      return await import(`../../.emoji-data/v16.0/groups.json`, {
        with: { type: "json" },
      }).then((mod) => mod.default);
    }

    if (version === "17.0") {
      return await import(`../../.emoji-data/v17.0/groups.json`, {
        with: { type: "json" },
      }).then((mod) => mod.default);
    }

    throw new Error(`Unsupported version: ${version}`);
  }

  const mod = await findCorrectVersion(version);

  return c.json(mod);
});
