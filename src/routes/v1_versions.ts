import type { HonoContext } from "../types";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { ApiErrorSchema, EmojiVersion } from "../schemas";
import { createError } from "../utils";

export const V1_VERSIONS_ROUTER = new OpenAPIHono<HonoContext>().basePath("/api/v1/versions")

const ALL_EMOJI_VERSIONS_ROUTE = createRoute({
  method: "get",
  path: "/",
  tags: ["Misc"],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(EmojiVersion),
        },
      },
      description: "Retrieve a list of all emoji versions available",
    },
    500: {
      content: {
        "application/json": {
          schema: ApiErrorSchema,
        },
      },
      description: "Internal Server Error",
    },
  },
});

const EMOJI_LOCK_SCHEMA = z.object({
  versions: z.array(z.string()),
});

V1_VERSIONS_ROUTER.openapi(ALL_EMOJI_VERSIONS_ROUTE, async (c) => {
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
