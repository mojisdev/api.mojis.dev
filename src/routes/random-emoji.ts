import type { HonoContext } from "../types";
import { Hono } from "hono";
import { cache } from "../middlewares/cache";

export const RANDOM_EMOJI_ROUTER = new Hono<HonoContext>();

RANDOM_EMOJI_ROUTER.get(
  "/random-emoji.png",
  cache({
    cacheName: "random-emoji",
    cacheControl: "max-age=3600, immutable",
  }),
  async (c) => {
    return c.redirect("https://image.luxass.dev/api/image/emoji");
  },
);
