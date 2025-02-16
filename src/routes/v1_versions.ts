import type { HonoContext } from "../types";
import { OpenAPIHono } from "@hono/zod-openapi";
import { createError, getAvailableVersions } from "../utils";
import { ALL_EMOJI_VERSIONS_ROUTE, DRAFT_EMOJI_VERSIONS_ROUTE, LATEST_EMOJI_VERSIONS_ROUTE } from "./v1_versions.openapi";

export const V1_VERSIONS_ROUTER = new OpenAPIHono<HonoContext>().basePath("/api/v1/versions");

V1_VERSIONS_ROUTER.openapi(ALL_EMOJI_VERSIONS_ROUTE, async (c) => {
  try {
    const draft = c.req.query("draft");

    let versions = await getAvailableVersions();

    if (draft === "true") {
      versions = versions.filter((version) => !version.draft);
    }

    return c.json(versions, 200);
  } catch {
    return createError(c, 500, "failed to fetch emoji data");
  }
});

V1_VERSIONS_ROUTER.openapi(LATEST_EMOJI_VERSIONS_ROUTE, async (c) => {
  try {
    const draft = c.req.query("draft");

    let versions = await getAvailableVersions();

    if (draft === "true") {
      versions = versions.filter((version) => !version.draft);
    }

    if (versions[0] == null) {
      return createError(c, 500, "failed to fetch emoji data");
    }

    return c.json(versions[0], 200);
  } catch {
    return createError(c, 500, "failed to fetch emoji data");
  }
});

V1_VERSIONS_ROUTER.openapi(DRAFT_EMOJI_VERSIONS_ROUTE, async (c) => {
  try {
    const versions = (await getAvailableVersions()).filter((version) => version.draft);

    if (versions[0] == null) {
      return createError(c, 404, "no draft versions available");
    }

    return c.json(versions[0], 200);
  } catch {
    return createError(c, 500, "failed to fetch emoji data");
  }
});
