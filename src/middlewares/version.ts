import type { Context } from "hono";
import type { HonoEnv } from "../types";
import { createMiddleware } from "hono/factory";
import { createError } from "../utils";

const DEFAULT_FALLBACK_VERSION = "15.1";

function redirectLatest(c: Context, path: string, latestVersion: string | null) {
  return c.redirect(path.replace("latest", latestVersion ?? DEFAULT_FALLBACK_VERSION));
}

export const versionMiddleware = createMiddleware<HonoEnv>(async (c, next) => {
  const version = c.req.param("version");
  const fullPath = c.req.path;

  if (version == null) {
    return createError(c, 400, "missing version");
  }

  try {
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
      return redirectLatest(c, fullPath, latestVersion);
    }

    return await next();
  } catch (err) {
    console.error(err);

    return redirectLatest(c, fullPath, null);
  }
});
