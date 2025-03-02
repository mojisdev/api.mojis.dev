import { createRoute, z } from "@hono/zod-openapi";
import { VERSION_PATH_PARAMETER } from "../middlewares/version";
import { ApiErrorSchema, EmojiCategorySchema } from "../schemas";

export const ALL_CATEGORIES_ROUTE = createRoute({
  method: "get",
  path: "/",
  tags: ["Categories"],
  parameters: [
    VERSION_PATH_PARAMETER,
  ],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(EmojiCategorySchema),
        },
      },
      description: "Retrieve a list of all emoji categories available for the specified version",
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
    VERSION_PATH_PARAMETER,
    {
      in: "path",
      name: "category",
      required: true,
      example: "smileys",
      schema: {
        type: "string",
      },
    },
  ],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: EmojiCategorySchema,
        },
      },
      description: "Retrieve the information for the specified emoji category",
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
