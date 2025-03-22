import type { HonoContext } from "../types";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cache } from "../middlewares/cache";
import { createError } from "../utils";
import { GITHUB_EMOJIS_ROUTE } from "./gateway_github.openapi";

export const GATEWAY_GITHUB_ROUTER = new OpenAPIHono<HonoContext>().basePath("/api/gateway/github");

GATEWAY_GITHUB_ROUTER.get("*", cache({
  cacheName: "github-emojis",
  cacheControl: "max-age=3600, immutable",
}));

GATEWAY_GITHUB_ROUTER.openapi(GITHUB_EMOJIS_ROUTE, async (c) => {
  const response = await fetch("https://api.github.com/emojis", {
    headers: {
      "Accept": "application/vnd.github.v3+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Authorization": `Bearer ${c.env.GITHUB_TOKEN}`,
      "User-Agent": "luxass - (api.mojis.dev)",
    },
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error(`GitHub API error: ${response.status} - ${errorData}`);

    return createError(c, 500, "Internal Server Error");
  }

  const emojis = await response.json<Record<string, string>>();

  return c.json(emojis, 200);
});
