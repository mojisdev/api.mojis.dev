import { z } from "@hono/zod-openapi";
import { EMOJI_DATA_SPEC_SCHEMA } from "../schemas";

export const EMOJI_DATA_SPECS = z.array(EMOJI_DATA_SPEC_SCHEMA).openapi("EmojiDataSpecs");
