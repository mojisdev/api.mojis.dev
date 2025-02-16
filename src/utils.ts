import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { ApiError } from "./types";

export function createError<TCtx extends Context, TStatus extends ContentfulStatusCode>(ctx: TCtx, status: TStatus, message: string) {
  const url = new URL(ctx.req.url);
  return ctx.json({
    path: url.pathname,
    message,
    status,
    timestamp: new Date().toISOString(),
  } satisfies ApiError, status, {
    "Content-Type": "application/json",
  });
}

const CACHE_TTL = 60 * 60;

export async function getCachedVersions(): Promise<string[]> {
  const cache = await caches.open("emoji-versions");
  const cacheKey = "versions";

  let response = await cache.match(cacheKey);

  if (!response) {
    const versions = await getAvailableVersions();
    response = new Response(JSON.stringify(versions), {
      headers: {
        "Cache-Control": `public, max-age=${CACHE_TTL}`,
        "Content-Type": "application/json",
      },
    });
    await cache.put(cacheKey, response.clone());
  }

  return JSON.parse(await response.text());
}

export async function getAvailableVersions(): Promise<string[]> {
  const res = await fetch("https://raw.githubusercontent.com/mojisdev/emoji-data/refs/heads/main/emojis.lock");

  if (!res.ok) {
    throw new Error("failed to fetch emoji data");
  }

  const data = await res.json();

  if (
    data == null
    || typeof data !== "object"
    || !("versions" in data)
    || !Array.isArray(data.versions)
    || data.versions.some((version: any) => typeof version !== "object"
      || !("emoji_version" in version)
      || typeof version.emoji_version !== "string")
  ) {
    throw new Error("invalid emoji data schema");
  }

  return data.versions.map((version) => version.emoji_version);
}
