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

  // const availableVersions = await getAvailableVersions();

  // if (!availableVersions.includes(version) && version !== "latest") {
  //   return createError(c, 400, "invalid version");
  // }

  await next();
});

V1_CATEGORIES_ROUTER.openapi(ALL_CATEGORIES_ROUTE, async (c) => {
  const _version = c.req.param("version");

  return c.json(
    [],
    200,
  );
});
