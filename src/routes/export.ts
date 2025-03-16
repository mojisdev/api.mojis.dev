import { Hono } from "hono";

export const EXPORT_ROUTER = new Hono();

EXPORT_ROUTER.get("/:version", async (c) => {
  const version = c.req.param("version");

  async function findCorrectVersion(version: string) {
    if (version === "1.0") {
      return await import(`../../.emoji-data/v1.0/groups.json`, {
        with: { type: "json" },
      }).then((mod) => mod.default);
    }

    if (version === "2.0") {
      return await import(`../../.emoji-data/v2.0/groups.json`, {
        with: { type: "json" },
      }).then((mod) => mod.default);
    }

    if (version === "3.0") {
      return await import(`../../.emoji-data/v3.0/groups.json`, {
        with: { type: "json" },
      }).then((mod) => mod.default);
    }

    if (version === "4.0") {
      return await import(`../../.emoji-data/v4.0/groups.json`, {
        with: { type: "json" },
      }).then((mod) => mod.default);
    }

    if (version === "5.0") {
      return await import(`../../.emoji-data/v5.0/groups.json`, {
        with: { type: "json" },
      }).then((mod) => mod.default);
    }

    if (version === "11.0") {
      return await import(`../../.emoji-data/v11.0/groups.json`, {
        with: { type: "json" },
      }).then((mod) => mod.default);
    }

    if (version === "12.0") {
      return await import(`../../.emoji-data/v12.0/groups.json`, {
        with: { type: "json" },
      }).then((mod) => mod.default);
    }

    if (version === "12.1") {
      return await import(`../../.emoji-data/v12.1/groups.json`, {
        with: { type: "json" },
      }).then((mod) => mod.default);
    }

    if (version === "13.0") {
      return await import(`../../.emoji-data/v13.0/groups.json`, {
        with: { type: "json" },
      }).then((mod) => mod.default);
    }

    if (version === "13.1") {
      return await import(`../../.emoji-data/v13.1/groups.json`, {
        with: { type: "json" },
      }).then((mod) => mod.default);
    }

    if (version === "14.0") {
      return await import(`../../.emoji-data/v14.0/groups.json`, {
        with: { type: "json" },
      }).then((mod) => mod.default);
    }

    if (version === "15.0") {
      return await import(`../../.emoji-data/v15.0/groups.json`, {
        with: { type: "json" },
      }).then((mod) => mod.default);
    }

    if (version === "15.1") {
      return await import(`../../.emoji-data/v15.1/groups.json`, {
        with: { type: "json" },
      }).then((mod) => mod.default);
    }

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
