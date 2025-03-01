import type { HonoContext } from "../types";
import { Hono } from "hono";
import { cache } from "../utils";

export const RANDOM_EMOJI_ROUTER = new Hono<HonoContext>();

RANDOM_EMOJI_ROUTER.get("/random-emoji.png", async (c) => {
  cache(c, 60 * 60);
  return c.redirect("https://image.luxass.dev/api/image/emoji");
});
