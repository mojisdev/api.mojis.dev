import type { HonoContext } from "../types";
import { OpenAPIHono, z } from "@hono/zod-openapi";
import { EmojiCategorySchema } from "../schemas";
import { createError, getAvailableVersions } from "../utils";
import { ALL_CATEGORIES_ROUTE, GET_CATEGORY_ROUTE } from "./v1_categories.openapi";

export const V1_CATEGORIES_ROUTER = new OpenAPIHono<HonoContext>().basePath("/api/v1/categories/:version");

V1_CATEGORIES_ROUTER.use(async (c, next) => {
  const version = c.req.param("version");
  const fullPath = c.req.path;

  if (version == null) {
    return createError(c, 400, "missing version");
  }

  const availableVersions = await getAvailableVersions();

  if (version !== "latest" && !availableVersions.some((v) => v.emoji_version === version)) {
    return createError(c, 404, "version not found");
  }

  if (version === "latest") {
    // redirect to the latest version, that isn't a draft.
    const latestVersion = availableVersions.find((v) => !v.draft);

    if (latestVersion == null) {
      return createError(c, 404, "no versions available");
    }

    const path = fullPath.replace("latest", latestVersion.emoji_version ?? "15.1");

    return c.redirect(path);
  }

  await next();
});

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
