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

  if (version !== "latest") {
    return await next();
  }

  try {
    // eslint-disable-next-line no-console
    console.time("fetch-emoji-versions");
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
    // eslint-disable-next-line no-console
    console.timeEnd("fetch-emoji-versions");

    const latestVersion = payload.latest_version;

    if (version === "latest") {
      return redirectLatest(c, fullPath, latestVersion);
    }

    return await next();
  } catch (err) {
    console.error(err);

    return redirectLatest(c, fullPath, null);
  }
});
