import { defineWorkersProject } from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersProject({
  test: {
    name: "api.mojis.dev",
    poolOptions: {
      workers: {
        singleWorker: true,
        isolatedStorage: true,
        miniflare: {
          compatibilityFlags: ["nodejs_compat"],
          bindings: {
            ENVIRONMENT: "production",
          },
        },
        wrangler: {
          configPath: "./wrangler.jsonc",
        },
      },
    },
  },
});
