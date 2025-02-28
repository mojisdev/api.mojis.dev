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

export function cache<TCtx extends Context>(ctx: TCtx, age: number, immutable = false) {
  if (age === -1) {
    ctx.header("Expires", "0");
    ctx.header("Pragma", "no-cache");
    ctx.header("Cache-Control", "no-cache, no-store, must-revalidate");
    return;
  }

  ctx.header("Expires", new Date(Date.now() + age * 1000).toUTCString());
  ctx.header("Cache-Control", ["public", `max-age=${age}`, immutable ? "immutable" : null].filter((x) => !!x).join(", "));
};
