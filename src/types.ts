import type { z } from "zod";
import type { ApiErrorSchema, EMOJI_VERSIONS_SCHEMA, EmojiCategorySchema, EmojiVersionSchema } from "./schemas";

export interface HonoEnv {
  Bindings: CloudflareBindings;
}

export type ApiError = z.infer<typeof ApiErrorSchema>;
export type EmojiVersions = z.infer<typeof EMOJI_VERSIONS_SCHEMA>;
export type EmojiVersion = z.infer<typeof EmojiVersionSchema>;
export type EmojiCategory = z.infer<typeof EmojiCategorySchema>;
