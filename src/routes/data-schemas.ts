import type { HonoEnv } from "../types";
import groupsSchema from "@mojis/json-schemas/groups.json";
import { Hono } from "hono";
import { cache } from "../middlewares/cache";

export const DATA_SCHEMAS_ROUTER = new Hono<HonoEnv>().basePath("/data-schemas");

DATA_SCHEMAS_ROUTER.get("*", cache({
  cacheName: "data-schemas",
  cacheControl: "max-age=3600, immutable",
}));

DATA_SCHEMAS_ROUTER.get("/groups", (c) => {
  return c.json(groupsSchema);
});
