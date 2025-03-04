import type { OpenAPIHono } from "@hono/zod-openapi";

export type OpenAPIObjectConfig = Parameters<OpenAPIHono["getOpenAPI31Document"]>[0];

export function buildOpenApiConfig(version: string, servers: NonNullable<OpenAPIObjectConfig["servers"]>) {
  return {
    openapi: "3.0.0",
    info: {
      title: "Mojis API",
      description: `Mojis API Documentation
      This API provides endpoints to get emojis, categories, and versions.`,
      version,
      license: {
        name: "MIT",
        url: "https://github.com/mojisdev/api.mojis.dev/blob/main/LICENSE",
      },
      contact: {
        name: "Mojis",
        url: "https://mojis.dev",
        email: "mail@mojis.dev",
      },
    },
    // The tags should be sorted alphabetically
    // TODO: fail if this isn't sorted
    tags: [
      {
        name: "Categories",
        description: "Categories related endpoints",
      },
      {
        name: "Gateway",
        description: "Gateway related endpoints",
      },
      {
        name: "Versions",
        description: "Emoji versions related endpoints",
      },
    ],
    servers,
  } satisfies OpenAPIObjectConfig;
}
