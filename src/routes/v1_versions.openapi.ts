import { createRoute, z } from "@hono/zod-openapi";
import { DRAFT_PARAMETER } from "../global-openapi";
import { ApiErrorSchema, EmojiVersionSchema } from "../schemas";

export const ALL_EMOJI_VERSIONS_ROUTE = createRoute({
  method: "get",
  path: "/",
  tags: ["Versions"],
  parameters: [
    DRAFT_PARAMETER,
  ],
  description: "Retrieve a list of all emoji versions available",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(EmojiVersionSchema).openapi("EmojiVersions"),
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
  parameters: [
    DRAFT_PARAMETER,
  ],
  description: "Retrieve the latest emoji version available",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: EmojiVersionSchema,
        },
      },
      description: "Retrieve the latest emoji version available",
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

export const DRAFT_EMOJI_VERSIONS_ROUTE = createRoute({
  method: "get",
  path: "/draft",
  tags: ["Versions"],
  description: "Retrieve the latest draft emoji version available",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: EmojiVersionSchema,
        },
      },
      description: "Retrieve the latest draft emoji version available",
    },
    404: {
      content: {
        "application/json": {
          schema: ApiErrorSchema,
        },
      },
      description: "No draft versions available",
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

export const SUPPORTED_VERSIONS_ROUTE = createRoute({
  method: "get",
  path: "/supported",
  tags: ["Versions"],
  description: "Retrieve a list of emoji versions that is supported by @mojis",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(z.string()).openapi("SupportedVersions"),
        },
      },
      description: "Retrieve a list of emoji versions that is supported by @mojis",
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
