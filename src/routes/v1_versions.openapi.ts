import { createRoute, z } from "@hono/zod-openapi";
import { ApiErrorSchema, EmojiVersion } from "../schemas";

export const ALL_EMOJI_VERSIONS_ROUTE = createRoute({
  method: "get",
  path: "/",
  tags: ["Versions"],
  parameters: [
    {
      in: "query",
      name: "draft",
      required: false,
      description: "Whether to include draft versions",
      schema: {
        type: "boolean",
      },
    },
  ],
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
  parameters: [
    {
      in: "query",
      name: "draft",
      required: false,
      description: "Whether to include draft versions",
      schema: {
        type: "boolean",
      },
    },
  ],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: EmojiVersion,
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
  responses: {
    200: {
      content: {
        "application/json": {
          schema: EmojiVersion,
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
