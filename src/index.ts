import type { ApiError, HonoContext } from "./types";
import { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { env } from "hono/adapter";
import { showRoutes } from "hono/dev";
import { HTTPException } from "hono/http-exception";
import { V1_CATEGORIES_ROUTER } from "./routes/v1_categories";
import { V1_VERSIONS_ROUTER } from "./routes/v1_versions";

const app = new OpenAPIHono<HonoContext>();

app.route("/", V1_VERSIONS_ROUTER);
app.route("/", V1_CATEGORIES_ROUTER);

app.get(
  "/scalar",
  apiReference({
    spec: {
      url: "/openapi.json",
    },
    layout: "classic",
    customCss: /* css */`
    .tag-section {
      padding: 0 !important;
    }

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
    server.url = "https://preview.api.mojis.dev";
    server.description = "Preview Environment";
  }

  return {
    openapi: "3.0.0",
    info: {
      version: env(c).API_VERSION || "x.y.z",
      title: "Mojis API",
    },
    tags: [
      {
        name: "Emoji",
        description: "Emoji related endpoints",
      },
      {
        name: "Versions",
        description: "Emoji versions related endpoints",
      },
    ],
    servers: [
      server,
    ],
  };
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

showRoutes(app);

export default app;
