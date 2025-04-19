import type { HonoEnv } from "../types";
import emojis from "@mojis/json-schemas/metadata-emojis.json";
import groups from "@mojis/json-schemas/metadata-groups.json";
import sequences from "@mojis/json-schemas/sequences-sequences.json";
import zwjSequences from "@mojis/json-schemas/sequences-zwj.json";
import unicodeNames from "@mojis/json-schemas/unicode-names-unicodeNames.json";
import variations from "@mojis/json-schemas/variations-variations.json";
import { Hono } from "hono";
import { cache } from "../middlewares/cache";

export const DATA_SCHEMAS_ROUTER = new Hono<HonoEnv>().basePath("/data-schemas");

DATA_SCHEMAS_ROUTER.get("*", cache({
  cacheName: "data-schemas",
  cacheControl: "max-age=3600, immutable",
}));

const SCHEMAS = [
  ["/metadata/emojis.json", emojis],
  ["/metadata/groups.json", groups],
  ["/sequences/sequences.json", sequences],
  ["/sequences/zwj.json", zwjSequences],
  ["/unicode-names/unicodeNames.json", unicodeNames],
  ["/variations/variations.json", variations],
] as const;

for (const [path, schema] of SCHEMAS) {
  DATA_SCHEMAS_ROUTER.get(path, (c) => {
    return c.json(schema);
  });
}
