import type { HonoContext } from "../types";
import { Hono } from "hono";

export const RANDOM_EMOJI_ROUTER = new Hono<HonoContext>();

RANDOM_EMOJI_ROUTER.get("/random-emoji.png", async (c) => {
  // TODO: implement our own random emoji endpoint
  return c.redirect("https://image.luxass.dev/api/image/emoji");
});
