import { createMiddleware } from "hono/factory";
import { createError, getAvailableVersions } from "../utils";

const DEFAULT_FALLBACK_VERSION = "15.1";

export const versionMiddleware = createMiddleware(async (c, next) => {
  const version = c.req.param("version");
  const fullPath = c.req.path;

  if (version == null) {
    return createError(c, 400, "missing version");
  }

  // TODO(@luxass): cache the available versions for x amount of time.
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

    const path = fullPath.replace("latest", latestVersion.emoji_version ?? DEFAULT_FALLBACK_VERSION);

    return c.redirect(path);
  }

  await next();
});
