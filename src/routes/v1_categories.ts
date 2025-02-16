import type { HonoContext } from "../types";
import { OpenAPIHono } from "@hono/zod-openapi";
import { createError, getAvailableVersions } from "../utils";
import { ALL_CATEGORIES_ROUTE } from "./v1_categories.openapi";

export const V1_CATEGORIES_ROUTER = new OpenAPIHono<HonoContext>().basePath("/api/v1/categories/:version");

V1_CATEGORIES_ROUTER.use(async (c, next) => {
  const version = c.req.param("version");

  if (version == null) {
    return createError(c, 400, "missing version");
  }

  const availableVersions = await getAvailableVersions();

  if (version !== "latest" && !availableVersions.some((v) => v.emoji_version === version)) {
    return createError(c, 404, "version not found");
  }

  await next();
});

V1_CATEGORIES_ROUTER.openapi(ALL_CATEGORIES_ROUTE, async (c) => {
  const version = c.req.param("version");

  const res = await fetch(`https://raw.githubusercontent.com/mojisdev/emoji-data/refs/heads/main/data/v${version}/groups.json`);

  if (!res.ok) {
    return createError(c, 500, "failed to fetch categories");
  }

  const categories = await res.json();

  return c.json(
    categories as [],
    200,
  );
});
