import type { z } from "zod";
import type { ApiErrorSchema, EMOJI_LOCK_SCHEMA, EmojiCategorySchema, EmojiVersionSchema } from "./schemas";

export interface HonoEnv {
  Bindings: CloudflareBindings;
}

export type ApiError = z.infer<typeof ApiErrorSchema>;
export type EmojiLock = z.infer<typeof EMOJI_LOCK_SCHEMA>;
export type EmojiVersion = z.infer<typeof EmojiVersionSchema>;
export type EmojiCategory = z.infer<typeof EmojiCategorySchema>;
