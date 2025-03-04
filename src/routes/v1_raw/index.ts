import type { HonoContext } from "../../types";
import { OpenAPIHono } from "@hono/zod-openapi";
import { versionMiddleware } from "../../middlewares/version";

export const V1_RAW_ROUTER = new OpenAPIHono<HonoContext>().basePath("/api/v1/raw/:version");

V1_RAW_ROUTER.use(versionMiddleware);
