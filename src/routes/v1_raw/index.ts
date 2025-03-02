import type { HonoContext } from "../../types";
import { OpenAPIHono } from "@hono/zod-openapi";

export const V1_RAW_ROUTER = new OpenAPIHono<HonoContext>().basePath("/api/v1/raw");
