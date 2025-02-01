import type { HonoContext } from "../types";
import { OpenAPIHono, z } from "@hono/zod-openapi";
import { createError } from "../utils";
import { ALL_EMOJI_VERSIONS_ROUTE } from "./versions.openapi";

export const VERSIONS_ROUTER = new OpenAPIHono<HonoContext>();

const EMOJI_LOCK_SCHEMA = z.object({
  versions: z.array(z.string()),
});

VERSIONS_ROUTER.openapi(ALL_EMOJI_VERSIONS_ROUTE, async (c) => {
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
    result.data.versions.map((version: string) => ({
      version,
    })),
    200,
  );
});
