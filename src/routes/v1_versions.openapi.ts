import { createRoute, z } from "@hono/zod-openapi";
import { ApiErrorSchema, EmojiVersionSchema } from "../schemas";

const DRAFT_PARAMETER = {
  in: "query" as const,
  name: "draft",
  required: false,
  description: "Whether to include draft versions",
  schema: {
    type: "string" as const,
    enum: ["true", "false"],
  },
};

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
