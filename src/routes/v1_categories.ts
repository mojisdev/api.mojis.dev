import type { HonoContext } from "../types";
import { OpenAPIHono, z } from "@hono/zod-openapi";
import { versionMiddleware } from "../middlewares/version";
import { EmojiCategorySchema } from "../schemas";
import { createError } from "../utils";
import { ALL_CATEGORIES_ROUTE, GET_CATEGORY_ROUTE } from "./v1_categories.openapi";

export const V1_CATEGORIES_ROUTER = new OpenAPIHono<HonoContext>().basePath("/api/v1/categories/:version");

V1_CATEGORIES_ROUTER.use(versionMiddleware);

V1_CATEGORIES_ROUTER.openapi(ALL_CATEGORIES_ROUTE, async (c) => {
  const version = c.req.param("version");

  const res = await fetch(`https://raw.githubusercontent.com/mojisdev/emoji-data/refs/heads/main/data/v${version}/groups.json`);

  if (!res.ok) {
    return createError(c, 500, "failed to fetch categories");
  }

  const data = await res.json();

  const result = z.array(EmojiCategorySchema).safeParse(data);

  if (!result.success) {
    return createError(c, 500, "failed to parse categories");
  }

  const categories = result.data;

  return c.json(
    categories,
    200,
  );
});

V1_CATEGORIES_ROUTER.openapi(GET_CATEGORY_ROUTE, async (c) => {
  const version = c.req.param("version");
  const categorySlug = c.req.param("category");

  const res = await fetch(`https://raw.githubusercontent.com/mojisdev/emoji-data/refs/heads/main/data/v${version}/groups.json`);

  if (!res.ok) {
    return createError(c, 500, "failed to fetch categories");
  }

  const data = await res.json();

  const result = z.array(EmojiCategorySchema).safeParse(data);

  if (!result.success) {
    return createError(c, 500, "failed to parse categories");
  }

  const category = result.data.find((c) => c.slug === categorySlug);

  return c.json(
    category,
    200,
  );
});
