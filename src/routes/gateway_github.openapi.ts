import { createRoute, z } from "@hono/zod-openapi";
import { ApiErrorSchema } from "../schemas";

export const GITHUB_EMOJIS_ROUTE = createRoute({
  method: "get",
  path: "/emojis",
  tags: ["Gateway"],
  description: "Retrieve a list of all GitHub emojis",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.record(z.string()).openapi({
            description: "A list of all GitHub emojis available",
          }),
        },
      },
      description: "Retrieve a list of all GitHub emojis",
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
