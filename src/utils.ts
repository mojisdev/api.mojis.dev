import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { ApiError, EmojiVersions } from "./types";
import { EMOJI_VERSIONS_SCHEMA } from "./schemas";

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

export async function getAvailableVersions(): Promise<EmojiVersions> {
  const res = await fetch("https://raw.githubusercontent.com/mojisdev/emoji-data/refs/heads/main/emoji-versions.json");

  if (!res.ok) {
    throw new Error("failed to fetch emoji data");
  }

  const data = await res.json();

  const result = EMOJI_VERSIONS_SCHEMA.safeParse(data);

  if (!result.success) {
    throw new Error("invalid emoji data schema");
  }

  return result.data;
}
