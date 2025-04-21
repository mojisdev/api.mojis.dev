import { createRoute } from "@hono/zod-openapi";
import { BRANCH_PARAMETER } from "../global-openapi";
import { ApiErrorSchema } from "../schemas";
import { EMOJI_DATA_SPECS } from "./v1_emoji-data.schemas";

export const EMOJI_DATA_VERSIONS = createRoute({
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
