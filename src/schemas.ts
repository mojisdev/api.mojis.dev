import { z } from "@hono/zod-openapi";

export const EmojiVersionSchema = z.object({
  draft: z.boolean().openapi({
    description: "Whether the version is a draft",
    example: false,
  }),
  emoji_version: z.string().nullable().openapi({
    description: "The emoji version",
    example: "16.0",
  }),
  unicode_version: z.string().nullable().openapi({
    description: "The Unicode version that corresponds to the emoji version",
    example: "14.0",
  }),
});

export const EmojiCategorySchema = z.object({
  name: z.string().openapi({
    description: "The name of the category",
    example: "Smileys & Emotion",
  }),
  slug: z.string().openapi({
    description: "The slug of the category",
    example: "smileys-emotion",
  }),
  subgroups: z.array(z.string()).openapi({
    description: "The subgroups of the category",
    example: ["face-smiling", "face-affection"],
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

export const EMOJI_VERSIONS_SCHEMA = z.array(
  z.object({
    emoji_version: z.string().nullable(),
    unicode_version: z.string().nullable(),
    draft: z.boolean(),
  }),
);

export const EMOJI_DATA_SPEC_SCHEMA = z.object({
  version: z.string().openapi({
    description: "The emoji version that this spec is for",
    example: "16.0",
  }),
  path: z.string().openapi({
    description: "The path to the emoji data file",
    example: "/emoji-data/16.0.json",
  }),
});
