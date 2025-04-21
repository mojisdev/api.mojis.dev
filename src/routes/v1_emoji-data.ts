import type { HonoEnv } from "../types";
import { OpenAPIHono, z } from "@hono/zod-openapi";
import { DEFAULT_USER_AGENT } from "../constants";
import { cache } from "../middlewares/cache";
import { createError } from "../utils";
import { EMOJI_DATA_VERSIONS } from "./v1_emoji-data.openapi";

export const V1_EMOJI_DATA_ROUTER = new OpenAPIHono<HonoEnv>().basePath("/api/v1/emoji-data");

function isGitHubContentArray(data: unknown): data is {
  name: string;
}[] {
  return Array.isArray(data) && data.every((item): item is {
    name: string;
  } =>
    typeof item === "object"
    && item !== null
    && "name" in item
    && typeof item.name === "string",
  );
}

V1_EMOJI_DATA_ROUTER.get("*", cache({
  cacheName: "v1-emoji-data",
  cacheControl: "max-age=3600, immutable",
}));

V1_EMOJI_DATA_ROUTER.openapi(EMOJI_DATA_VERSIONS, async (c) => {
  const branch = c.req.query("branch") ?? "main";

  const res = await fetch(`https://api.github.com/repos/mojisdev/emoji-data/contents/data?ref=${branch}`, {
    headers: {
      "Accept": "application/vnd.github.v3+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Authorization": `Bearer ${c.env.GITHUB_TOKEN}`,
      "User-Agent": DEFAULT_USER_AGENT,
    },
  });

  if (!res.ok) {
    return createError(c, 500, "failed to fetch emoji data");
  }

  const data = await res.json();

  if (!isGitHubContentArray(data)) {
    return createError(c, 500, "failed to fetch emoji data");
  }

  const specs = data.map((item) => ({
    version: item.name,
    path: `/data/${item.name}`,
  }));

  return c.json(specs, 200);
});
