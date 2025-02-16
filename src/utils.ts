import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { ApiError, EmojiLock } from "./types";
import { EMOJI_LOCK_SCHEMA } from "./schemas";

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

export async function getAvailableVersions(): Promise<EmojiLock["versions"]> {
  const res = await fetch("https://raw.githubusercontent.com/mojisdev/emoji-data/refs/heads/main/emojis.lock");

  if (!res.ok) {
    throw new Error("failed to fetch emoji data");
  }

  const data = await res.json();

  const result = EMOJI_LOCK_SCHEMA.safeParse(data);

  if (!result.success) {
    throw new Error("invalid emoji data schema");
  }

  return result.data.versions;
}
