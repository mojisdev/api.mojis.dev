import type { z } from "zod";
import type { ApiErrorSchema, EMOJI_LOCK_SCHEMA, EmojiCategorySchema, EmojiVersionSchema } from "./schemas";

export interface HonoContext {
  Bindings: {
    ENVIRONMENT: string;
    API_VERSION?: string;
  };
}

export type HonoBindings = HonoContext["Bindings"];

export type ApiError = z.infer<typeof ApiErrorSchema>;
export type EmojiLock = z.infer<typeof EMOJI_LOCK_SCHEMA>;
export type EmojiVersion = z.infer<typeof EmojiVersionSchema>;
export type EmojiCategory = z.infer<typeof EmojiCategorySchema>;
