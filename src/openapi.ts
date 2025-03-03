export function buildOpenApiConfig(version: string, servers: { url: string; description: string }[]) {
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
      },
    },
    tags: [
      {
        name: "Categories",
        description: "Categories related endpoints",
      },
      {
        name: "Versions",
        description: "Emoji versions related endpoints",
      },
      {
        name: "Gateway",
        description: "Gateway related endpoints",
      },
    ],
    servers,
  };
}
