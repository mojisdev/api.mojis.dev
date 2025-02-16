import type { z } from "zod";
import type { ApiErrorSchema } from "./schemas";

export interface HonoContext {
  Bindings: {
    ENVIRONMENT: string;
    API_VERSION?: string;
  };
}

export type HonoBindings = HonoContext["Bindings"];

export type ApiError = z.infer<typeof ApiErrorSchema>;
