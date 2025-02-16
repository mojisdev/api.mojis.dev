import { createRoute, z } from "@hono/zod-openapi";
import { ApiErrorSchema, EmojiVersion } from "../schemas";

export const ALL_CATEGORIES_ROUTE = createRoute({
  method: "get",
  path: "/",
  tags: ["Categories"],
  parameters: [
    {
      in: "path",
      name: "version",
      required: true,
      example: "latest",
      schema: {
        type: "string",
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

export const GET_CATEGORY_ROUTE = createRoute({
  method: "get",
  path: "/{category}",
  tags: ["Categories"],
  parameters: [
    {
      in: "path",
      name: "version",
      required: true,
      schema: {
        type: "string",
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
