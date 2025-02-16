import { z } from "@hono/zod-openapi";

export const EmojiVersion = z.object({
  version: z.string().openapi({
    description: "The emoji version",
    example: "16.0",
  }),
});

export const ApiErrorSchema = z.object({
  path: z.string().openapi({
    description: "The path of the request",
  }),
  message: z.string().openapi({
    description: "The error message",
  }),
  status: z.number().openapi({
    description: "The HTTP status code",
  }),
  timestamp: z.string().openapi({
    description: "The timestamp of the error",
  }),
}).openapi("ApiError", {
  description: "An error response",
});

export const EMOJI_LOCK_SCHEMA = z.object({
  versions: z.array(z.object({
    emoji_version: z.string(),
  })),
});
