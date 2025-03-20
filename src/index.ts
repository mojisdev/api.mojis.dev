import type { ApiError, HonoContext } from "./types";
import { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { env } from "hono/adapter";
import { HTTPException } from "hono/http-exception";
import { buildOpenApiConfig } from "./openapi";
import { GATEWAY_GITHUB_ROUTER } from "./routes/gateway_github";
import { RANDOM_EMOJI_ROUTER } from "./routes/random-emoji";
import { V1_CATEGORIES_ROUTER } from "./routes/v1_categories";
import { V1_VERSIONS_ROUTER } from "./routes/v1_versions";

const app = new OpenAPIHono<HonoContext>();

app.route("/", V1_VERSIONS_ROUTER);
app.route("/", V1_CATEGORIES_ROUTER);
app.route("/", GATEWAY_GITHUB_ROUTER);
app.route("/", RANDOM_EMOJI_ROUTER);

app.get(
  "/scalar",
  apiReference({
    url: "/openapi.json",
    layout: "classic",
    customCss: /* css */`
    .endpoint-label-path {
      display: none !important;
    }

    .show-api-client-button {
      background: var(--theme-color-accent) !important;
    }

    .scalar-codeblock-code {
      display: unset;
    }

    :root {
      --theme-color-accent: rgb(59, 130, 246);
      --theme-color-background: hsla(348, 71%, 93%, 1);
      --scalar-api-client-color: var(--theme-color-accent);
      --scalar-background-1: hsla(241.9, 6.3926%, 10.038%) !important;
    }

    .dark-mode {
      --scalar-background-1: hsla(241.9, 6.3926%, 10.038%) !important;
      --scalar-color-accent: rgb(59, 130, 246) !important;
      --scalar-color-background: hsla(348, 24%, 12%, 1) !important;
      }
    `,
  }),
);

app.doc("/openapi.json", (c) => {
  const server = {
    url: "http://localhost:8787",
    description: "Local Environment",
  };

  if (c.env.ENVIRONMENT === "production") {
    server.url = "https://api.mojis.dev";
    server.description = "Production Environment";
  }

  if (c.env.ENVIRONMENT === "preview") {
    server.url = "https://api.preview.mojis.dev";
    server.description = "Preview Environment";
  }

  return buildOpenApiConfig(env(c).API_VERSION || "x.y.z", [
    server,
  ]);
});

app.onError(async (err, c) => {
  console.error(err);
  const url = new URL(c.req.url);
  if (err instanceof HTTPException) {
    return c.json({
      path: url.pathname,
      status: err.status,
      message: err.message,
      timestamp: new Date().toISOString(),
    } satisfies ApiError, err.status);
  }

  return c.json({
    path: url.pathname,
    status: 500,
    message: "Internal server error",
    timestamp: new Date().toISOString(),
  } satisfies ApiError, 500);
});

app.notFound(async (c) => {
  const url = new URL(c.req.url);
  return c.json({
    path: url.pathname,
    status: 404,
    message: "Not found",
    timestamp: new Date().toISOString(),
  } satisfies ApiError, 404);
});

export default app;
