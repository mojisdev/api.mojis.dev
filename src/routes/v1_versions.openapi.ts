import { createRoute, z } from "@hono/zod-openapi";
import { ApiErrorSchema, EmojiVersion } from "../schemas";

export const ALL_EMOJI_VERSIONS_ROUTE = createRoute({
  method: "get",
  path: "/",
  tags: ["Versions"],
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

export const LATEST_EMOJI_VERSIONS_ROUTE = createRoute({
  method: "get",
  path: "/latest",
  tags: ["Versions"],
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
