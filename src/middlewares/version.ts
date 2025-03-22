import type { HonoEnv } from "../types";
import { createMiddleware } from "hono/factory";
import { createError } from "../utils";

const DEFAULT_FALLBACK_VERSION = "15.1";

export const versionMiddleware = createMiddleware<HonoEnv>(async (c, next) => {
  const version = c.req.param("version");
  const fullPath = c.req.path;

  if (version == null) {
    return createError(c, 400, "missing version");
  }

  const res = await c.env.EMOJI_DATA.get("versions.json");

  if (res == null) {
    return await next();
  }

  const payload = await res.json<{
    latest_version: string;
    versions: {
      emoji_version: string;
      unicode_version: string;
      draft: boolean;
    }[];
  }>();

  const versions = payload.versions;
  const latestVersion = payload.latest_version;

  if (version !== "latest" && !versions.some((v) => v.emoji_version === version)) {
    return createError(c, 404, "version not found");
  }

  if (version === "latest") {
    const path = fullPath.replace("latest", latestVersion ?? DEFAULT_FALLBACK_VERSION);

    return c.redirect(path);
  }

  await next();
});
