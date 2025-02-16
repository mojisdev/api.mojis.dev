import type { HonoContext } from "../types";
import { OpenAPIHono } from "@hono/zod-openapi";
import { EMOJI_LOCK_SCHEMA } from "../schemas";
import { createError, getCachedVersions } from "../utils";
import { ALL_EMOJI_VERSIONS_ROUTE, LATEST_EMOJI_VERSIONS_ROUTE } from "./v1_versions.openapi";

export const V1_VERSIONS_ROUTER = new OpenAPIHono<HonoContext>().basePath("/api/v1/versions");

V1_VERSIONS_ROUTER.openapi(ALL_EMOJI_VERSIONS_ROUTE, async (c) => {
  try {
    const versions = await getCachedVersions();
    return c.json(versions.map((version) => ({ version })), 200);
  } catch {
    return createError(c, 500, "failed to fetch emoji data");
  }
});

V1_VERSIONS_ROUTER.openapi(LATEST_EMOJI_VERSIONS_ROUTE, async (c) => {
  const res = await fetch("https://raw.githubusercontent.com/mojisdev/emoji-data/refs/heads/main/emojis.lock");

  if (!res.ok) {
    return createError(c, 500, "failed to fetch emoji data");
  }

  const data = await res.json();

  const result = EMOJI_LOCK_SCHEMA.safeParse(data);

  if (!result.success) {
    return createError(c, 500, "invalid emoji data schema");
  }

  return c.json(
    result.data.versions.map((version) => ({
      version: version.emoji_version,
    })),
    200,
  );
});
