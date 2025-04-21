import { createRoute } from "@hono/zod-openapi";
import { BRANCH_PARAMETER } from "../global-openapi";
import { ApiErrorSchema, EMOJI_DATA_SPEC_SCHEMA } from "../schemas";
import { EMOJI_DATA_SPECS } from "./v1_emoji-data.schemas";

const VERSION_PATH_PARAMETER = {
  in: "path" as const,
  name: "version",
  description: "The emoji version to use",
  required: true,
  example: "latest",
  schema: {
    type: "string" as const,
  },
};

export const EMOJI_DATA_VERSIONS_ROUTE = createRoute({
  method: "get",
  path: "/versions",
  tags: ["Emoji Data"],
  parameters: [
    BRANCH_PARAMETER,
  ],
  description: "Retrieve a list of Emoji Versions which has Emoji Data generated for it.",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: EMOJI_DATA_SPECS,
        },
      },
      description: "Retrieve a list of Emoji Versions which has Emoji Data generated for it.",
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

export const EMOJI_DATA_VERSION_ROUTE = createRoute({
  method: "get",
  path: "/versions/{version}",
  tags: ["Emoji Data"],
  parameters: [
    BRANCH_PARAMETER,
    VERSION_PATH_PARAMETER,
  ],
  description: "Describe a version's emoji data spec",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: EMOJI_DATA_SPEC_SCHEMA,
        },
      },
      description: "Describe a version's emoji data spec",
    },
    404: {
      content: {
        "application/json": {
          schema: ApiErrorSchema,
        },
      },
      description: "The version is either not valid, or not available",
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
