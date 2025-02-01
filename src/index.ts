import type { ApiError } from "./schemas";
import type { HonoContext } from "./types";
import { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { HTTPException } from "hono/http-exception";

const app = new OpenAPIHono<HonoContext>();

app.get("/", async (c) => {
  return c.json({
    message: "Hello, World!",
  });
});

app.get(
  "/",
  apiReference({
    spec: {
      url: "/openapi.json",
    },
    layout: "modern",
    theme: "bluePlanet",
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
      version: "1.0.0",
      title: "Mojis API",
    },
    tags: [

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

export default app;
